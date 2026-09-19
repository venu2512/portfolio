"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { projects } from "../../content/data";
import { useSiteStore } from "../../lib/store";
import { useStationActive } from "./shared";

export default function Projects() {
  const anim = useStationActive(6);
  const hoveredId = useSiteStore((s) => s.hoveredId);
  const set = useSiteStore((s) => s.set);

  return (
    <group position={[-2, 0, -105]}>
      {projects.map((p, i) => (
        <Pedestal
          key={p.id}
          x={(i - 1) * 3.6}
          variant={p.id as "certchain" | "legal-ai" | "cloud-nova"}
          hovered={hoveredId === `proj-${p.id}`}
          anim={anim}
          onHover={(h) => set("hoveredId", h ? `proj-${p.id}` : null)}
          onClick={() => set("selectedId", `proj:${p.id}`)}
        />
      ))}
    </group>
  );
}

interface PedestalProps {
  x: number;
  variant: "certchain" | "legal-ai" | "cloud-nova";
  hovered: boolean;
  anim: boolean;
  onHover: (h: boolean) => void;
  onClick: () => void;
}

function Pedestal({ x, variant, hovered, anim, onHover, onClick }: PedestalProps) {
  const group = useRef<THREE.Group>(null);
  const lift = useRef(0);
  const [t] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state, dt) => {
    if (!group.current) return;
    lift.current = THREE.MathUtils.damp(lift.current, hovered ? 0.4 : 0, 6, dt);
    group.current.position.y = lift.current;
    if (anim) {
      group.current.position.y += Math.sin(state.clock.elapsedTime * 0.8 + t) * 0.04;
    }
  });

  return (
    <group
      position={[x, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
      }}
      onPointerOut={() => onHover(false)}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <group ref={group}>
        {/* Pedestal base */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.9, 1.05, 0.7, 24]} />
          <meshStandardMaterial
            color="#0a0f26"
            emissive={hovered ? "#22d3ee" : "#8b5cf6"}
            emissiveIntensity={hovered ? 0.5 : 0.18}
            toneMapped={false}
          />
        </mesh>
        {/* Exhibit */}
        <group position={[0, 1.75, 0]}>
          {variant === "certchain" && <CertChain />}
          {variant === "legal-ai" && <LegalAI />}
          {variant === "cloud-nova" && <CloudNova />}
        </group>
      </group>
    </group>
  );
}

function CertChain() {
  const cubes = useMemo(() => [0, 1, 2, 3, 4], []);
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.3;
  });
  return (
    <group ref={g}>
      {cubes.map((i) => (
        <mesh key={i} position={[(i - 2) * 0.5, Math.sin(i) * 0.12, 0]} rotation={[0, i * 0.4, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial
            color="#0d1230"
            emissive="#22d3ee"
            emissiveIntensity={0.7}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* QR-like 5x5 instanced pattern on a plate */}
      <QrPlate />
    </group>
  );
}

function QrPlate() {
  const pattern = useMemo(() => {
    const rng = () => {
      const x = Math.sin(12345) * 10000;
      return x - Math.floor(x);
    };
    const cells: [number, number][] = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        // Deterministic pseudo-pattern with solid corner finder boxes.
        const isFinder = (r < 2 && c < 2) || (r < 2 && c > 2) || (r > 2 && c < 2);
        const on = isFinder || rng() > 0.55;
        if (on) cells.push([(c - 2) * 0.07, (2 - r) * 0.07]);
      }
    }
    return cells;
  }, []);

  const instRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const mesh = instRef.current;
    if (!mesh || (mesh as THREE.InstancedMesh & { __done?: boolean }).__done) return;
    pattern.forEach(([cx, cy], i) => {
      dummy.position.set(cx, cy, 0.18);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    (mesh as THREE.InstancedMesh & { __done?: boolean }).__done = true;
  });

  return (
    <group position={[0, -0.55, 0]}>
      <mesh>
        <planeGeometry args={[0.55, 0.55]} />
        <meshBasicMaterial color="#05060d" side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <instancedMesh ref={instRef} args={[undefined, undefined, Math.max(1, pattern.length)]}>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <meshBasicMaterial color="#67e8f9" toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function LegalAI() {
  const pages = useMemo(() => [0, 1, 2, 3], []);
  const ico = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ico.current) ico.current.rotation.y += dt * 0.5;
  });
  return (
    <group>
      {pages.map((i) => (
        <mesh key={i} position={[0, -0.3 + i * 0.22, 0]} rotation={[-Math.PI / 2.2, 0, i * 0.14]}>
          <planeGeometry args={[0.62, 0.85]} />
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.28}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
      <mesh ref={ico} position={[0, 0.85, 0]}>
        <icosahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial
          color="#0d1230"
          emissive="#f59e0b"
          emissiveIntensity={0.9}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function CloudNova() {
  const g = useRef<THREE.Group>(null);
  const nodes = useMemo(() => {
    const rng = (n: number) => {
      const x = Math.sin(n * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: 12 }, (_, i) => ({
      pos: [(rng(i + 1) - 0.5) * 1.5, (rng(i + 31) - 0.5) * 0.8, (rng(i + 61) - 0.5) * 1.0] as [number, number, number],
      r: 0.14 + rng(i + 91) * 0.2,
    }));
  }, []);
  const orbit = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.12;
    if (orbit.current) orbit.current.rotation.y += dt * 0.8;
  });
  return (
    <group>
      <group ref={g}>
        {nodes.map((n, i) => (
          <mesh key={i} position={n.pos}>
            <sphereGeometry args={[n.r, 14, 14]} />
            <meshStandardMaterial
              color="#132048"
              emissive="#22d3ee"
              emissiveIntensity={0.28}
              transparent
              opacity={0.85}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
      <group ref={orbit}>
        <mesh position={[1.1, 0.35, 0]}>
          <sphereGeometry args={[0.09, 10, 10]} />
          <meshBasicMaterial color="#f59e0b" toneMapped={false} />
        </mesh>
      </group>
      <group ref={orbit} rotation={[0, Math.PI, 0]}>
        <mesh position={[1.1, -0.2, 0]}>
          <sphereGeometry args={[0.09, 10, 10]} />
          <meshBasicMaterial color="#8b5cf6" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
