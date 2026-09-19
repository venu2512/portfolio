"use client";

import { Component, ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSiteStore } from "../lib/store";
import { onIdle } from "../lib/hooks";

// ssr:false keeps three/R3F/drei out of the eager bundle — the chunk is
// fetched only after first paint + idle, on capable clients.
const CanvasRoot = dynamic(() => import("../three/CanvasRoot"), { ssr: false });

class CanvasErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
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

/**
 * Loads the shared canvas after first paint (requestIdleCallback), never when
 * WebGL is unsupported or the user chose simple mode.
 */
export default function CanvasLoader() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    return onIdle(() => setAllowed(true), 1500);
  }, []);

  if (!allowed) return null;

  return (
    <div aria-hidden="true">
      <CanvasErrorBoundary>
        <CanvasRoot />
      </CanvasErrorBoundary>
    </div>
  );
}
