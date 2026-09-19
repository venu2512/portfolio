"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { damp } from "maath/easing";
import { useSiteStore } from "../../lib/store";
import { experience } from "../../content/data";
import { makeLabelTexture } from "../labels";
import { onActiveExperience, getActiveExperience } from "../../lib/activeExp";

const ACCENT = "#FF6A13";
const PASTELS = ["#FFE3CF", "#C9B8FF", "#A5CFFF", "#FFB8CB", "#FFE29A"];

function useActiveExperience(): number {
  const [v, setV] = useState(getActiveExperience);
  useEffect(() => onActiveExperience(setV), []);
  return v;
}

function KreupaiScene() {
  const tools = experience[0]?.tools ?? [];
  const orbit = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useFrame((_, dt) => {
    const g = orbit.current;
    if (!g) return;
    g.rotation.y += (hovered ? 0.15 : 0.4) * dt;
    for (const c of g.children) {
      const target = hovered && (c.userData.label as string) === hovered ? 1.3 : 1;
      damp(c.scale, "x", target, 8, dt);
      damp(c.scale, "y", target, 8, dt);
      damp(c.scale, "z", target, 8, dt);
    }
  });

  const pick = (label: string) => {
    const idx = label.startsWith("Daftar") ? 2 : 1;
    useSiteStore.getState().set("flashBullet", { expId: "kreupai", index: idx });
    window.setTimeout(() => useSiteStore.getState().set("flashBullet", null), 1200);
  };

  return (
    <group>
      <mesh position={[0, -0.2, 0]}>
        <roundedBoxGeometry args={[1.5, 2.2, 1.1, 4, 0.16]} />
        <meshPhysicalMaterial color={ACCENT} roughness={0.35} clearcoat={0.6} clearcoatRoughness={0.25} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial color="#FFE29A" emissive="#FFB020" emissiveIntensity={2} />
      </mesh>

      <group ref={orbit}>
        {tools.map((label, i) => {
          const a = (i / tools.length) * Math.PI * 2;
          const r = 1.7;
          const tex = makeLabelTexture(label.length > 14 ? label.slice(0, 13) + "…" : label, {
            bg: PASTELS[i % PASTELS.length],
            fg: "#16161a",
          });
          return (
            <group
              key={label}
              position={[Math.cos(a) * r, Math.sin(a * 2) * 0.55, Math.sin(a) * r]}
              userData={{ label }}
            >
              <mesh
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHovered(label);
                }}
                onPointerOut={() => setHovered(null)}
                onClick={() => pick(label)}
              >
                <boxGeometry args={[0.55, 0.55, 0.18]} />
                <meshStandardMaterial map={tex} roughness={0.4} />
              </mesh>
              {hovered === label && (
                <Html center distanceFactor={6} style={{ pointerEvents: "none" }}>
                  <div className="chip chip-white">{label}</div>
                </Html>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}

function QuadScene() {
  const bars = useRef<Array<THREE.Mesh | null>>([]);
  const targetHeights = useMemo(() => [0.5, 0.9, 0.65, 1.15, 0.8, 1.0, 0.55], []);

  useFrame((_, dt) => {
    bars.current.forEach((m, i) => {
      if (!m) return;
      const th = targetHeights[i] ?? 0.5;
      damp(m.scale, "y", Math.max(0.05, th), 4, dt);
      m.position.y = -0.55 + (m.scale.y * 0.9) / 2;
    });
  });

  return (
    <group>
      <mesh position={[0, -0.1, 0]}>
        <roundedBoxGeometry args={[2.6, 1.9, 0.35, 4, 0.14]} />
        <meshPhysicalMaterial color="#A5CFFF" roughness={0.35} clearcoat={0.6} clearcoatRoughness={0.25} />
      </mesh>
      {targetHeights.map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            bars.current[i] = m;
          }}
          position={[-0.95 + i * 0.32, 0, 0.2]}
        >
          <boxGeometry args={[0.18, 0.9, 0.1]} />
          <meshStandardMaterial color={ACCENT} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.75, 0.22]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[2.1, 0.03, 0.02]} />
        <meshStandardMaterial color="#16161a" />
      </mesh>
    </group>
  );
}

function NitroScene() {
  const layers = useMemo(
    () => [
      { y: 1.1, count: 4, color: "#C9B8FF" },
      { y: 0.35, count: 6, color: "#FFE3CF" },
      { y: -0.4, count: 6, color: "#A5CFFF" },
      { y: -1.15, count: 3, color: "#FFB8CB" },
    ],
    []
  );
  const pulse = useRef(0);
  const mats = useRef<Array<THREE.MeshStandardMaterial | null>>([]);

  useFrame((_, dt) => {
    pulse.current += dt;
    const wave = ((pulse.current % 2.5) / 2.5) * 4;
    mats.current.forEach((m, i) => {
      if (!m) return;
      const layerIdx = Math.floor(i / 6);
      const d = Math.abs(wave - layerIdx);
      m.emissiveIntensity = Math.max(0, 1.4 - d * 1.2);
    });
  });

  const meshes: React.ReactNode[] = [];
  let idx = 0;
  layers.forEach((layer, li) => {
    for (let ci = 0; ci < layer.count; ci++) {
      const angle = (ci / layer.count) * Math.PI * 2 + li * 0.4;
      const r = li === 0 || li === 3 ? 0.55 : 0.95;
      const i = idx++;
      meshes.push(
        <mesh key={`${li}-${ci}`} position={[Math.cos(angle) * r, layer.y, Math.sin(angle) * r * 0.6]}>
          <sphereGeometry args={[0.16, 20, 20]} />
          <meshStandardMaterial
            ref={(m) => {
              mats.current[i] = m;
            }}
            color={layer.color}
            emissive={ACCENT}
            emissiveIntensity={0}
            roughness={0.4}
          />
        </mesh>
      );
    }
  });
  return <group>{meshes}</group>;
}

export default function ExperienceStage() {
  const activeIdx = useActiveExperience();
  const refs = useRef<Array<THREE.Group | null>>([null, null, null]);

  useFrame((_, dt) => {
    refs.current.forEach((g, i) => {
      if (!g) return;
      const on = i === activeIdx;
      damp(g.scale, "x", on ? 1 : 0.001, 6, dt);
      damp(g.scale, "y", on ? 1 : 0.001, 6, dt);
      damp(g.scale, "z", on ? 1 : 0.001, 6, dt);
      damp(g.position, "y", on ? 0 : -0.6, 6, dt);
      g.visible = g.scale.x > 0.01;
    });
  });

  return (
    <group>
      <group ref={(g) => { refs.current[0] = g; }}><KreupaiScene /></group>
      <group ref={(g) => { refs.current[1] = g; }}><QuadScene /></group>
      <group ref={(g) => { refs.current[2] = g; }}><NitroScene /></group>
    </group>
  );
}
