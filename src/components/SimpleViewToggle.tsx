"use client";

import { useSiteStore } from "../lib/store";

export default function SimpleViewToggle({ compact = false }: { compact?: boolean }) {
  const simpleView = useSiteStore((s) => s.simpleView);
  const set = useSiteStore((s) => s.set);
  const forced = useSiteStore((s) => s.forcedSimple);

  if (forced) return null;

  const label = simpleView ? "3D view" : "Simple view";

  return (
    <button
      type="button"
      className={compact ? "nav-dot w-auto rounded-full px-2 py-0.5 font-mono text-[0.55rem]" : "btn"}
      style={compact ? { height: "auto" } : undefined}
      aria-pressed={simpleView}
      onClick={() => set("simpleView", !simpleView)}
    >
      {label}
    </button>
  );
}
