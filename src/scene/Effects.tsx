"use client";

import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useSiteStore } from "../lib/store";

export default function Effects() {
  const tier = useSiteStore((s) => (s.simpleView ? "low" : s.runtimeTier));
  if (!tier || tier !== "high") return null;
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.7} luminanceThreshold={0.22} luminanceSmoothing={0.5} mipmapBlur />
    </EffectComposer>
  );
}
