import { profile } from "../content/data";
import Photo from "./Photo";
import Reveal from "./Reveal";

const FOCUS = ["Multi-Agent Systems", "LLM Fine-Tuning", "Data Analytics", "Full Stack"];

export default function About() {
  return (
    <section id="about" className="wrap section">
      <Reveal>
        <p className="mono-label">About</p>
        <h2 className="h2 mt-2">A quick introduction</h2>
      </Reveal>

      <div className="mt-8 grid md:grid-cols-4 gap-4 auto-rows-auto">
        {/* Summary — big card */}
        <Reveal className="md:col-span-3">
          <div className="card p-7 h-full">
            <p className="text-lg leading-relaxed">{profile.summary}</p>
          </div>
        </Reveal>

        {/* Photo card */}
        <Reveal delay={80} className="md:col-span-1">
          <div className="card-soft p-5 h-full flex flex-col items-center justify-between gap-4">
            <Photo className="w-full max-w-[180px]" rounded="rounded-[24px]" monogramSize="text-6xl" />
            <span className="pill !text-xs">Based in {profile.location}</span>
          </div>
        </Reveal>

        {/* Status (open to work — no "Currently"/live wording) */}
        <Reveal delay={120} className="md:col-span-2">
          <div className="card p-7 h-full" style={{ background: "var(--primary-soft)" }}>
            <p className="mono-label">Status</p>
            <p className="mt-3 font-bold text-lg">{profile.openToShort}</p>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              Recently completed the AI/ML Engineer internship at KreupAI Technologies LLC ·
              AISA multi-agent digital workforce platform
            </p>
          </div>
        </Reveal>

        {/* Languages */}
        <Reveal delay={160} className="md:col-span-1">
          <div className="card p-7 h-full">
            <p className="mono-label">Languages</p>
            <div className="mt-3 flex flex-col items-start gap-2">
              {profile.languages.map((l) => (
                <span key={l.name} className="chip chip-lavender">
                  {l.name} · {l.level}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Focus */}
        <Reveal delay={200} className="md:col-span-1">
          <div className="card p-7 h-full">
            <p className="mono-label">Focus</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FOCUS.map((f) => (
                <span key={f} className="chip chip-sky">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
