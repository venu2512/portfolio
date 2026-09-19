"use client";

import { profile } from "../content/data";
import Magnetic from "./Magnetic";
import Reveal from "./Reveal";
import HeroSlot from "./three/HeroSlot";

// Static line split for the mask reveal — measured at build time (no JS measuring).
const LINES: string[] = (() => {
  const words = profile.headline.split(" ");
  return [words.slice(0, 3).join(" "), words.slice(3).join(" ")].filter(Boolean);
})();

export default function Hero() {
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    import("../lib/scroll").then(({ scrollToSection }) => scrollToSection(id, reduced()));
  };

  return (
    <section id="hero" className="wrap pt-10 pb-16 md:pt-16 md:pb-24">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <Reveal>
            <span className="pill">
              <span className="dot-live" aria-hidden="true" />
              {profile.openToShort}
            </span>
          </Reveal>
          <h1 className="h1 mt-6">
            {LINES.map((line, i) => (
              <span key={i} className="line-mask">
                <span>{line}</span>
              </span>
            ))}
          </h1>
          <Reveal delay={120}>
            <p className="mt-6 text-lg max-w-md" style={{ color: "var(--muted)" }}>
              {profile.tagline}
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

        <HeroSlot />
      </div>

      <div className="mt-12 flex justify-center">
        <a href="#about" onClick={go("about")} className="mono-label" aria-label="Scroll to About">
          ↓ Scroll
        </a>
      </div>
    </section>
  );
}
