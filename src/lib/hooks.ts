"use client";

import { useEffect } from "react";
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

/** Sets document.body.style.cursor and always restores it on unmount/change. */
export function useCursor(cursor: "pointer" | "default"): void {
  useEffect(() => {
    if (cursor !== "pointer") return;
    const prev = document.body.style.cursor;
    document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = prev;
    };
  }, [cursor]);
}

/** requestIdleCallback with setTimeout fallback. Returns a cancel function. */
export function onIdle(cb: () => void, timeout = 1200): () => void {
  if (typeof window === "undefined") return () => {};
  type WinIdle = Window & {
    requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    cancelIdleCallback?: (handle: number) => void;
  };
  const w = window as WinIdle;
  let handle: number;
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
