"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useSiteStore } from "../../lib/store";
import { tierTables } from "../../lib/quality";

function makeRng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export default function Hero() {
  const active = useSiteStore((s) => s.active);
  const detectedTier = useSiteStore((s) => s.detectedTier);
  const runtimeTier = useSiteStore((s) => s.runtimeTier);
  const anim = Math.abs(active - 0) <= 1;
  const { particles } = tierTables(detectedTier === runtimeTier ? runtimeTier : detectedTier);
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = particles;

  const { positions, linePositions } = useMemo(() => {
    const rng = makeRng(42);
    const pos = new Float32Array(particleCount * 3);
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < particleCount; i++) {
      // Shell distribution around the hero core.
      const r = 6 + rng() * 10;
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = (r * Math.cos(phi)) / 2 + 1.5;
      const z = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      pts.push(new THREE.Vector3(x, y, z));
    }
    // Connect nearest particles — computed once at mount.
    const linePts: number[] = [];
    const maxDist = 1.6;
    for (let i = 0; i < Math.min(pts.length, 260); i++) {
      const a = pts[i] as THREE.Vector3;
      for (let j = i + 1; j < Math.min(pts.length, 260); j++) {
        const b = pts[j] as THREE.Vector3;
        if (a.distanceTo(b) < maxDist) {
          linePts.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
    }
    return { positions: pos, linePositions: new Float32Array(linePts) };
  }, [particleCount]);

  useFrame((state, dt) => {
    if (!anim) return;
    const t = state.clock.elapsedTime;
    if (core.current) {
      core.current.rotation.y += dt * 0.12;
      core.current.rotation.x = Math.sin(t * 0.18) * 0.14;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= dt * 0.01;
    }
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.4) * 0.18;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Wireframe icosahedron core */}
      <mesh ref={core}>
        <icosahedronGeometry args={[2.2, 2]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color="#0b1030"
          emissive="#22d3ee"
          emissiveIntensity={0.35}
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </mesh>

      {/* Particle field */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#67e8f9"
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
          toneMapped={false}
        />
      </points>

      {/* Nearest-neighbor connecting lines (hero-only or full, per tier) */}
      {linePositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#8b5cf6" transparent opacity={0.16} toneMapped={false} />
        </lineSegments>
      )}
    </group>
  );
}
