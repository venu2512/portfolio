"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { damp } from "maath/easing";
import { skills } from "../../content/data";
import { makeLabelTexture } from "../labels";
import { skillsFilterRef } from "../filterMirror";

const CAT_COLORS: Record<string, string> = {
  lang: "#FF6A13",
  ai: "#C9B8FF",
  viz: "#FFB8CB",
  web: "#A5CFFF",
  vcs: "#3A3A42",
  tools: "#FFFFFF",
  chain: "#FFE29A",
};

const KEYS = skills.flatMap((s) =>
  s.items.map((item) => ({
    label: item.includes(" (") ? item.slice(0, item.indexOf(" (")) : item,
    full: item,
    cat: s.id,
    color: CAT_COLORS[s.id] ?? "#ffffff",
  }))
);

function Keycap({
  position,
  quaternion,
  color,
  label,
  full,
  dimmed,
  onHover,
}: {
  position: [number, number, number];
  quaternion: THREE.Quaternion;
  color: string;
  label: string;
  full: string;
  dimmed: boolean;
  onHover: (label: string | null) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const tex = useMemo(() => makeLabelTexture(label, { bg: color, fg: "#16161a" }), [label, color]);
  const baseColor = useMemo(() => new THREE.Color(color), [color]);
  const mat = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    const targetScale = hovered ? 1.15 : dimmed ? 0.85 : 1;
    damp(m.scale, "x", targetScale, 6, dt);
    damp(m.scale, "y", targetScale, 6, dt);
    damp(m.scale, "z", targetScale, 6, dt);
    // pop forward along local z when hovered
    damp(m.position, "x", position[0] * (hovered ? 1.13 : 1), 6, dt);
    damp(m.position, "y", position[1] * (hovered ? 1.13 : 1), 6, dt);
    damp(m.position, "z", position[2] * (hovered ? 1.13 : 1), 6, dt);
    if (mat.current) {
      const target = dimmed ? 0.25 : 1;
      mat.current.color.lerp(baseColor.clone().multiplyScalar(dimmed ? 0.4 : 1), 1 - Math.exp(-6 * dt));
      void target;
    }
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      quaternion={quaternion}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(full);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
      }}
    >
      <boxGeometry args={[0.9, 0.9, 0.28]} />
      <meshStandardMaterial ref={mat} map={tex} color="#ffffff" roughness={0.45} />
    </mesh>
  );
}

export default function KeycapCloud() {
  const group = useRef<THREE.Group>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [filter, setFilter] = useState(skillsFilterRef.current);
  const dragging = useRef(false);
  const vel = useRef({ x: 0, y: 0 });
  const last = useRef({ x: 0, y: 0 });

  // Poll the mirrored filter (cheap) so canvas picks up DOM pill changes.
  useEffect(() => {
    const iv = window.setInterval(() => {
      setFilter((f) => (f !== skillsFilterRef.current ? skillsFilterRef.current : f));
    }, 250);
    return () => window.clearInterval(iv);
  }, []);

  const keys = useMemo(() => {
    // Fibonacci sphere, radius 3.2 — categories form contiguous bands.
    const n = KEYS.length;
    const phi = Math.PI * (3 - Math.sqrt(5));
    const R = 3.2;
    return KEYS.map((k, i) => {
      const y = 1 - (2 * i) / (n - 1);
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;
      const pos = new THREE.Vector3(Math.cos(theta) * r * R, y * R, Math.sin(theta) * r * R);
      const q = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        pos.clone().normalize()
      );
      return { ...k, pos: pos.toArray() as [number, number, number], q };
    });
  }, []);

  const down = (e: React.PointerEvent) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };
  const move = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    vel.current.y = (e.clientX - last.current.x) * 0.006;
    vel.current.x = (e.clientY - last.current.y) * 0.006;
    last.current = { x: e.clientX, y: e.clientY };
  };
  const up = () => {
    dragging.current = false;
  };

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    if (!dragging.current) {
      vel.current.x *= Math.exp(-dt * 2.5);
      vel.current.y *= Math.exp(-dt * 2.5);
      g.rotation.y += 0.1 * dt; // idle rotation
    }
    g.rotation.x += vel.current.x;
    g.rotation.y += vel.current.y;
  });

  return (
    <group>
      <group
        ref={group}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
      >
        {keys.map((k) => (
          <Keycap
            key={k.full}
            position={k.pos}
            quaternion={k.q}
            color={k.color}
            label={k.label}
            full={k.full}
            dimmed={filter !== "all" && filter !== k.cat}
            onHover={setTooltip}
          />
        ))}
      </group>
      {tooltip && (
        <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div className="chip chip-white">{tooltip}</div>
        </Html>
      )}
    </group>
  );
}
