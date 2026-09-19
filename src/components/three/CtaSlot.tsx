"use client";

import { useRef } from "react";
import { useInViewMargin } from "../../lib/hooks";
import useViewRegistration from "../../lib/useViewRegistration";

/**
 * CTA 3D slot. CSS pastel-shapes fallback always rendered beneath; CanvasRoot
 * toggles data-3d when the 3D shapes actually mount.
 */
export default function CtaSlot() {
  const ref = useRef<HTMLDivElement>(null);
  const { visible } = useInViewMargin(ref);
  // Stable registry id — must match CanvasRoot's VIEW_ORDER selector.
  const id = "cta";
  useViewRegistration(id, ref, visible);

  return (
    <div
      ref={ref}
      data-view="cta"
      className="view-slot"
      style={{ aspectRatio: "4 / 3" }}
    >
      <div className="view-fallback">
        <div className="relative h-full w-full" aria-hidden="true">
          <span className="absolute left-[12%] top-[18%] block h-16 w-16 rounded-full" style={{ background: "rgba(255,255,255,0.85)" }} />
          <span className="absolute right-[15%] top-[30%] block h-14 w-14 rounded-[18px] rotate-12" style={{ background: "rgba(227,200,255,0.9)" }} />
          <span className="absolute left-[30%] bottom-[16%] block h-12 w-12 rounded-full border-8" style={{ borderColor: "rgba(255,220,180,0.9)" }} />
        </div>
      </div>
    </div>
  );
}
