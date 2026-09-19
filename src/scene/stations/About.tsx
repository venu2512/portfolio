"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { profile } from "../../content/data";
import { useStationActive } from "./shared";
import { Html } from "@react-three/drei";

export default function About() {
  const anim = useStationActive(1);
  const ring1 = useRef<THREE.Group>(null);
  const ring2 = useRef<THREE.Group>(null);
  const ring3 = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (!anim) return;
    if (ring1.current) ring1.current.rotation.z += dt * 0.35;
    if (ring2.current) ring2.current.rotation.x += dt * 0.28;
    if (ring3.current) ring3.current.rotation.y += dt * 0.22;
  });

  return (
    <group position={[-1, 0, -6]}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[0.9, 24, 24]} />
        <meshStandardMaterial
          color="#0b1030"
          emissive="#8b5cf6"
          emissiveIntensity={0.9}
          toneMapped={false}
        />
      </mesh>

      {/* Orbiting rings */}
      <group ref={ring1}>
        <mesh>
          <torusGeometry args={[1.8, 0.02, 8, 64]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} toneMapped={false} />
        </mesh>
      </group>
      <group ref={ring2} rotation={[Math.PI / 3, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.3, 0.02, 8, 64]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} toneMapped={false} />
        </mesh>
      </group>
      <group ref={ring3} rotation={[0, Math.PI / 4, Math.PI / 6]}>
        <mesh>
          <torusGeometry args={[2.8, 0.02, 8, 64]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.45} toneMapped={false} />
        </mesh>
      </group>

      {/* Language nodes */}
      {profile.languages.map((l, i) => {
        const angle = (i / profile.languages.length) * Math.PI * 2;
        const r = 3.4;
        return (
          <group key={l.name} position={[Math.cos(angle) * r, Math.sin(angle) * r * 0.4, Math.sin(angle) * r]}>
            <mesh>
              <sphereGeometry args={[0.13, 12, 12]} />
              <meshBasicMaterial color="#22d3ee" toneMapped={false} />
            </mesh>
            <Html center distanceFactor={14} style={{ pointerEvents: "none" }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  color: "#9aa7c7",
                  whiteSpace: "nowrap",
                  textShadow: "0 0 8px rgba(0,0,0,0.9)",
                }}
              >
                {l.name}
              </span>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
