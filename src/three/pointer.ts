"use client";

import { useEffect } from "react";

/**
 * Per-slot pointer tracking (§8.1: normalized to the placeholder rect, not
 * the window). DOM slots write on pointermove; 3D views read in useFrame.
 * Keyed by the same stable ids as the view registry ("hero", "cta",
 * "project-<pid>"). `last` lets scenes fall back to idle poses when the
 * pointer has been still for a while.
 */

export interface ViewPointer {
  x: number; // -1..1 across the placeholder width
  y: number; // -1..1 across the placeholder height
  last: number; // performance.now() of the last move
}

const pointers = new Map<string, ViewPointer>();

export function setViewPointer(id: string, x: number, y: number): void {
  let p = pointers.get(id);
  if (!p) {
    p = { x, y, last: performance.now() };
    pointers.set(id, p);
    return;
  }
  p.x = x;
  p.y = y;
  p.last = performance.now();
}

export function getViewPointer(id: string): ViewPointer | undefined {
  return pointers.get(id);
}

/** DOM side: attach a throttled-by-rAF pointermove listener to the slot. */
export function useSlotPointer(
  id: string,
  ref: React.RefObject<HTMLElement | null>
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const flush = () => {
      raf = 0;
      setViewPointer(id, px, py);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      px = ((e.clientX - r.left) / r.width) * 2 - 1;
      py = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
      pointers.delete(id);
    };
  }, [id, ref]);
}
