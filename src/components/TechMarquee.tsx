"use client";

import { useMemo } from "react";
import { skills } from "../content/data";

export default function TechMarquee() {
  const rows = useMemo(() => {
    const all = skills.flatMap((s) => s.items.map((i) => ({ item: i, color: s.color })));
    const half = Math.ceil(all.length / 2);
    return [all.slice(0, half), all.slice(half)];
  }, []);

  return (
    <section aria-label="Technology overview" className="py-10">
      <div className="marquee">
        <div className="marquee-track" style={{ "--marquee-duration": "46s" } as React.CSSProperties}>
          {[...rows[0]!, ...rows[0]!].map((c, i) => (
            <span key={`a-${i}`} className={`chip chip-${c.color}`}>{c.item}</span>
          ))}
        </div>
      </div>
      <div className="marquee mt-3">
        <div className="marquee-track reverse" style={{ "--marquee-duration": "52s" } as React.CSSProperties}>
          {[...rows[1]!, ...rows[1]!].map((c, i) => (
            <span key={`b-${i}`} className={`chip chip-${c.color}`}>{c.item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
