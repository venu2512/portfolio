import { profile } from "../content/data";
import Photo from "./Photo";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const FOCUS = ["Multi-Agent Systems", "LLM Fine-Tuning", "Data Analytics", "Full Stack"];

/**
 * Full-bleed deep-navy band (teardown §2 rows 2-3: one story owns a whole
 * ground colour; §10.5: colour is the navigation). Content stays inside .wrap.
 */
export default function About() {
  return (
    <section id="about" className="band band-navy">
      <div className="wrap">
        <SectionHead
          id="about"
          eyebrow="About"
          title={
            <>
              A quick <em className="accent">introduction</em>
            </>
          }
          lead={profile.openTo}
        />

        <div className="mt-8 grid md:grid-cols-4 gap-4 auto-rows-auto">
          {/* Summary — big card */}
          <Reveal className="md:col-span-3 h-full">
            <div className="card-navy p-7 h-full">
              <p className="text-lg leading-relaxed" style={{ color: "var(--navy-ink)" }}>
                {profile.summary}
              </p>
            </div>
          </Reveal>

          {/* Photo card */}
          <Reveal delay={80} className="md:col-span-1 h-full">
            <div className="card-navy p-5 h-full flex flex-col items-center justify-between gap-4">
              <Photo className="w-full max-w-[180px]" rounded="rounded-[24px]" monogramSize="text-6xl" />
              <span
                className="pill !text-xs"
                style={{
                  background: "rgba(255,255,255,.1)",
                  borderColor: "rgba(255,255,255,.16)",
                  color: "var(--navy-ink)",
                }}
              >
                Based in {profile.location}
              </span>
            </div>
          </Reveal>

          {/* Status (open to work — no "Currently"/live wording) */}
          <Reveal delay={120} className="md:col-span-2 h-full">
            <div className="card-navy p-7 h-full">
              <p className="mono-label" style={{ color: "var(--navy-muted)" }}>
                Status
              </p>
              <p className="mt-3 font-bold text-lg" style={{ color: "var(--navy-ink)" }}>
                {profile.openToShort}
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--navy-muted)" }}>
                Recently completed the AI/ML Engineer internship at KreupAI Technologies LLC · AISA
                multi-agent digital workforce platform
              </p>
            </div>
          </Reveal>

          {/* Languages */}
          <Reveal delay={160} className="md:col-span-1 h-full">
            <div className="card-navy p-7 h-full">
              <p className="mono-label" style={{ color: "var(--navy-muted)" }}>
                Languages
              </p>
              <div className="mt-3 flex flex-col items-start gap-2">
                {profile.languages.map((l) => (
                  <span key={l.name} className="chip chip-on-navy">
                    {l.name} · {l.level}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Focus */}
          <Reveal delay={200} className="md:col-span-1 h-full">
            <div className="card-navy p-7 h-full">
              <p className="mono-label" style={{ color: "var(--navy-muted)" }}>
                Focus
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {FOCUS.map((f) => (
                  <span key={f} className="chip chip-on-navy">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
