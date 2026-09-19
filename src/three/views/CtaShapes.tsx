"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { damp } from "maath/easing";

export default function CtaShapes() {
  const g = useRef<THREE.Group>(null);
  const t = useRef(0);

  useFrame((state, dt) => {
    const grp = g.current;
    if (!grp) return;
    t.current += dt;
    grp.children.forEach((c, i) => {
      c.position.y += Math.sin(t.current * (0.8 + i * 0.15) + i) * 0.002;
      c.rotation.y += dt * (0.2 + i * 0.08);
      c.rotation.x += dt * 0.1;
    });
    const p = state.pointer;
    damp(grp.rotation, "x", -p.y * 0.1, 3, dt);
    damp(grp.rotation, "y", p.x * 0.16, 3, dt);
  });

  return (
    <group ref={g}>
      <mesh position={[-1.1, 0.4, 0]}>
        <torusGeometry args={[0.42, 0.16, 16, 40]} />
        <meshPhysicalMaterial color="#FFE3CF" roughness={0.35} clearcoat={0.6} />
      </mesh>
      <mesh position={[0.2, 0.9, -0.4]}>
        <sphereGeometry args={[0.34, 28, 28]} />
        <meshPhysicalMaterial color="#FFFFFF" roughness={0.3} clearcoat={0.7} />
      </mesh>
      <mesh position={[1.0, -0.5, 0.2]} rotation={[0.5, 0.4, 0]}>
        <roundedBoxGeometry args={[0.6, 0.6, 0.6, 4, 0.16]} />
        <meshPhysicalMaterial color="#C9B8FF" roughness={0.35} clearcoat={0.6} />
      </mesh>
      <mesh position={[-0.6, -0.9, 0.3]} rotation={[1.1, 0.2, 0]}>
        <torusGeometry args={[0.36, 0.1, 14, 36]} />
        <meshPhysicalMaterial color="#FFB8CB" roughness={0.35} clearcoat={0.6} />
      </mesh>
    </group>
  );
}
