"use client";

import { keycapLabel, profile } from "../content/data";
import { useReveal } from "../lib/hooks";
import Magnetic from "./Magnetic";
import Reveal from "./Reveal";
import HeroSlot from "./three/HeroSlot";

// Static line split for the mask reveal — measured at build time (no JS measuring).
const LINES: string[] = (() => {
  const words = profile.headline.split(" ");
  return [words.slice(0, 3).join(" "), words.slice(3).join(" ")].filter(Boolean);
})();

const CHIP_WASH = ["chip chip-lavender", "chip chip-sky", "chip chip-blush", "chip chip-cream"];

export default function Hero() {
  // One reveal trigger drives the line-mask (.in) and the rest of the hero.
  const { ref: heroRef, inView: heroInView } = useReveal<HTMLDivElement>();
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    import("../lib/scroll").then(({ scrollToSection }) => scrollToSection(id, reduced()));
  };

  return (
    <section
      id="hero"
      className="band hero-band band-tint min-h-[calc(100svh-4.5rem)] flex flex-col justify-center"
    >
      <div className="wrap">
        {/* Fold rule (inspo heroGuidance): nav, headline, supporting line, CTAs
            and the medallion all fit inside the first viewport. The min-height
            subtracts the navbar row so the fold promise stays true. */}
        <div ref={heroRef} className="grid md:grid-cols-12 gap-10 md:gap-12 items-center">
          <div className="md:col-span-7">
            <Reveal>
              <span className="pill">
                <span className="dot-live" aria-hidden="true" />
                {profile.openToShort}
              </span>
            </Reveal>

            <h1 className="h1 mt-6 text-balance">
              {LINES.map((line, i) => (
                <span key={i} className={`line-mask ${heroInView ? "in" : ""}`}>
                  {/* Signature orange square — the one repeating accent gesture
                      beside the CTA (inspo dversostudio.io pattern). */}
                  <span>
                    {line}
                    {i === LINES.length - 1 && <span className="accent-dot" aria-hidden="true" />}
                  </span>
                </span>
              ))}
            </h1>

            <Reveal delay={120}>
              <p className="mt-6 text-xl md:text-2xl font-semibold max-w-xl">{profile.openTo}</p>
            </Reveal>

            <Reveal delay={160}>
              <p className="hero-dateline mt-5">
                {profile.location} · AI engineer · Open to full-time roles and internships
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <a href="#projects" onClick={go("projects")} className="btn btn-primary">
                    View my work
                  </a>
                </Magnetic>
                <a href={profile.resumePdf} download className="btn btn-secondary">
                  Download resume
                </a>
              </div>
            </Reveal>

            <Reveal delay={280}>
              <div className="mt-6 flex items-center gap-3">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="btn btn-ghost !min-h-0 h-11 w-11 !p-0"
                >
                  GH
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="btn btn-ghost !min-h-0 h-11 w-11 !p-0"
                >
                  IN
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Email Venugopal"
                  className="btn btn-ghost !min-h-0 h-11 w-11 !p-0"
                >
                  @
                </a>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-5">
            <Reveal delay={120}>
              <div className="hero-frame">
                <HeroSlot />
              </div>
              {/* Always-visible chip list: the same skills the 3D medallion
                  floats, so the content survives with no WebGL and no JS. */}
              <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                {profile.heroChips.map((chip, i) => (
                  <span key={chip} className={CHIP_WASH[i % CHIP_WASH.length]}>
                    {keycapLabel(chip)}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-14 flex justify-center">
          <a href="#about" onClick={go("about")} className="mono-label" aria-label="Scroll to About">
            ↓ Scroll
          </a>
        </div>
      </div>
    </section>
  );
}
