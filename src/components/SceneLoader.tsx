"use client";

import { Component, ReactNode, Suspense, lazy, useEffect, useRef, useState } from "react";
import { useSiteStore } from "../lib/store";
import { onIdle } from "../lib/hooks";

const Scene = lazy(() => import("../scene/Scene"));

/** Any scene error -> simple mode. */
class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    useSiteStore.getState().set("webgl", "lost");
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function SceneLoader() {
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const simpleView = useSiteStore((s) => s.simpleView);
  const webgl = useSiteStore((s) => s.webgl);
  const set = useSiteStore((s) => s.set);

  // Never import the 3D chunk when WebGL is missing or simple view is on.
  useEffect(() => {
    if (simpleView || webgl === "unsupported") return;
    return onIdle(() => setAllowed(true), 1500);
  }, [simpleView, webgl]);

  // Canvas fade-in once the first frame has rendered.
  useEffect(() => {
    if (!ready) return;
    const el = containerRef.current;
    if (!el) return;
    const id = window.requestAnimationFrame(() => el.classList.add("canvas-ready"));
    return () => window.cancelAnimationFrame(id);
  }, [ready]);

  // Pause render loop while the tab is hidden.
  useEffect(() => {
    const onVis = () => {
      const canvas = containerRef.current?.querySelector("canvas");
      if (canvas) {
        canvas.style.display = document.hidden ? "none" : "";
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // webglcontextlost handling is inside Scene (needs the R3F canvas element).

  if (!allowed || simpleView || webgl === "unsupported") return null;

  return (
    <div ref={containerRef} className="canvas-layer" aria-hidden="true" data-ready={ready ? "true" : "false"}>
      <SceneErrorBoundary>
        <Suspense fallback={null}>
          <SceneReady setReady={setReady} />
        </Suspense>
      </SceneErrorBoundary>
      {webgl === "lost" && (
        <div
          className="fixed bottom-3 left-3 z-30 rounded-md border px-3 py-2 text-xs"
          style={{ background: "rgba(7,9,20,0.95)", borderColor: "rgba(245,158,11,0.5)", color: "#fcd34d" }}
          role="status"
        >
          3D was interrupted — showing simple view.{" "}
          <button type="button" className="underline" onClick={() => set("webgl", "ok")}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

/** Mounts Scene and flags first render for the fade-in. */
function SceneReady({ setReady }: { setReady: (v: boolean) => void }) {
  return <Scene onReady={() => setReady(true)} />;
}
