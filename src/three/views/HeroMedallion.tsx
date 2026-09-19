"use client";

/**
 * Hero Profile Medallion (§8.1) — product-shot framing, fov 35 (camera in
 * CanvasRoot). Three modes:
 *  A (photo): rounded white bezel slab + thin orange rim, photo plane, three
 *    floating keycap chips (heroChips × category colors), soft orange glow.
 *  B (photo + cutout): back = animated orange blob (icosphere + sin noise),
 *    mid = cutout plane, front = chips; parallax scales by depth.
 *  C (no photo): slab with an orange rounded panel (monogram lives in the DOM
 *    fallback).
 * Cursor tracking damps rotation toward the pointer relative to the page
 * (eventSource = #app-root), with idle sway after 2 s without pointer input —
 * also the touch behavior. Reduced motion: static pose, no chips bob.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { damp } from "maath/easing";
import { useSiteStore } from "../../lib/store";
import { profile, skills, keycapLabel } from "../../content/data";
import photoMeta from "../../content/photo-meta.json";
import { makeRoundedRectMask, coverFit } from "../labels";
import { getViewPointer } from "../pointer";
import BlobShadow from "../BlobShadow";

const CHIP_COLORS: Record<string, string> = {
  primary: "#FF6A13",
  lavender: "#C9B8FF",
  blush: "#FFB8CB",
  sky: "#A5CFFF",
  cream: "#FFE29A",
  white: "#FFFFFF",
  ink: "#3A3A42",
};

const DEFAULT_CHIP_COLOR = "#FF6A13";

/** heroChips → { label, color } resolved against the skills categories. */
function useHeroChips(): Array<{ label: string; color: string }> {
  return useMemo(
    () =>
      profile.heroChips.map((label) => {
        const cat = skills.find((s) => s.items.some((i) => keycapLabel(i) === label || i === label));
        const color = CHIP_COLORS[cat?.color ?? "primary"];
        return { label, color: color ?? DEFAULT_CHIP_COLOR };
      }),
    []
  );
}

/** Animated blob (mode B backdrop): icosphere with sin-noise vertex wobble. */
function Blob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const base = useRef<Float32Array | null>(null);
  const reduced = useSiteStore((s) => s.reducedMotion);
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#FF6A13",
        roughness: 0.35,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
      }),
    []
  );
  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    const pos = mesh?.geometry.attributes.position;
    if (!mesh || !pos) return;
    if (reduced) return; // static blob under reduced motion (§9)
    // Capture the rest pose once (first frame) for the noise displacement.
    if (!base.current) base.current = Float32Array.from(pos.array);
    const t = clock.elapsedTime;
    for (let i = 0; i < pos.count; i++) {
      const ix = i * 3;
      const nx = base.current[ix] ?? 0;
      const ny = base.current[ix + 1] ?? 0;
      const nz = base.current[ix + 2] ?? 0;
      const w =
        Math.sin(nx * 1.8 + t * 1.1) * 0.05 +
        Math.sin(ny * 2.2 - t * 0.9) * 0.05 +
        Math.sin(nz * 2.0 + t * 0.7) * 0.05;
      const len = Math.hypot(nx, ny, nz) || 1;
      const k = 1 + w / len;
      pos.setXYZ(i, nx * k, ny * k, nz * k);
    }
    pos.needsUpdate = true;
  });
  return (
    <mesh ref={meshRef} material={mat} scale={[1.15, 1.35, 0.9]}>
      <icosahedronGeometry args={[1.35, 5]} />
    </mesh>
  );
}

