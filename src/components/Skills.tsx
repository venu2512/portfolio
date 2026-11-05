"use client";

import { useMemo, useState } from "react";
import { skills } from "../content/data";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import SkillsSlot from "./three/SkillsSlot";

export default function Skills() {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(
    () => (filter === "all" ? skills : skills.filter((s) => s.id === filter)),
    [filter]
  );
  const count = useMemo(() => filtered.reduce((n, s) => n + s.items.length, 0), [filtered]);

  return (
    <section id="skills" className="band band-warm" aria-labelledby="skills-heading">
      <div className="wrap">
        <SectionHead
          id="skills"
          eyebrow="Skills"
          title={
            <>
              Tools of the <em className="accent">trade</em>
            </>
          }
          lead="Every group below is a section of the résumé — filter to narrow the keycap cloud."
        />

        <Reveal delay={80}>
          <div
            className="mt-6 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter skills by category"
          >
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={
                filter === "all"
                  ? "btn btn-primary !min-h-0 !py-1.5 text-sm"
                  : "btn btn-secondary !min-h-0 !py-1.5 text-sm"
              }
              aria-pressed={filter === "all"}
            >
              All
            </button>
            {skills.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setFilter(s.id)}
                className={
                  filter === s.id
                    ? "btn btn-primary !min-h-0 !py-1.5 text-sm"
                    : "btn btn-secondary !min-h-0 !py-1.5 text-sm"
                }
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
        <div className="mt-10 grid md:grid-cols-2 gap-4 md:gap-5" aria-live="polite">
          <p className="sr-only md:col-span-2">{count} skills shown</p>
          {filtered.map((s) => (
            <Reveal key={s.id} className="h-full">
              <div className="tile tile-soft h-full">
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
      </div>
    </section>
  );
}
