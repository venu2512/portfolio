"use client";

// Lenis smooth scroll — desktop/fine pointer only. Touch keeps native scroll.
// One instance is created by <ScrollBoot/> (mounted in page.tsx); consumers
// use scrollToSection() which routes through Lenis when available.

type LenisLike = {
  scrollTo: (target: HTMLElement | number, opts?: Record<string, unknown>) => void;
  destroy: () => void;
};

let lenis: LenisLike | null = null;

export function isLenisActive(): boolean {
  return lenis !== null;
}

export async function enableLenis(): Promise<void> {
  if (lenis) return;
  if (typeof window === "undefined") return;
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    const mod = await import("lenis");
    const instance = new mod.default({ lerp: 0.1, syncTouch: false });
    lenis = instance as unknown as LenisLike;
    function raf(time: number) {
      instance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  } catch {
    lenis = null;
  }
}

export function destroyLenis(): void {
  lenis?.destroy();
  lenis = null;
}

export function scrollToSection(id: string, reducedMotion: boolean): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  if (reducedMotion) {
    el.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }
  if (lenis) {
    lenis.scrollTo(el, { offset: -80 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
