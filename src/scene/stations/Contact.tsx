"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useStationActive } from "./shared";

export default function Contact() {
  const anim = useStationActive(8);
  const portal = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const motes = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    if (!anim) return;
    const t = state.clock.elapsedTime;
    if (portal.current) portal.current.rotation.z += dt * 0.1;
    if (inner.current) inner.current.rotation.z -= dt * 0.25;
    if (motes.current) motes.current.rotation.z += dt * 0.15;
    if (portal.current) {
      const s = 1 + Math.sin(t * 1.2) * 0.02;
      portal.current.scale.setScalar(s);
    }
  });

  return (
    <group position={[0, 1.6, -144]} rotation={[0, 0, 0]}>
      <mesh ref={portal}>
        <torusGeometry args={[2.2, 0.09, 16, 80]} />
        <meshStandardMaterial
          color="#0d1230"
          emissive="#22d3ee"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={inner} position={[0, 0, 0]}>
        <torusGeometry args={[1.7, 0.04, 12, 64]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[2.1, 48]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.07} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {/* Orbiting motes */}
      <group ref={motes}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 3.1, Math.sin(a) * 3.1, 0]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color="#67e8f9" toneMapped={false} />
            </mesh>
          );
        })}
      </group>
      <pointLight position={[0, 0, 1.5]} color="#22d3ee" intensity={18} distance={16} />
    </group>
  );
}
