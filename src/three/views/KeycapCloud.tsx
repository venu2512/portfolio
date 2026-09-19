"use client";

/**
 * Keycap Cloud (§8.3): one rounded keycap per skill on a Fibonacci sphere
 * (bands ordered by category). Drag with inertia + idle spin; hover pops the
 * keycap and shows a DOM tooltip with the full skill name. Category filter
 * pills subscribe via onSkillsFilterChange (no polling); non-matching keys
 * desaturate and shrink; the DOM list below mirrors the same filter.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { damp } from "maath/easing";
import { skills } from "../../content/data";
import { useSiteStore } from "../../lib/store";
import { makeLabelTexture } from "../labels";
import { skillsFilterRef, onSkillsFilterChange } from "../filterMirror";

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
    colorKey: s.color,
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
  // Base + dimmed targets precomputed once (no per-frame allocations, §10).
  const baseColor = useMemo(() => new THREE.Color(color), [color]);
  const dimColor = useMemo(() => new THREE.Color(color).multiplyScalar(0.4), [color]);
  const mat = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    const targetScale = hovered ? 1.15 : dimmed ? 0.85 : 1;
    damp(m.scale, "x", targetScale, 6, dt);
    damp(m.scale, "y", targetScale, 6, dt);
    damp(m.scale, "z", targetScale, 6, dt);
    // Pop forward along the radial direction when hovered.
    const k = hovered ? 1.13 : 1;
    damp(m.position, "x", position[0] * k, 6, dt);
    damp(m.position, "y", position[1] * k, 6, dt);
    damp(m.position, "z", position[2] * k, 6, dt);
    // Desaturate (darken toward the tint) when filtered out.
    if (mat.current) {
      const target = dimmed ? dimColor : baseColor;
      mat.current.color.lerp(target, 1 - Math.exp(-6 * dt));
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
  const reduced = useSiteStore((s) => s.reducedMotion);
  const dragging = useRef(false);
  const vel = useRef({ x: 0, y: 0 });
  const last = useRef({ x: 0, y: 0 });

  // Subscribe to DOM filter-pill changes (no polling).
  useEffect(() => {
    return onSkillsFilterChange((next) => {
      setFilter((f) => (f !== next ? next : f));
    });
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
      if (!reduced) g.rotation.y += 0.1 * dt; // idle rotation (off under reduced motion, §9)
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
