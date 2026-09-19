"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { damp } from "maath/easing";
import { useSiteStore } from "../../lib/store";
import { profile } from "../../content/data";
import photoMeta from "../../content/photo-meta.json";
import { makeRoundedRectMask, coverFit } from "../labels";
import BlobShadow from "../BlobShadow";

const CHIP_COLORS: Record<string, string> = {
  primary: "#FF6A13",
  lavender: "#C9B8FF",
  blush: "#FFB8CB",
  sky: "#A5CFFF",
  cream: "#FFE29A",
};

function chipsOf(skills: Array<{ items: string[]; color: string }>) {
  return profile.heroChips.map((label) => {
    const cat = skills.find((s) => s.items.some((i) => i.startsWith(label)));
    return { label, color: CHIP_COLORS[cat?.color ?? "primary"] ?? CHIP_COLORS.primary };
  });
}

export default function HeroMedallion() {
  const group = useRef<THREE.Group>(null);
  const chipsGroup = useRef<THREE.Group>(null);
  const [texReady, setTexReady] = useState(false);
  const theme = useSiteStore((s) => s.theme);
  const reduced = useSiteStore((s) => s.reducedMotion);

  const hasPhoto = (photoMeta as { hasPhoto: boolean }).hasPhoto;

  // Loads only when a photo exists (suspend otherwise handled by placeholder).
  const photo = useLoader(
    THREE.TextureLoader,
    hasPhoto ? ["/profile/generated/profile-960.webp"] : []
  ) as unknown as THREE.Texture[] | undefined;
  const photoTex = hasPhoto ? (photo?.[0] ?? null) : null;

  useEffect(() => {
    if (!photoTex) return;
    const id = window.setTimeout(() => {
      // Texture objects live outside React's tree — mutation is intentional.
      photoTex.colorSpace = THREE.SRGBColorSpace;
      photoTex.anisotropy = 8;
      coverFit(photoTex as never, 1, profile.photo.focus);
      setTexReady(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, [photoTex]);

  const mask = useMemo(() => makeRoundedRectMask(0.12, 512), []);
  const bezelMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: theme === "dark" ? "#232329" : "#ffffff",
        roughness: 0.35,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
      }),
    [theme]
  );
  const rimMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#FF6A13", roughness: 0.4 }),
    []
  );
  const glowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#FF6A13",
        transparent: true,
        opacity: theme === "dark" ? 0.22 : 0.16,
        depthWrite: false,
      }),
    [theme]
  );

  const chips = useMemo(
    () =>
      chipsOf([
        { items: ["Python"], color: "primary" },
        { items: ["Multi-Agent Systems"], color: "lavender" },
        { items: ["QLoRA"], color: "sky" },
        { items: ["Ethereum"], color: "cream" },
        { items: ["React.js"], color: "blush" },
      ]),
    []
  );

  const chipMats = useMemo(
    () => chips.map((c) => new THREE.MeshStandardMaterial({ color: c.color, roughness: 0.45 })),
    [chips]
  );

  const lastPointer = useRef(0);
  const t = useRef(0);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    t.current += dt;
    const p = state.pointer; // -1..1 (eventSource maps to app root)
    const now = performance.now();
    if (Math.abs(p.x) + Math.abs(p.y) > 0.001) lastPointer.current = now;

    const idle = now - lastPointer.current > 2000;
    const tx = reduced ? 0 : -p.y * 0.22 + (idle ? Math.sin(t.current * 0.6) * 0.06 : 0);
    const ty = reduced ? 0 : p.x * 0.35 + (idle ? Math.sin(t.current * 0.6) * 0.12 : 0);
    damp(g.rotation, "x", tx, 5, dt);
    damp(g.rotation, "y", ty, 5, dt);

    // Entry animation handled by scale damp below (0.85 -> 1).
    damp(g.scale, "x", texReady ? 1 : 0.85, 4, dt);
    damp(g.scale, "y", texReady ? 1 : 0.85, 4, dt);
    damp(g.scale, "z", texReady ? 1 : 0.85, 4, dt);

    // Chips bob
    const cg = chipsGroup.current;
    if (cg) {
      cg.children.forEach((child, i) => {
        child.position.y += Math.sin(t.current * 1.2 + i * 1.7) * 0.0008;
      });
    }
  });

  return (
    <>
      {/* Glow disc behind */}
      <mesh position={[0, 0, -1.2]}>
        <circleGeometry args={[2.1, 48]} />
        <primitive object={glowMat} attach="material" />
      </mesh>

      <group ref={group}>
        {/* Bezel slab */}
        <mesh position={[0, 0, -0.06]}>
          <roundedBoxGeometry args={[2.5, 2.5, 0.12, 4, 0.18]} />
          <primitive object={bezelMat} attach="material" />
        </mesh>
        {/* Orange rim */}
        <mesh position={[0, 0, -0.125]}>
          <roundedBoxGeometry args={[2.62, 2.62, 0.04, 4, 0.2]} />
          <primitive object={rimMat} attach="material" />
        </mesh>
        {/* Photo / monogram plane */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[2.26, 2.26]} />
          {photoTex ? (
            <meshBasicMaterial map={photoTex} alphaMap={mask} alphaTest={0.5} toneMapped={false} />
          ) : (
            <meshBasicMaterial color="#FF6A13" alphaMap={mask} alphaTest={0.5} />
          )}
        </mesh>

        {/* Floating keycap chips */}
        <group ref={chipsGroup}>
          {chips.map((c, i) => {
            const angle = (i / chips.length) * Math.PI * 2 + 0.6;
            const radius = 1.75 + (i % 2) * 0.25;
            const y = -0.8 + i * 0.42;
            return (
              <mesh
                key={c.label}
                position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.4]}
                material={chipMats[i]}
              >
                <boxGeometry args={[0.62, 0.62, 0.2]} />
              </mesh>
            );
          })}
        </group>
      </group>
      <BlobShadow targetRef={group} y={-1.9} scale={2.6} />
    </>
  );
}
