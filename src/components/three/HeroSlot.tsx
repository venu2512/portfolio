"use client";

import { useRef } from "react";
import { useInViewMargin } from "../../lib/hooks";
import Photo from "../Photo";
import useViewRegistration from "../../lib/useViewRegistration";
import { useSlotPointer } from "../../three/pointer";

/**
 * Hero 3D slot. The DOM fallback (framed photo + CSS floating chips) is
 * always rendered underneath; CanvasRoot sets data-3d="on" when the 3D view
 * actually mounts (CSS fades the fallback out). On low tier the fallback
 * stays visible when no view slot is available.
 */
export default function HeroSlot() {
  const ref = useRef<HTMLDivElement>(null);
  const { visible } = useInViewMargin(ref);
  // Stable registry id — must match CanvasRoot's VIEW_ORDER selector.
  const id = "hero";
  useViewRegistration(id, ref, visible);
  // Pointer relative to THIS rect (§8.1), read by the medallion in useFrame.
  useSlotPointer(id, ref);

  return (
    <div
      ref={ref}
      data-view="hero"
      className="view-slot mx-auto"
      style={{ aspectRatio: "1 / 1", maxWidth: 520 }}
    >
      <div className="view-fallback">
          <div className="relative w-full max-w-[420px]">
            <div className="absolute inset-0 -z-10 rounded-[36px]" style={{ background: "radial-gradient(closest-side, rgba(255,106,19,0.25), transparent)" }} />
            <Photo priority rounded="rounded-[32px]" className="w-full" monogramSize="text-7xl" />
            <div className="absolute -left-4 top-6 chip chip-lavender" style={{ animation: "cue-bob 3s ease-in-out infinite" }}>
              Multi-Agent Systems
            </div>
            <div className="absolute -right-3 top-1/3 chip chip-sky" style={{ animation: "cue-bob 3.6s ease-in-out infinite reverse" }}>
              QLoRA
            </div>
            <div className="absolute bottom-6 -left-2 chip chip-blush" style={{ animation: "cue-bob 4.2s ease-in-out infinite" }}>
              React.js
            </div>
            <div className="absolute bottom-2 right-4 chip chip-cream">
              Power BI
            </div>
          </div>
        </div>
      {/* When live, View renders into this div from the shared canvas. */}
    </div>
  );
}
