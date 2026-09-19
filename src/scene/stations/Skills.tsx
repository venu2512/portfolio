"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { skills } from "../../content/data";
import { useSiteStore } from "../../lib/store";
import { useStationActive } from "./shared";

const RING_R = 4.6;

export default function Skills() {
  const anim = useStationActive(5);
  const hoveredId = useSiteStore((s) => s.hoveredId);
  const set = useSiteStore((s) => s.set);
  const groupRefs = useRef<Array<THREE.Group | null>>([]);

  const clusters = useMemo(() => {
    return skills.map((s, si) => {
      const angle = (si / skills.length) * Math.PI * 2;
      const cx = Math.cos(angle) * RING_R;
      const cz = Math.sin(angle) * RING_R;
      const rng = () => {
        const x = Math.sin(si * 999 + 1) * 10000;
        return x - Math.floor(x);
      };
      const nodes = s.items.map((item, ii) => {
        const a2 = (ii / Math.max(1, s.items.length)) * Math.PI * 2;
        const rr = 0.55 + rng() * 0.5;
        return {
          item,
          pos: [cx + Math.cos(a2) * rr, (rng() - 0.5) * 0.9, cz + Math.sin(a2) * rr] as [number, number, number],
        };
      });
      return { id: s.id, label: s.label, cx, cz, nodes };
    });
  }, []);

  // Whole-station slow rotation when active.
  const spin = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!anim) return;
    if (spin.current) spin.current.rotation.y += dt * 0.05;
  });

  return (
    <group ref={spin} position={[-3, 1.8, -85]}>
      {clusters.map((c, ci) => {
        const clusterId = `cluster-${c.id}`;
        const dimmed = hoveredId !== null && hoveredId !== clusterId;
        const opacity = dimmed ? 0.25 : 1;
        return (
          <group
            key={c.id}
            ref={(el) => {
              groupRefs.current[ci] = el;
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              set("hoveredId", clusterId);
            }}
            onPointerOut={() => set("hoveredId", null)}
          >
            {c.nodes.map((n) => (
              <group key={n.item} position={n.pos}>
                <mesh>
                  <sphereGeometry args={[0.09, 10, 10]} />
                  <meshBasicMaterial color="#22d3ee" transparent opacity={opacity} toneMapped={false} />
                </mesh>
              </group>
            ))}
            {/* links between same-cluster nodes */}
            <lineSegments>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[
                    new Float32Array(
                      c.nodes.flatMap((n, i) => {
                        const nxt = c.nodes[(i + 1) % c.nodes.length];
                        if (!nxt) return [];
                        return [...n.pos, ...nxt.pos];
                      })
                    ),
                    3,
                  ]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#8b5cf6" transparent opacity={0.35 * opacity} toneMapped={false} />
            </lineSegments>
            {/* cluster label */}
            <Html
              center
              distanceFactor={16}
              position={[c.cx, -1.5, c.cz]}
              style={{ pointerEvents: "none", opacity }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.6rem",
                  color: "#9aa7c7",
                  whiteSpace: "nowrap",
                }}
              >
                {c.label}
              </span>
            </Html>
          </group>
        );
      })}
      {/* hub */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#f59e0b" toneMapped={false} />
      </mesh>
    </group>
  );
}
