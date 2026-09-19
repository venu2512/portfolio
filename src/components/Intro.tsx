"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Page-load intro (§6): an orange wipe that lifts after content paints.
 * ≤ 600 ms total, never blocks the page (pointer-events none, fades over
 * already-visible content), skipped for reduced motion and repeat visits
 * in the same session (sessionStorage). State updates are rAF-deferred to
 * satisfy the set-state-in-effect rule; the visual result is identical.
 */
export default function Intro() {
  const [show, setShow] = useState(false);
  const decide = useRef(false);

  useEffect(() => {
    if (decide.current) return;
    decide.current = true;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let played = false;
    try {
      played = sessionStorage.getItem("venu-intro") === "1";
      sessionStorage.setItem("venu-intro", "1");
    } catch {
      /* private mode: playing it is harmless */
    }
    const play = !rm && !played;
    if (!play) return; // stays hidden forever
    const raf = requestAnimationFrame(() => setShow(true));
    const hide = window.setTimeout(() => setShow(false), 600);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hide);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        pointerEvents: "none",
        background: "var(--primary)",
        transformOrigin: "top",
        animation: "intro-lift 480ms cubic-bezier(0.22, 1, 0.36, 1) 120ms forwards",
      }}
      onAnimationEnd={() => setShow(false)}
      // The timeout is a backstop (animation may not fire onAnimationEnd
      // while the tab is backgrounded); whichever comes first wins.
    />
  );
}
