"use client";

import { experience, experiencePeriod } from "../content/data";
import { useSiteStore } from "../lib/store";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import ExperienceSlot from "./three/ExperienceSlot";

// One wash per entry, in résumé order (presentation only).
const WASH = ["tile tile-lavender", "tile tile-sky", "tile tile-cream"];

export default function Experience() {
  const flashBullet = useSiteStore((s) => s.flashBullet);

  return (
    <section id="experience" className="band" aria-labelledby="experience-heading">
      <div className="wrap">
        <SectionHead
          id="experience"
          eyebrow="Experience"
          title={
            <>
              Where I&apos;ve <em className="accent">worked</em>
            </>
          }
          lead="Three internships, most recent first — every bullet is from the résumé."
        />

        {/* Mobile: sticky 30svh strip above the cards (§6). Desktop: layout is
            grid (cards left, sticky stage right), so this copy never shows. */}
        <div className="lg:hidden sticky top-16 z-10 mt-8" style={{ height: "30svh" }}>
          <ExperienceSlot />
        </div>

        <div className="mt-8 grid lg:grid-cols-2 gap-8">
          {/* Cards */}
          <div className="flex flex-col gap-5">
            {experience.map((job, idx) => (
              <Reveal key={job.id} delay={idx * 60} className="h-full">
                <article
                  data-index={idx}
                  data-exp={job.id}
                  className={WASH[idx % WASH.length]}
                >
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="text-xl font-bold">{job.org}</h3>
                      {"location" in job && job.location ? (
                        <p className="text-xs tile-sub mt-0.5">{job.location}</p>
                      ) : null}
                    </div>
                    {experiencePeriod(job) && (
                      <span className="chip chip-white">{experiencePeriod(job)}</span>
                    )}
                  </div>
                  <p className="mt-1 font-medium tile-sub">{job.title}</p>
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
                        <span aria-hidden="true" style={{ color: "var(--primary)" }}>
                          ▸
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  {"tools" in job && job.tools && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {job.tools.map((t) => (
                        <span key={t} className="chip chip-white">
                          {t}
                        </span>
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
      </div>
    </section>
  );
}
