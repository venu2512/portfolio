"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStationActive } from "./shared";

const LAYERS = [4, 6, 6, 3];
const GAP_X = 1.15;
const GAP_Y = 0.62;

export default function Nitroware() {
  const anim = useStationActive(4);
  const pulseT = useRef(0);
  const groupRefs = useRef<Array<Array<THREE.Mesh | null>>>([]);

  const { nodePositions, connections } = useMemo(() => {
    const nodes: { x: number; y: number; layer: number; idx: number }[] = [];
    const conns: [number, number][] = [];
    LAYERS.forEach((count, layer) => {
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: (layer - (LAYERS.length - 1) / 2) * GAP_X * 2,
          y: (i - (count - 1) / 2) * GAP_Y,
          layer,
          idx: i,
        });
      }
    });
    // Connect each node to all nodes in the next layer (small graph, one-time).
    let offset = 0;
    LAYERS.forEach((count, layer) => {
      if (layer < LAYERS.length - 1) {
        const nextCount = LAYERS[layer + 1] ?? 0;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < nextCount; j++) {
            conns.push([offset + i, offset + count + j]);
          }
        }
      }
      offset += count;
    });
    return { nodePositions: nodes, connections: conns };
  }, []);

  const lineGeo = useMemo(() => {
    const positions = new Float32Array(connections.length * 6);
    connections.forEach(([a, b], i) => {
      const na = nodePositions[a];
      const nb = nodePositions[b];
      if (!na || !nb) return;
      positions.set([na.x, na.y, 0, nb.x, nb.y, 0], i * 6);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [connections, nodePositions]);

  useFrame((state, dt) => {
    if (!anim) return;
    pulseT.current = (pulseT.current + dt * 0.5) % 1;
    const p = pulseT.current;
    // Each layer glows in sequence (clean forward pulse).
    groupRefs.current.forEach((layer, li) => {
      layer.forEach((node) => {
        if (!node) return;
        const mat = node.material as THREE.MeshStandardMaterial;
        const local = Math.max(0, 1 - Math.abs(p * LAYERS.length - li));
        mat.emissiveIntensity = 0.25 + local * 1.4;
      });
    });
  });

  return (
    <group position={[-3, 2, -66]} rotation={[0, 0.35, 0]}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#3b4a7a" transparent opacity={0.5} toneMapped={false} />
      </lineSegments>
      {LAYERS.map((count, layer) => (
        <group key={layer} position={[(layer - (LAYERS.length - 1) / 2) * GAP_X * 2, 0, 0]}>
          {Array.from({ length: count }).map((_, i) => {
            const y = (i - (count - 1) / 2) * GAP_Y;
            return (
              <mesh
                key={i}
                position={[0, y, 0]}
                ref={(el) => {
                  if (!groupRefs.current[layer]) groupRefs.current[layer] = [];
                  groupRefs.current[layer][i] = el;
                }}
              >
                <sphereGeometry args={[0.14, 12, 12]} />
                <meshStandardMaterial
                  color="#0d1230"
                  emissive="#22d3ee"
                  emissiveIntensity={0.3}
                  toneMapped={false}
                />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}
