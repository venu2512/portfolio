"use client";

import { experience, experiencePeriod } from "../content/data";
import { useSiteStore } from "../lib/store";
import Reveal from "./Reveal";
import ExperienceSlot from "./three/ExperienceSlot";

export default function Experience() {
  const flashBullet = useSiteStore((s) => s.flashBullet);

  return (
    <section id="experience" className="wrap section">
      <Reveal>
        <p className="mono-label">Experience</p>
        <h2 className="h2 mt-2">Where I&apos;ve worked</h2>
      </Reveal>

      {/* Mobile: sticky 30svh strip above the cards (§6). Desktop: layout is
          grid (cards left, sticky stage right), so this copy never shows. */}
      <div className="lg:hidden sticky top-16 z-10 mt-8" style={{ height: "30svh" }}>
        <ExperienceSlot />
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-8">
        {/* Cards */}
        <div className="flex flex-col gap-5">
          {experience.map((job, idx) => (
            <Reveal key={job.id} delay={idx * 60}>
              <article
                data-index={idx}
                data-exp={job.id}
                className="card p-7"
              >
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <h3 className="text-xl font-bold">{job.org}</h3>
                  {experiencePeriod(job) && (
                    <span className="chip chip-primary">{experiencePeriod(job)}</span>
                  )}
                </div>
                <p className="mt-1 font-medium" style={{ color: "var(--muted)" }}>
                  {job.title}
                </p>
                <ul className="mt-4 space-y-2.5 text-[0.95rem] leading-relaxed">
                  {job.bullets.map((b, bi) => (
                    <li
                      key={bi}
                      data-bullet={bi}
                      className="flex gap-2.5 rounded-lg px-2 py-1 -mx-2 transition-colors"
                      style={
                        flashBullet?.expId === job.id && flashBullet.index === bi
                          ? { background: "var(--primary-soft)" }
                          : undefined
                      }
                    >
                      <span aria-hidden="true" style={{ color: "var(--primary)" }}>▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {"tools" in job && job.tools && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {job.tools.map((t) => (
                      <span key={t} className="chip chip-white">{t}</span>
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        {/* Sticky 3D stage (desktop column) — the mobile strip is above. */}
        <div className="hidden lg:sticky lg:top-24 lg:self-start lg:block">
          <ExperienceSlot />
        </div>
      </div>
    </section>
  );
}
