"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

let sharedTex: THREE.CanvasTexture | null = null;

function getTex(): THREE.CanvasTexture {
  if (sharedTex) return sharedTex;
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
  g.addColorStop(0, "rgba(22,22,26,0.35)");
  g.addColorStop(1, "rgba(22,22,26,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  sharedTex = new THREE.CanvasTexture(c);
  return sharedTex;
}

/**
 * Soft fake shadow for medium/low tiers (never real shadow maps).
 * Scales and fades opposite to the target's bob height.
 */
export default function BlobShadow({
  targetRef,
  y = -1.6,
  scale = 2.2,
}: {
  targetRef: React.RefObject<THREE.Object3D | null>;
  y?: number;
  scale?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => getTex(), []);

  useFrame(() => {
    const m = mesh.current;
    const t = targetRef.current;
    if (!m || !t) return;
    const h = t.position.y; // assumes target bobs around 0
    const k = THREE.MathUtils.clamp(1 - h * 0.25, 0.55, 1);
    m.scale.setScalar(scale * k);
    (m.material as THREE.MeshBasicMaterial).opacity = k * 0.8;
  });

  return (
    <mesh ref={mesh} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}
