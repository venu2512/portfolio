"use client";

import { useEffect, useRef, useState } from "react";
import { useSyncExternalStore } from "react";

const RM_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(cb: () => void): () => void {
  const mq = window.matchMedia(RM_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia(RM_QUERY).matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

/** requestIdleCallback with setTimeout fallback. Returns a cancel function. */
export function onIdle(cb: () => void, timeout = 1200): () => void {
  if (typeof window === "undefined") return () => {};
  type WinIdle = Window & {
    requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    cancelIdleCallback?: (handle: number) => void;
  };
  const w = window as WinIdle;
  let handle = 0;
  let cancelled = false;
  const wrapped = () => {
    if (!cancelled) cb();
  };
  if (typeof w.requestIdleCallback === "function") {
    handle = w.requestIdleCallback(wrapped, { timeout });
  } else {
    handle = window.setTimeout(wrapped, 300);
  }
  return () => {
    cancelled = true;
    if (typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(handle);
    else window.clearTimeout(handle);
  };
}

/** IntersectionObserver hook: fires once when the element enters the viewport. */
export function useReveal<T extends HTMLElement>(): {
  ref: React.RefObject<T | null>;
  inView: boolean;
} {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

/**
 * Tracks visibility with a margin (for gating 3D view rendering).
 * Takes a ref to the placeholder element; re-renders on enter/exit.
 */
export function useInViewMargin<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  margin = "200px"
): { visible: boolean } {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) setVisible(e.isIntersecting);
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return { visible };
}

/** Count-up hook: returns the current value once triggered. */
export function useCountUp(target: number, active: boolean, duration = 900): number {
  const [value, setValue] = useState(0);
  const rmRef = useRef(false);

  useEffect(() => {
    rmRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!active) return;
    // Reduced motion: settle the number without animation, via rAF callback
    // (no synchronous setState in the effect body).
    if (rmRef.current) {
      const id = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(id);
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}
