import type { ThreeElements } from "@react-three/fiber";

export type { ThreeElements };

declare module "@react-three/fiber" {
  interface ThreeElements {
    roundedBoxGeometry: Omit<ThreeElements["bufferGeometry"], "args"> & {
      args?: [width: number, height: number, depth: number, segments: number, radius: number];
    };
  }
}
