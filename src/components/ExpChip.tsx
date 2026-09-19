"use client";

import { useSiteStore } from "../lib/store";

export default function ExpChip({
  kind,
  id,
  label,
}: {
  kind: "experience" | "project";
  id: string;
  label: string;
}) {
  const set = useSiteStore((s) => s.set);
  return (
    <button type="button" className="chip chip-cyan" onClick={() => set("selectedId", `${kind === "experience" ? "exp" : "proj"}:${id}`)}>
      {label}
    </button>
  );
}
