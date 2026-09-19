"use client";

import { useSiteStore } from "../lib/store";

export default function ThreeDToggle() {
  const simpleView = useSiteStore((s) => s.simpleView);
  const forcedSimple = useSiteStore((s) => s.forcedSimple);
  const webgl = useSiteStore((s) => s.webgl);
  const set = useSiteStore((s) => s.set);

  if (webgl === "unsupported") {
    return <span className="text-xs" style={{ color: "var(--muted)" }}>3D not supported on this device</span>;
  }
  if (forcedSimple) {
    return (
      <button
        type="button"
        className="underline text-xs"
        onClick={() => set("forcedSimple", false)}
      >
        Enable 3D anyway
      </button>
    );
  }

  return (
    <button
      type="button"
      className="underline text-xs"
      onClick={() => set("simpleView", !simpleView)}
    >
      3D {simpleView ? "off" : "on"}
    </button>
  );
}
