"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { damp } from "maath/easing";
import { makeLabelTexture } from "../labels";
import { getViewPointer } from "../pointer";
import { useSiteStore } from "../../lib/store";
import type { ReactNode } from "react";

export type MiniPid =
  | "ai-college"
  | "ebook-studio"
  | "code-judge"
  | "automl-pipeline"
  | "certchain"
  | "legal-ai"
  | "cloud-nova";

const ORANGE = "#FF6A13";

/**
 * Float bob + tilt toward the pointer relative to THIS card's rect (§8.4,
 * per-slot pointer — `state.pointer` maps to the whole page) + 0.25 hover
 * lift. Reduced motion: static pose (bob/tilt off; hover lift kept — it is
 * user-initiated feedback, not idle motion).
 */
function FloatTilt({ pid, children }: { pid: MiniPid; children: ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const t = useRef(0);
  const [hovered, setHovered] = useState(false);
  const reduced = useSiteStore((s) => s.reducedMotion);

  useFrame((_state, dt) => {
    const grp = g.current;
    if (!grp) return;
    t.current += dt;
    const bob = reduced ? 0 : Math.sin(t.current * 1.1) * 0.12;
    damp(grp.position, "y", bob + (hovered ? 0.25 : 0), 5, dt);
    const p = getViewPointer(`project-${pid}`);
    const rx = !reduced && p ? -p.y * 0.18 : 0;
    const ry = !reduced && p ? p.x * 0.28 : 0;
    damp(grp.rotation, "x", rx, 4, dt);
    damp(grp.rotation, "y", ry, 4, dt);
  });

  return (
    <group
      ref={g}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {children}
    </group>
  );
}

function AiCollege() {
  const hub = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);
  const t = useRef(0);
  const reduced = useSiteStore((s) => s.reducedMotion);

  const agentPositions = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      return [
        Math.cos(angle) * 1.5,
        Math.sin(angle) * 0.85,
        Math.sin(angle * 2) * 0.25,
      ] as [number, number, number];
    });
  }, []);

  useFrame((_, dt) => {
    if (reduced) return;
    t.current += dt;
    if (orbit.current) orbit.current.rotation.y += dt * 0.55;
    if (hub.current) hub.current.rotation.z += dt * 0.35;
  });

  return (
    <FloatTilt pid="ai-college">
      {/* Central coordinator hub */}
      <group ref={hub}>
        <mesh>
          <octahedronGeometry args={[0.55, 0]} />
          <meshPhysicalMaterial
            color={ORANGE}
            emissive={ORANGE}
            emissiveIntensity={0.4}
            roughness={0.25}
            clearcoat={0.8}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[0.85, 0.03, 16, 48]} />
          <meshStandardMaterial color="#C9B8FF" roughness={0.3} />
        </mesh>
      </group>

      {/* 8 specialized AI agents */}
      <group ref={orbit}>
        {agentPositions.map((pos, i) => (
          <group key={i} position={pos}>
            <mesh>
              <sphereGeometry args={[0.18, 20, 20]} />
              <meshPhysicalMaterial
                color={i % 2 === 0 ? "#A5CFFF" : "#C9B8FF"}
                roughness={0.3}
                clearcoat={0.7}
              />
            </mesh>
          </group>
        ))}
      </group>
    </FloatTilt>
  );
}

function EbookStudio() {
  const book = useRef<THREE.Group>(null);
  const spark = useRef<THREE.Group>(null);
  const t = useRef(0);
  const reduced = useSiteStore((s) => s.reducedMotion);

  useFrame((_, dt) => {
    if (reduced) return;
    t.current += dt;
    if (book.current) book.current.rotation.y = Math.sin(t.current * 0.8) * 0.15;
    if (spark.current) {
      spark.current.position.y = 0.9 + Math.sin(t.current * 2) * 0.12;
      spark.current.rotation.z += dt * 1.2;
    }
  });

  return (
    <FloatTilt pid="ebook-studio">
      <group ref={book} rotation={[0.2, 0, 0]}>
        {/* Left page */}
        <mesh position={[-0.7, 0, 0]} rotation={[0, 0.25, 0]}>
          <boxGeometry args={[1.2, 1.6, 0.08]} />
          <meshPhysicalMaterial color="#FFFFFF" roughness={0.3} clearcoat={0.5} />
        </mesh>
        {/* Right page */}
        <mesh position={[0.7, 0, 0]} rotation={[0, -0.25, 0]}>
          <boxGeometry args={[1.2, 1.6, 0.08]} />
          <meshPhysicalMaterial color="#FFE3CF" roughness={0.3} clearcoat={0.5} />
        </mesh>
        {/* Spine */}
        <mesh position={[0, 0, -0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 1.62, 16]} />
          <meshStandardMaterial color={ORANGE} roughness={0.4} />
        </mesh>
      </group>
      {/* AI Sparkle */}
      <group ref={spark} position={[0.8, 0.9, 0.4]}>
        <mesh>
          <octahedronGeometry args={[0.28, 0]} />
          <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.6} />
        </mesh>
      </group>
    </FloatTilt>
  );
}

