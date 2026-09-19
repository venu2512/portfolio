"use client";

// One passive scroll listener for the whole app. Consumers read scrollRef.current
// inside useFrame instead of each attaching listeners.

export const scrollState = {
  progress: 0, // 0..1
};

export function computeScrollProgress(): number {
  if (typeof window === "undefined") return 0;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

export function installScrollListener(): () => void {
  if (typeof window === "undefined") return () => {};
  const onScroll = () => {
    scrollState.progress = computeScrollProgress();
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}

export function scrollToSection(id: string, reducedMotion: boolean): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
}
