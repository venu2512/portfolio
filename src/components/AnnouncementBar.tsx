"use client";

import { useEffect, useState } from "react";
import { profile } from "../content/data";
import { scrollToSection } from "../lib/scroll";

export default function AnnouncementBar() {
  const [hidden, setHidden] = useState(true);

  // Restore dismiss state after mount (avoids setState-in-effect lint at sync
  // time and keeps the bar visible for the initial paint).
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        setHidden(localStorage.getItem("venu-announce-dismissed") === "1");
      } catch {
        /* private mode */
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  if (hidden) return null;

  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem("venu-announce-dismissed", "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="announce">
      <div className="wrap flex items-center justify-between gap-3 py-2">
        <button
          type="button"
          className="underline underline-offset-2 text-left"
          onClick={() =>
            scrollToSection("contact", window.matchMedia("(prefers-reduced-motion: reduce)").matches)
          }
        >
          {profile.openTo} →
        </button>
        <button type="button" aria-label="Dismiss announcement" onClick={dismiss}>
          ✕
        </button>
      </div>
    </div>
  );
}
