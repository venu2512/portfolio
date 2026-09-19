import { education } from "../content/data";
import Reveal from "./Reveal";

export default function Education() {
  return (
    <section id="education" className="wrap section">
      <Reveal>
        <p className="mono-label">Education</p>
        <h2 className="h2 mt-2">Where I <em className="accent">studied</em></h2>
      </Reveal>
      <div className="mt-8 timeline flex flex-col gap-6">
        {education.map((e, i) => (
          <Reveal key={e.id} delay={i * 80}>
            <div className="relative">
              <span className="timeline-dot" aria-hidden="true" />
              <div className="card p-6">
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <h3 className="text-lg font-bold">{e.school}</h3>
                  <span className="chip chip-primary">{e.period}</span>
                </div>
                <p className="mt-1" style={{ color: "var(--muted)" }}>
                  {e.credential}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
