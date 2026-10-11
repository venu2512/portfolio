import { profile } from "../data/profile";
import Reveal from "./Reveal";

export default function Experience() {
  return (
    <section
      id="experience"
      className="border-y border-line bg-card"
    >
      <div className="container-x section-y">
        <Reveal>
          <p className="label">Experience</p>
          <h2 className="mt-4 max-w-[720px] text-h2-sm md:text-h2">
            Three internships, one direction.
          </h2>
        </Reveal>

        <div className="mt-12 divide-y divide-line border-t border-line">
          {profile.experience.map((item, index) => (
            <Reveal key={`${item.role}-${item.org}`} delay={index * 0.06}>
              <article className="flex flex-wrap gap-6 py-10">
                <div className="flex-1 basis-[220px]">
                  <p className="font-mono text-sm text-ink">{item.when}</p>
                  {item.where ? (
                    <p className="mt-1 font-mono text-[13px] text-muted">{item.where}</p>
                  ) : null}
                </div>
                <div className="flex-[3] basis-[480px]">
                  <h3 className="text-[24px] md:text-[30px]">
                    {item.role} <span className="text-muted">·</span> {item.org}
                  </h3>
                  <p className="mt-3 max-w-[680px] text-[17px] text-muted">{item.text}</p>
                  <p className="mt-4 font-mono text-[13px] text-violet">{item.stack}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
