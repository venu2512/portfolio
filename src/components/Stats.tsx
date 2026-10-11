import { profile } from "../data/profile";
import { resolveColor } from "../lib/ui";
import Reveal from "./Reveal";

export default function Stats() {
  return (
    <section aria-label="Key facts" className="section-y">
      <div className="container-x">
        <ul className="flex flex-wrap gap-5">
          {profile.stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              as="li"
              delay={index * 0.06}
              className="flex-1 basis-[45%] md:basis-[220px]"
            >
              <div className="card h-full p-6 md:p-7">
                <p
                  className="font-display text-stat-sm md:text-stat"
                  style={{ color: resolveColor(stat.color) }}
                >
                  {stat.value}
                </p>
                <p className="mt-2 text-[17px] text-muted">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