export default function HeroMedallion() {
  const group = useRef<THREE.Group>(null);
  const chipsGroup = useRef<THREE.Group>(null);
  const [texReady, setTexReady] = useState(false);
  const theme = useSiteStore((s) => s.theme);
  const reduced = useSiteStore((s) => s.reducedMotion);
  const maxAnisotropy = useThree((s) => s.gl.capabilities.getMaxAnisotropy());
  const chips = useHeroChips();

  const hasPhoto = (photoMeta as { hasPhoto: boolean }).hasPhoto;
  const hasCutout = (photoMeta as { hasCutout?: boolean }).hasCutout === true;

  // Loads only when a photo exists; ≤1024px cap keeps the texture budget (§10).
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
      // §7: cap anisotropy at 8, never above what the GPU supports.
      photoTex.anisotropy = Math.min(8, maxAnisotropy);
      coverFit(photoTex as never, 1, profile.photo.focus);
      setTexReady(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, [photoTex, maxAnisotropy]);

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
  const rimMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#FF6A13", roughness: 0.4 }), []);
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
  const chipMats = useMemo(
    () => chips.map((c) => new THREE.MeshStandardMaterial({ color: c.color, roughness: 0.45 })),
    [chips]
  );

  const lastPointer = useRef(0);
  const t = useRef(0);

  useFrame((_state, dt) => {
    const g = group.current;
    if (!g) return;
    t.current += dt;
    // Pointer relative to the hero placeholder rect (§8.1), not the window.
    const p = getViewPointer("hero");
    const now = performance.now();
    if (p && now - p.last < 120) lastPointer.current = now;

    // Idle sway after 2 s without pointer input (also the touch behavior).
    const idle = now - lastPointer.current > 2000;
    const swayX = idle ? Math.sin(t.current * 0.6) * 0.06 : 0;
    const swayY = idle ? Math.sin(t.current * 0.6) * 0.12 : 0;
    // Reduced motion: no tilt, no sway — static pose only.
    const tx = reduced ? 0 : (p ? -p.y * 0.22 : 0) + swayX;
    const ty = reduced ? 0 : (p ? p.x * 0.35 : 0) + swayY;
    damp(g.rotation, "x", tx, 5, dt);
    damp(g.rotation, "y", ty, 5, dt);

    // Entry animation: scale .85 → 1 (§8.1).
    const targetScale = texReady || !hasPhoto ? 1 : 0.85;
    damp(g.scale, "x", targetScale, 4, dt);
    damp(g.scale, "y", targetScale, 4, dt);
    damp(g.scale, "z", targetScale, 4, dt);

    // Chips bob gently (skipped under reduced motion).
    const cg = chipsGroup.current;
    if (cg && !reduced) {
      cg.children.forEach((child, i) => {
        child.position.y += Math.sin(t.current * 1.2 + i * 1.7) * 0.0008;
      });
    }
  });

  return (
    <>
      {/* Soft orange radial glow behind */}
      <mesh position={[0, 0, -1.2]}>
        <circleGeometry args={[2.1, 48]} />
        <primitive object={glowMat} attach="material" />
      </mesh>

      {hasPhoto && hasCutout ? (
        // ---- Mode B: cutout photo over animated blob ----
        <group ref={group}>
          <Blob />
          <mesh position={[0, 0.1, 0.5]}>
            <planeGeometry args={[2.26, 2.26]} />
            <meshBasicMaterial
              map={photoTex ?? undefined}
              transparent
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          <group ref={chipsGroup} position={[0, 0, 1.0]}>
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
      ) : (
        // ---- Mode A (photo) / Mode C (no photo): bezel slab ----
        <group ref={group}>
          <mesh position={[0, 0, -0.06]}>
            <roundedBoxGeometry args={[2.5, 2.5, 0.12, 4, 0.18]} />
            <primitive object={bezelMat} attach="material" />
          </mesh>
          <mesh position={[0, 0, -0.125]}>
            <roundedBoxGeometry args={[2.62, 2.62, 0.04, 4, 0.2]} />
            <primitive object={rimMat} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[2.26, 2.26]} />
            {photoTex ? (
              <meshBasicMaterial map={photoTex} alphaMap={mask} alphaTest={0.5} toneMapped={false} />
            ) : (
              <meshBasicMaterial color="#FF6A13" alphaMap={mask} alphaTest={0.5} />
            )}
          </mesh>
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
      )}
      <BlobShadow targetRef={group} y={-1.9} scale={2.6} />
    </>
  );
}
