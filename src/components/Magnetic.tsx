"use client";

import { useRef } from "react";

/**
 * Magnetic hover (desktop, fine pointer, no reduced motion): translates the
 * child up to 6px toward the pointer within 60px, springs back on leave.
 */
export default function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const range = 60 + Math.max(r.width, r.height) / 2;
    if (dist < range) {
      const f = 6 / range;
      el.style.transform = `translate(${dx * f}px, ${dy * f}px)`;
    } else {
      el.style.transform = "";
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ display: "inline-flex", transition: "transform 200ms ease" }}
    >
      {children}
    </span>
  );
}
