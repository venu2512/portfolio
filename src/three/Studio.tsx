"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Shared studio lighting — procedural, zero network fetches.
 * Warm key, lavender ring, cool fill; soft "clay + gloss" look.
 */
export default function Studio() {
  return (
    <>
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 5, -8]} scale={[12, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-6, 1, 2]} scale={[4, 6, 1]} color="#ffd9bd" />
        <Lightformer form="ring" intensity={1.4} position={[6, 2, 3]} scale={4} color="#e4dbff" />
      </Environment>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} />
    </>
  );
}
