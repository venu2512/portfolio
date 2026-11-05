import { keycapLabel, profile, roles } from "../content/data";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

/**
 * "Areas of interest" — four colour-blocked tiles, one per area the résumé
 * supports (the four target roles from data.ts).
 *
 * Pattern basis: four equal tiles, one outcome line each, each linking onward
 * (teardown §1 #4 + §2 rows 1-3) — flat colour grounds, one radius, index
 * numbers instead of icons (§10.7: scale contrast replaces decoration).
 * Deliberate departures: no scroll pinning, and the project's own pastel
 * grounds instead of the reference's tile palette.
 *
 * Copy comes from `roles` in data.ts, where every line names the résumé
 * bullets it paraphrases.
 */
// `tile-block` because these are <a> elements: `.tile` intentionally leaves
// `display` alone so Tailwind's flex/grid utilities still win on the other tiles.
const TILE: Record<string, string> = {
  lavender: "tile tile-block tile-lavender",
  sky: "tile tile-block tile-sky",
  blush: "tile tile-block tile-blush",
  cream: "tile tile-block tile-cream",
};

const CHIP: Record<string, string> = {
  lavender: "chip chip-white",
  sky: "chip chip-white",
  blush: "chip chip-white",
  cream: "chip chip-white",
};

export default function Roles() {
  return (
    <section id="roles" className="band band-warm" aria-labelledby="roles-heading">
      <div className="wrap">
        <SectionHead
          id="roles"
          eyebrow="Focus"
          title={
            <>
              Areas of <em className="accent">interest</em>
            </>
          }
          lead={profile.openTo}
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5">
          {roles.map((role, i) => (
            <Reveal key={role.id} delay={i * 90} className="h-full">
              <a
                href={role.href}
                className={TILE[role.color] ?? "tile tile-block"}
                aria-label={`${role.title} — ${role.line}. Jump to the relevant section.`}
              >
                <span className="tile-index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold">{role.title}</h3>
                <p className="tile-sub mt-3 max-w-sm">{role.line}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {role.chips.map((chip) => (
                    <span key={chip} className={CHIP[role.color] ?? "chip"}>
                      {keycapLabel(chip)}
                    </span>
                  ))}
                </div>
                <span className="tile-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
