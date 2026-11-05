"use client";

import { useEffect, useState } from "react";
import { profile } from "../content/data";
import { scrollToSection } from "../lib/scroll";

/**
 * Availability strip. Restyled from a black band to a surface strip with a
 * mono label (teardown §2 row 0 puts the claim and its label first), while
 * keeping the top-of-page position: a floating bottom pill would collide with
 * the toast (bottom-centre) and the back-to-top button (bottom-right).
 */
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
      <div className="wrap flex items-center gap-3 py-2">
        <span className="mono-label shrink-0">Open to work</span>
        <button
          type="button"
          className="announce-link text-left flex-1"
          onClick={() =>
            scrollToSection("contact", window.matchMedia("(prefers-reduced-motion: reduce)").matches)
          }
        >
          {profile.openToShort} →
        </button>
        <button type="button" className="announce-close" aria-label="Dismiss announcement" onClick={dismiss}>
          ✕
        </button>
      </div>
    </div>
  );
}
