"use client";

import { useEffect } from "react";
import { useSiteStore } from "../lib/store";
import { scrollToSection } from "../lib/scroll";
import { waypoints } from "../scene/waypoints";

export default function KeyboardNav() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const st = useSiteStore.getState();
      // Don't hijack keys while the drawer is open or focus is in an input.
      if (st.selectedId) return;
      const el = document.activeElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;

      let target: number | null = null;
      if (e.key === "ArrowDown" || e.key === "PageDown") target = Math.min(waypoints.length - 1, st.active + 1);
      else if (e.key === "ArrowUp" || e.key === "PageUp") target = Math.max(0, st.active - 1);
      else if (e.key === "Home") target = 0;
      else if (e.key === "End") target = waypoints.length - 1;
      else if (e.key === " " || e.key === "Spacebar") {
        // Space should page down like browsers do; jump one section.
        target = Math.min(waypoints.length - 1, st.active + 1);
      }

      if (target !== null) {
        const wp = waypoints[target];
        if (wp) {
          // Allow native behavior for Space when focus is on a button/link.
          if ((e.key === " " || e.key === "Spacebar") && el && (el.tagName === "BUTTON" || el.tagName === "A")) return;
          e.preventDefault();
          scrollToSection(wp.id, st.reducedMotion);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
