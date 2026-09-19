"use client";

import { useEffect, useState } from "react";
import { useSiteStore } from "../lib/store";
import { detectTier } from "../lib/quality";
import { webglSupported } from "../lib/webgl";
import { enableLenis, destroyLenis } from "../lib/scroll";
import CanvasLoader from "./CanvasLoader";

/**
 * Client bootstrap: syncs environment state into the store once, applies the
 * persisted 3D on/off preference, mounts Lenis (fine pointer only), and
 * lazily loads the shared canvas after idle.
 */
export default function Boot() {
  const simpleView = useSiteStore((s) => s.simpleView);
  const webgl = useSiteStore((s) => s.webgl);
  const forcedSimple = useSiteStore((s) => s.forcedSimple);
  const set = useSiteStore((s) => s.set);
  // Two-phase mount: nothing dynamic is part of the first committed tree, so
  // the bundler can't map the ssr:false chunk into the initial HTML graph.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const st = useSiteStore.getState();
    const root = document.documentElement;

    // --- Reduced motion (live) ---
    const rmMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onRm = () => st.set("reducedMotion", rmMq.matches);
    onRm();
    rmMq.addEventListener("change", onRm);

    // --- Theme sync (script already set data-theme before paint) ---
    const t = root.getAttribute("data-theme");
    if (t === "dark" || t === "light") st.set("theme", t);

    // --- Tier + WebGL ---
    const tier = detectTier();
    st.set("detectedTier", tier);
    const hasWebgl = webglSupported();
    if (!hasWebgl) st.set("webgl", "unsupported");

    // --- Persisted prefs ---
    let saved3d: string | null = null;
    try {
      saved3d = localStorage.getItem("venu-3d");
    } catch {
      /* private mode */
    }

    // --- Save-Data heuristic: default to simple mode ---
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const saveData = Boolean(conn?.saveData);
    const forced = !hasWebgl || saveData;
    st.set("forcedSimple", forced);

    const simple = forced || saved3d === "0";
    st.set("simpleView", simple);

    const applyMode = () => {
      const s = useSiteStore.getState();
      const isSimple = s.simpleView || s.webgl === "lost";
      root.setAttribute("data-mode", isSimple ? "simple" : "3d");
    };
    applyMode();
    const unsub = useSiteStore.subscribe(applyMode);

    void enableLenis().then(() => {
      // §10: low tier drops Lenis (every frame matters there).
      if (tier === "low") destroyLenis();
    });

    const id = window.setTimeout(() => setHydrated(true), 0);

    return () => {
      rmMq.removeEventListener("change", onRm);
      unsub();
      destroyLenis();
      window.clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    if (forcedSimple) return;
    try {
      localStorage.setItem("venu-3d", simpleView ? "0" : "1");
    } catch {
      /* ignore */
    }
  }, [simpleView, forcedSimple]);

  const showCanvas = hydrated && !simpleView && webgl === "ok" && !forcedSimple;

  return (
    <>
      {showCanvas && <CanvasLoader />}
      {webgl === "lost" && (
        <div className="fixed bottom-3 left-3 z-[75] rounded-xl px-3 py-2 text-xs card" role="status">
          3D was interrupted — showing the simple view.{" "}
          <button type="button" className="underline" onClick={() => set("webgl", "ok")}>
            Dismiss
          </button>
        </div>
      )}
    </>
  );
}
