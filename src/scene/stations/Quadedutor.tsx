"use client";

import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStationActive } from "./shared";

function makeRng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const BAR_COUNT = 14;

export default function Quadedutor() {
  const anim = useStationActive(3);
  const inst = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const phase = useRef(0); // 0..1 ease toward target on activation

  const { targets, chartPts } = useMemo(() => {
    const rng = makeRng(7);
    const t: number[] = [];
    for (let i = 0; i < BAR_COUNT; i++) t.push(0.3 + rng() * 1.7);
    const rng2 = makeRng(13);
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 12; i++) {
      pts.push([(i - 5.5) * 0.42, -0.6 + rng2() * 1.1, 0.42]);
    }
    return { targets: t, chartPts: pts };
  }, []);

  useFrame((_, dt) => {
    if (!anim) return;
    phase.current = Math.min(1, phase.current + dt * 0.8);
    const eased = 1 - Math.pow(1 - phase.current, 3);
    const mesh = inst.current;
    if (!mesh) return;
    for (let i = 0; i < BAR_COUNT; i++) {
      const h = (targets[i] ?? 0.5) * eased + 0.08;
      dummy.position.set((i - (BAR_COUNT - 1) / 2) * 0.32, h / 2, 0);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[-2, 1.4, -45]} rotation={[0, 0.5, 0]}>
      {/* Angled panel */}
      <mesh position={[0, 0.4, -0.15]}>
        <boxGeometry args={[5.4, 3.2, 0.12]} />
        <meshStandardMaterial
          color="#0a0f26"
          emissive="#8b5cf6"
          emissiveIntensity={0.12}
          transparent
          opacity={0.82}
          toneMapped={false}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(5.4, 3.2, 0.12)]} />
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.5} toneMapped={false} />
      </lineSegments>

      {/* Instanced bars (clean -> EDA -> models flow) */}
      <instancedMesh ref={inst} args={[undefined, undefined, BAR_COUNT]}>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.85} toneMapped={false} />
      </instancedMesh>

      {/* Sparkline */}
      <Line points={chartPts} color="#f59e0b" lineWidth={1.5} />
    </group>
  );
}
