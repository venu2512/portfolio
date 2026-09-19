"use client";

import { deriveStats } from "../content/data";
import { useCountUp, useReveal } from "../lib/hooks";

function Stat({ value, label }: { value: number | string; label: string }) {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const isNum = typeof value === "number" && value < 100;
  const shown = useCountUp(isNum ? (value as number) : 0, inView);
  return (
    <div ref={ref} className="card p-6 text-center">
      <div className="stat-num" style={{ color: "var(--primary)" }}>
        {isNum ? shown : value}
      </div>
      <div className="mono-label mt-1">{label}</div>
    </div>
  );
}

export default function StatsStrip() {
  const stats = deriveStats();
  return (
    <section aria-label="Stats" className="wrap grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
      {stats.map((s) => (
        <Stat key={s.label} value={s.value} label={s.label} />
      ))}
    </section>
  );
}
