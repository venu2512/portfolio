import { education } from "../content/data";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const WASH = ["tile tile-cream", "tile tile-blush"];

export default function Education() {
  return (
    <section id="education" className="band band-warm" aria-labelledby="education-heading">
      <div className="wrap">
        <SectionHead
          id="education"
          eyebrow="Education"
          title={
            <>
              Where I <em className="accent">studied</em>
            </>
          }
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5">
          {education.map((e, i) => (
            <Reveal key={e.id} delay={i * 80} className="h-full">
              <div className={`${WASH[i % WASH.length]} h-full`}>
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <h3 className="text-lg font-bold">{e.school}</h3>
                  <span className="chip chip-white">{e.period}</span>
                </div>
                <p className="mt-1 tile-sub">{e.credential}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
