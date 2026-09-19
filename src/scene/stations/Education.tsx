"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useStationActive } from "./shared";

export default function Education() {
  const anim = useStationActive(7);
  const top = useRef<THREE.Group>(null);
  const bottom = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    if (!anim) return;
    const t = state.clock.elapsedTime;
    if (top.current) top.current.position.y = 1.9 + Math.sin(t * 0.5) * 0.12;
    if (bottom.current) bottom.current.rotation.y += dt * 0.08;
  });

  return (
    <group position={[0, 0.8, -124]}>
      {/* Top platform (PPG) */}
      <group ref={top} position={[0, 1.9, 0]}>
        <mesh>
          <cylinderGeometry args={[1.7, 1.9, 0.18, 32]} />
          <meshStandardMaterial
            color="#0a0f26"
            emissive="#22d3ee"
            emissiveIntensity={0.22}
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.1, 0.03, 8, 48]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} toneMapped={false} />
        </mesh>
      </group>

      {/* Bottom platform (MSR) */}
      <group ref={bottom} position={[0, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[2.1, 2.3, 0.18, 32]} />
          <meshStandardMaterial
            color="#0a0f26"
            emissive="#8b5cf6"
            emissiveIntensity={0.18}
            transparent
            opacity={0.75}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.4, 0.03, 8, 48]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
