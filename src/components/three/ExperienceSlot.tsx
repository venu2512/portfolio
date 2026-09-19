"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useInViewMargin } from "../../lib/hooks";
import { useSiteStore } from "../../lib/store";
import useViewRegistration from "../../lib/useViewRegistration";
import { setActiveExperience } from "../../lib/activeExp";

/**
 * Experience stage slot. Active index derives from whichever card sits in the
 * middle band of the viewport; the 3D stage swaps its object in sync.
 */
export default function ExperienceSlot() {
  const ref = useRef<HTMLDivElement>(null);
  const { visible } = useInViewMargin(ref);
  const id = useId();
  const webgl = useSiteStore((s) => s.webgl);
  const simpleView = useSiteStore((s) => s.simpleView);
  const [active, setActive] = useState(0);
  useViewRegistration(id, ref, visible);

  // Push the active index to the 3D stage (no-op in simple mode).
  useEffect(() => {
    setActiveExperience(active);
  }, [active]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.index ?? 0);
            setActive(idx);
          }
        }),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    document.querySelectorAll("[data-exp]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const canvasLive = webgl === "ok" && !simpleView;

  const Fallbacks = [
    <svg key="k" viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true">
      <rect x="70" y="50" width="60" height="110" rx="14" fill="var(--primary-soft)" />
      <circle cx="100" cy="42" r="8" fill="var(--primary)" />
      <circle cx="45" cy="80" r="10" fill="var(--lavender)" />
      <circle cx="160" cy="100" r="10" fill="var(--sky)" />
      <circle cx="50" cy="140" r="10" fill="var(--blush)" />
      <circle cx="155" cy="150" r="10" fill="var(--cream)" />
    </svg>,
    <svg key="q" viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true">
      <rect x="40" y="60" width="120" height="90" rx="14" fill="var(--sky)" />
      <rect x="55" y="115" width="12" height="25" rx="4" fill="var(--primary)" />
      <rect x="75" y="100" width="12" height="40" rx="4" fill="var(--primary)" />
      <rect x="95" y="85" width="12" height="55" rx="4" fill="var(--primary)" />
      <rect x="115" y="95" width="12" height="45" rx="4" fill="var(--primary)" />
      <rect x="135" y="75" width="12" height="65" rx="4" fill="var(--primary)" />
    </svg>,
    <svg key="n" viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true">
      {[
        [70, 40], [100, 40], [130, 40], [160, 40],
      ].map(([x, y], i) => <circle key={`a${i}`} cx={x} cy={y} r="9" fill="var(--lavender)" />)}
      {[
        [55, 90], [85, 90], [115, 90], [145, 90], [175, 90], [40, 90],
      ].map(([x, y], i) => <circle key={`b${i}`} cx={x} cy={y} r="9" fill="var(--primary-soft)" />)}
      {[
        [70, 140], [100, 140], [130, 140], [160, 140],
      ].map(([x, y], i) => <circle key={`c${i}`} cx={x} cy={y} r="9" fill="var(--blush)" />)}
      {[
        [85, 180], [115, 180], [100, 180],
      ].map(([x, y], i) => <circle key={`d${i}`} cx={x} cy={y} r="9" fill="var(--sky)" />)}
    </svg>,
  ];

  return (
    <div
      ref={ref}
      data-view="experience"
      className="view-slot card overflow-hidden"
      style={{ aspectRatio: "4 / 3" }}
      data-3d={canvasLive ? "on" : "off"}
    >
      {!canvasLive && <div className="view-fallback">{Fallbacks[active]}</div>}
    </div>
  );
}
