"use client";

import { useSiteStore } from "../lib/store";

export default function ThemeToggle() {
  const theme = useSiteStore((s) => s.theme);
  const set = useSiteStore((s) => s.set);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = theme === "light" ? "dark" : "light";
    const doc = document.documentElement;
    const apply = () => {
      doc.setAttribute("data-theme", next);
      set("theme", next);
      try {
        localStorage.setItem("venu-theme", next);
      } catch {
        /* private mode */
      }
    };
    // View Transitions circular reveal from the button, when supported.
    const anyDoc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (typeof anyDoc.startViewTransition === "function") {
      const x = e.clientX;
      const y = e.clientY;
      anyDoc.startViewTransition(() => {
        apply();
        // Animate the new state in from the toggle position.
        doc.animate(
          [
            { clipPath: `circle(0px at ${x}px ${y}px)` },
            { clipPath: `circle(${Math.hypot(window.innerWidth, window.innerHeight)}px at ${x}px ${y}px)` },
          ],
          { duration: 400, easing: "ease-out", pseudoElement: "::view-transition-new(root)" }
        );
      });
    } else {
      apply();
    }
  };

  return (
    <button
      type="button"
      className="btn-ghost btn !min-h-0 !px-3"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      onClick={toggle}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
