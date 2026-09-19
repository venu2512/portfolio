"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { damp } from "maath/easing";
import type { ReactNode } from "react";

const ORANGE = "#FF6A13";

function FloatTilt({ children }: { children: ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const t = useRef(0);
  useFrame((state, dt) => {
    const grp = g.current;
    if (!grp) return;
    t.current += dt;
    grp.position.y = Math.sin(t.current * 1.1) * 0.12;
    const p = state.pointer;
    damp(grp.rotation, "x", -p.y * 0.18, 4, dt);
    damp(grp.rotation, "y", p.x * 0.28, 4, dt);
  });
  return <group ref={g}>{children}</group>;
}

function CertChain() {
  const chain = useRef<THREE.Group>(null);
  const badge = useRef<THREE.Group>(null);
  const t = useRef(0);

  // 5x5 instanced QR pattern on the middle cube
  const qrCells = useMemo<Array<[number, number]>>(() => {
    const cells: Array<[number, number]> = [];
    const pattern = [
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1],
    ];
    pattern.forEach((row, r) => row.forEach((v, c) => v === 1 && cells.push([r, c])));
    return cells;
  }, []);

  useFrame((_, dt) => {
    t.current += dt;
    if (chain.current) chain.current.position.x = Math.sin(t.current * 0.8) * 0.08;
    if (badge.current) badge.current.rotation.y += dt * 1.5;
  });

  return (
    <FloatTilt>
      <group ref={chain}>
        {[-1.3, -0.65, 0, 0.65, 1.3].map((x, i) => (
          <group key={i} position={[x, Math.sin(i) * 0.1, 0]} rotation={[0, i * 0.4, 0]}>
            <mesh>
              <roundedBoxGeometry args={[0.55, 0.55, 0.22, 3, 0.09]} />
              <meshPhysicalMaterial
                color={i % 2 ? "#C9B8FF" : "#FFE3CF"}
                roughness={0.35}
                clearcoat={0.6}
                clearcoatRoughness={0.25}
              />
            </mesh>
            {i === 2 &&
              qrCells.map(([r, c], ci) => (
                <mesh key={ci} position={[-0.2 + c * 0.1, 0.2 - r * 0.1, 0.12]}>
                  <boxGeometry args={[0.08, 0.08, 0.02]} />
                  <meshStandardMaterial color="#16161a" />
                </mesh>
              ))}
          </group>
        ))}
      </group>
      <group ref={badge} position={[1.5, 0.9, 0.3]}>
        <mesh>
          <circleGeometry args={[0.28, 32]} />
          <meshStandardMaterial color="#A5CFFF" />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <torusGeometry args={[0.28, 0.05, 12, 32]} />
          <meshStandardMaterial color={ORANGE} />
        </mesh>
      </group>
    </FloatTilt>
  );
}

function LegalAi() {
  const gavel = useRef<THREE.Group>(null);
  const t = useRef(0);
  useFrame((_, dt) => {
    t.current += dt;
    if (gavel.current) gavel.current.rotation.z = 0.5 + Math.sin(t.current * 2) * 0.35;
  });
  return (
    <FloatTilt>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, -0.7 + i * 0.38, Math.sin(i * 1.2) * 0.12]} rotation={[0, i * 0.3, 0]}>
          <boxGeometry args={[1.5, 0.04, 1.1]} />
          <meshPhysicalMaterial
            color={i % 2 ? "#FFFFFF" : "#A5CFFF"}
            roughness={0.35}
            clearcoat={0.6}
            clearcoatRoughness={0.25}
          />
        </mesh>
      ))}
      <mesh position={[0, -0.3, 0]}>
        <icosahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.5} />
      </mesh>
      <group ref={gavel} position={[0.9, 0.9, 0.4]}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.3, 24]} />
          <meshStandardMaterial color="#8A5A3B" />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
          <meshStandardMaterial color="#8A5A3B" />
        </mesh>
      </group>
    </FloatTilt>
  );
}

function CloudNova() {
  const orbiter1 = useRef<THREE.Group>(null);
  const orbiter2 = useRef<THREE.Group>(null);
  const puffs = useMemo<Array<[number, number, number, number]>>(() => {
    const arr: Array<[number, number, number, number]> = [];
    let seed = 7;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < 12; i++) {
      arr.push([(rand() - 0.5) * 2.4, (rand() - 0.5) * 1.2, (rand() - 0.5) * 1.0, 0.28 + rand() * 0.3]);
    }
    return arr;
  }, []);

  useFrame((_, dt) => {
    if (orbiter1.current) orbiter1.current.rotation.y += dt * 0.9;
    if (orbiter2.current) orbiter2.current.rotation.y -= dt * 0.7;
  });

  return (
    <FloatTilt>
      {puffs.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 24, 24]} />
          <meshPhysicalMaterial color={i % 3 === 0 ? "#A5CFFF" : "#FFFFFF"} roughness={0.4} clearcoat={0.5} />
        </mesh>
      ))}
      <group ref={orbiter1}>
        <mesh position={[1.7, 0.5, 0]}>
          <boxGeometry args={[0.5, 0.3, 0.12]} />
          <meshStandardMaterial color="#FFE29A" />
        </mesh>
      </group>
      <group ref={orbiter2}>
        <mesh position={[-1.7, -0.4, 0]}>
          <boxGeometry args={[0.5, 0.3, 0.12]} />
          <meshStandardMaterial color="#FFB8CB" />
        </mesh>
      </group>
    </FloatTilt>
  );
}

export default function ProjectMini({ pid }: { pid: "certchain" | "legal-ai" | "cloud-nova" }) {
  if (pid === "certchain") return <CertChain />;
  if (pid === "legal-ai") return <LegalAi />;
  return <CloudNova />;
}
