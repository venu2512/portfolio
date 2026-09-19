"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { experience } from "../../content/data";
import { useSiteStore } from "../../lib/store";
import { useStationActive } from "./shared";

const ORBIT_RADII = [2.4, 2.9, 3.4, 3.9, 4.4];
const ORBIT_SPEEDS = [0.5, 0.42, 0.36, 0.3, 0.25];
const ORBIT_TILTS = [0.2, -0.35, 0.5, -0.15, 0.65];

export default function Kreupai() {
  const anim = useStationActive(2);
  const hoveredId = useSiteStore((s) => s.hoveredId);
  const set = useSiteStore((s) => s.set);
  const exp = experience[0];
  const tools = exp?.tools ?? [];
  const groupRefs = useRef<Array<THREE.Group | null>>([]);

  const hoverIndex = tools.findIndex((t) => hoveredId === `sat-${exp?.id}-${t}`);

  useFrame((state, dt) => {
    if (!anim) return;
    groupRefs.current.forEach((g, i) => {
      if (!g) return;
      const speed = ORBIT_SPEEDS[i] ?? 0.3;
      const slow = hoverIndex >= 0 ? 0.25 : 1;
      g.rotation.y += dt * speed * 0.4 * slow;
    });
  });

  return (
    <group position={[1, 1.5, -25]}>
      {/* Monolith */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1.4, 5.5, 0.8]} />
        <meshStandardMaterial
          color="#0d1230"
          emissive="#22d3ee"
          emissiveIntensity={0.35}
          metalness={0.6}
          roughness={0.4}
          toneMapped={false}
        />
      </mesh>
      {/* Edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.4, 5.5, 0.8)]} />
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.7} toneMapped={false} />
      </lineSegments>
      {/* Amber beacon for "current" */}
      <mesh position={[0, 4.6, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshBasicMaterial color="#f59e0b" toneMapped={false} />
      </mesh>
      <pointLight position={[0, 4.6, 0]} color="#f59e0b" intensity={6} distance={8} />

      {/* Satellites */}
      {tools.map((tool, i) => {
        const radius = ORBIT_RADII[i] ?? 2.5;
        const tilt = ORBIT_TILTS[i] ?? 0;
        const id = `sat-${exp?.id}-${tool}`;
        const isHovered = hoveredId === id;
        return (
          <group key={tool} ref={(el) => { groupRefs.current[i] = el; }}>
            <group rotation={[tilt, 0, 0]}>
              <group
                onPointerOver={(e) => {
                  e.stopPropagation();
                  set("hoveredId", id);
                }}
                onPointerOut={() => set("hoveredId", null)}
                onClick={(e) => {
                  e.stopPropagation();
                  set("selectedId", `exp:${exp?.id}`);
                }}
              >
                <mesh position={[radius, 0, 0]}>
                  <octahedronGeometry args={[0.26, 0]} />
                  <meshBasicMaterial color={isHovered ? "#f59e0b" : "#22d3ee"} toneMapped={false} />
                </mesh>
              </group>
            </group>
            {isHovered && (
              <Html position={[radius, 0.55, 0]} center distanceFactor={13} style={{ pointerEvents: "none" }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.62rem",
                    color: "#67e8f9",
                    whiteSpace: "nowrap",
                    background: "rgba(5,6,13,0.85)",
                    padding: "2px 8px",
                    borderRadius: 6,
                    border: "1px solid rgba(34,211,238,0.4)",
                  }}
                >
                  {tool}
                </span>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