function CodeJudge() {
  const screen = useRef<THREE.Group>(null);
  const orb = useRef<THREE.Group>(null);
  const t = useRef(0);
  const reduced = useSiteStore((s) => s.reducedMotion);

  useFrame((_, dt) => {
    if (reduced) return;
    t.current += dt;
    if (screen.current) screen.current.rotation.y = Math.sin(t.current * 0.7) * 0.12;
    if (orb.current) orb.current.position.y = 0.8 + Math.sin(t.current * 1.8) * 0.1;
  });

  return (
    <FloatTilt pid="code-judge">
      {/* Terminal bezel */}
      <group ref={screen}>
        <mesh>
          <roundedBoxGeometry args={[2.0, 1.4, 0.12, 3, 0.06]} />
          <meshPhysicalMaterial color="#16161A" roughness={0.2} clearcoat={0.7} />
        </mesh>
        {/* Code lines mock */}
        {[-0.3, -0.05, 0.2].map((y, i) => (
          <mesh key={i} position={[-0.3 + i * 0.1, y, 0.08]}>
            <boxGeometry args={[0.8 + i * 0.2, 0.06, 0.02]} />
            <meshStandardMaterial color={i === 2 ? "#27C93F" : "#A5CFFF"} />
          </mesh>
        ))}
      </group>
      {/* Status Accepted Orb */}
      <group ref={orb} position={[1.1, 0.8, 0.3]}>
        <mesh>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial color="#27C93F" emissive="#27C93F" emissiveIntensity={0.5} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.32, 0.025, 12, 32]} />
          <meshStandardMaterial color="#A5CFFF" />
        </mesh>
      </group>
    </FloatTilt>
  );
}

function AutoMlPipeline() {
  const stages = useRef<THREE.Group>(null);
  const t = useRef(0);
  const reduced = useSiteStore((s) => s.reducedMotion);

  useFrame((_, dt) => {
    if (reduced) return;
    t.current += dt;
    if (stages.current) {
      stages.current.children.forEach((c, idx) => {
        c.position.y = (idx * 0.25 - 0.35) + Math.sin(t.current * 2 + idx * 0.8) * 0.06;
      });
    }
  });

  return (
    <FloatTilt pid="automl-pipeline">
      <group ref={stages}>
        {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
          <group key={i} position={[x, i * 0.25 - 0.35, 0]}>
            <mesh>
              <cylinderGeometry args={[0.3 - i * 0.03, 0.3 - i * 0.03, 0.5 + i * 0.25, 24]} />
              <meshPhysicalMaterial
                color={i === 3 ? ORANGE : i % 2 === 0 ? "#A5CFFF" : "#C9B8FF"}
                roughness={0.3}
                clearcoat={0.6}
              />
            </mesh>
          </group>
        ))}
      </group>
    </FloatTilt>
  );
}

function CertChain() {
  const chain = useRef<THREE.Group>(null);
  const badge = useRef<THREE.Group>(null);
  const t = useRef(0);
  const reduced = useSiteStore((s) => s.reducedMotion);

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
    if (reduced) return; // static chain under reduced motion (§9)
    t.current += dt;
    if (chain.current) chain.current.position.x = Math.sin(t.current * 0.8) * 0.08;
    if (badge.current) badge.current.rotation.y += dt * 1.5;
  });

  return (
    <FloatTilt pid="certchain">
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
  const reduced = useSiteStore((s) => s.reducedMotion);
  useFrame((_, dt) => {
    if (reduced) return; // static pose under reduced motion (§9)
    t.current += dt;
    if (gavel.current) gavel.current.rotation.z = 0.5 + Math.sin(t.current * 2) * 0.35;
  });
  return (
    <FloatTilt pid="legal-ai">
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
  const reduced = useSiteStore((s) => s.reducedMotion);
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

  // Label textures for the two orbiters (Vercel / Render, §8.4).
  const labelVercel = useMemo(() => makeLabelTexture("Vercel", { bg: "#FFE29A", fg: "#16161a" }), []);
  const labelRender = useMemo(() => makeLabelTexture("Render", { bg: "#FFB8CB", fg: "#16161a" }), []);

  useFrame((_, dt) => {
    if (reduced) return; // static cloud under reduced motion (§9)
    if (orbiter1.current) orbiter1.current.rotation.y += dt * 0.9;
    if (orbiter2.current) orbiter2.current.rotation.y -= dt * 0.7;
  });

  return (
    <FloatTilt pid="cloud-nova">
      {puffs.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 24, 24]} />
          <meshPhysicalMaterial color={i % 3 === 0 ? "#A5CFFF" : "#FFFFFF"} roughness={0.4} clearcoat={0.5} />
        </mesh>
      ))}
      <group ref={orbiter1}>
        <mesh position={[1.7, 0.5, 0]}>
          <boxGeometry args={[0.7, 0.34, 0.12]} />
          <meshStandardMaterial map={labelVercel} roughness={0.4} />
        </mesh>
      </group>
      <group ref={orbiter2}>
        <mesh position={[-1.7, -0.4, 0]}>
          <boxGeometry args={[0.7, 0.34, 0.12]} />
          <meshStandardMaterial map={labelRender} roughness={0.4} />
        </mesh>
      </group>
    </FloatTilt>
  );
}

export default function ProjectMini({ pid }: { pid: MiniPid }) {
  if (pid === "ai-college") return <AiCollege />;
  if (pid === "ebook-studio") return <EbookStudio />;
  if (pid === "code-judge") return <CodeJudge />;
  if (pid === "automl-pipeline") return <AutoMlPipeline />;
  if (pid === "certchain") return <CertChain />;
  if (pid === "legal-ai") return <LegalAi />;
  return <CloudNova />;
}
