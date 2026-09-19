"use client";

import { ReactNode, useMemo } from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import { useSiteStore } from "../../lib/store";
import { useCursor } from "../../lib/hooks";

/** Station animates only within ±1 of the active index. */
export function useStationActive(index: number): boolean {
  const active = useSiteStore((s) => s.active);
  return Math.abs(active - index) <= 1;
}

export function useIsTouch(): boolean {
  return useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
    []
  );
}

interface InteractiveProps {
  id: string; // namespaced drawer id, e.g. "exp:kreupai"
  children: ReactNode;
  position: [number, number, number];
  /** Radius of the invisible hit sphere; sized so taps land >= ~44px. */
  hitRadius?: number;
}

/**
 * Wraps interactive 3D content with an invisible generous hit-mesh, hover
 * highlight, cursor handling, and click-to-open-drawer.
 */
export function Interactive({ id, children, position, hitRadius = 1.1 }: InteractiveProps) {
  const hoveredId = useSiteStore((s) => s.hoveredId);
  const set = useSiteStore((s) => s.set);
  const isHovered = hoveredId === id;
  useCursor(isHovered ? "pointer" : "default");

  return (
    <group position={position}>
      <group
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          set("hoveredId", id);
        }}
        onPointerOut={() => {
          set("hoveredId", null);
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          set("selectedId", id);
        }}
      >
        {children}
      </group>
      {/* generous invisible hit sphere for touch */}
      <mesh
        visible={false}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          set("hoveredId", id);
        }}
        onPointerOut={() => set("hoveredId", null)}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          set("selectedId", id);
        }}
      >
        <sphereGeometry args={[hitRadius, 8, 8]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

/** Shared emissive material factory (memoized per color). */
export function useEmissive(color: string, intensity = 1.2): THREE.MeshStandardMaterial {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(color),
        emissiveIntensity: intensity,
        toneMapped: false,
      }),
    [color, intensity]
  );
}
