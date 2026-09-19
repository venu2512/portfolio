"use client";

import { useEffect } from "react";
import { useSiteStore } from "../lib/store";
import { detectTier } from "../lib/quality";
import { webglSupported } from "../lib/webgl";
import { installScrollListener, scrollState } from "../lib/scroll";
import { waypoints } from "../scene/waypoints";

export default function StoreBootstrap() {
  useEffect(() => {
    const st = useSiteStore.getState();
    const root = document.documentElement;

    // --- Reduced motion ---
    const rmMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    st.set("reducedMotion", rmMq.matches);

    // --- Tier detection (once) ---
    const detected = detectTier();
    st.set("detectedTier", detected);
    st.set("runtimeTier", detected);

    // --- WebGL ---
    const hasWebgl = webglSupported();
    if (!hasWebgl) st.set("webgl", "unsupported");

    // --- Restore persisted prefs ---
    let simpleView = false;
    try {
      simpleView = localStorage.getItem("venu-simple-view") === "1";
      const savedTier = localStorage.getItem("venu-tier");
      if (savedTier === "high" || savedTier === "medium" || savedTier === "low") {
        st.set("tierOverride", savedTier);
      }
    } catch {
      /* private mode */
    }

    // --- Save-Data heuristic ---
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const saveData = Boolean(conn?.saveData);

    const forcedSimple = !hasWebgl || (saveData && rmMq.matches);
    st.set("forcedSimple", forcedSimple);
    if (forcedSimple || simpleView) {
      st.set("simpleView", true);
    }

    // --- Scroll listener + initial progress ---
    const uninstall = installScrollListener();

    // --- Initial active section & hash restore (before first canvas frame) ---
    const hash = window.location.hash.replace("#", "");
    const initialIdx = Math.max(
      0,
      waypoints.findIndex((w) => w.id === hash)
    );
    if (hash) {
      const wp = waypoints[initialIdx];
      if (wp) {
        const el = document.getElementById(wp.id);
        if (el) el.scrollIntoView({ behavior: "auto" });
      }
    }
    // Sync active with restored scroll position.
    const synced = Math.round(scrollState.progress * (waypoints.length - 1));
    st.set("active", synced);

    // --- Apply <html> attributes ---
    const applyMode = () => {
      const s = useSiteStore.getState();
      const simple = s.simpleView || s.webgl === "lost";
      root.setAttribute("data-mode", simple ? "simple" : "3d");
      root.classList.add("enhanced");
      try {
        localStorage.setItem("venu-simple-view", s.simpleView ? "1" : "0");
      } catch {
        /* ignore */
      }
    };
    applyMode();
    const unsub = useSiteStore.subscribe(applyMode);

    // --- Deep links: hash follows the active waypoint (replaceState, throttled
    // to active change). Back/forward still works: the browser restores the
    // scroll position for hash-only history entries natively.
    const unsubHash = useSiteStore.subscribe((s, prev) => {
      if (s.active === prev.active) return;
      const wp = waypoints[s.active];
      if (wp && window.location.hash !== `#${wp.id}`) {
        history.replaceState(null, "", `#${wp.id}`);
      }
    });

    return () => {
      unsub();
      unsubHash();
      uninstall();
    };
  }, []);

  return null;
}
