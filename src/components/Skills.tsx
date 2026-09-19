"use client";

import { useMemo, useState } from "react";
import { skills } from "../content/data";
import Reveal from "./Reveal";
import SkillsSlot from "./three/SkillsSlot";

export default function Skills() {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(
    () => (filter === "all" ? skills : skills.filter((s) => s.id === filter)),
    [filter]
  );
  const count = useMemo(() => filtered.reduce((n, s) => n + s.items.length, 0), [filtered]);

  return (
    <section id="skills" className="wrap section">
      <Reveal>
        <p className="mono-label">Skills</p>
        <h2 className="h2 mt-2">Tools of the trade</h2>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter skills by category">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "btn btn-primary !min-h-0 !py-1.5 text-sm" : "btn btn-secondary !min-h-0 !py-1.5 text-sm"}
            aria-pressed={filter === "all"}
          >
            All
          </button>
          {skills.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setFilter(s.id)}
              className={filter === s.id ? "btn btn-primary !min-h-0 !py-1.5 text-sm" : "btn btn-secondary !min-h-0 !py-1.5 text-sm"}
              aria-pressed={filter === s.id}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-8">
        <SkillsSlot filter={filter} />
      </div>

      {/* Accessible source of truth */}
      <div className="mt-10 grid md:grid-cols-2 gap-x-8 gap-y-6" aria-live="polite">
        <p className="sr-only md:col-span-2">{count} skills shown</p>
        {filtered.map((s) => (
          <Reveal key={s.id}>
            <div className="card-soft p-6">
              <p className="mono-label mb-3">{s.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {s.items.map((item) => (
                  <span key={item} className={`chip chip-${s.color}`}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
