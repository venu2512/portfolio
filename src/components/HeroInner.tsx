"use client";

import { useEffect, useState } from "react";
import { profile } from "../content/data";
import { useSiteStore } from "../lib/store";
import { scrollToSection } from "../lib/scroll";

export default function HeroInner() {
  const reduced = useSiteStore((s) => s.reducedMotion);
  const roles = profile.rotatingRoles;
  const [typed, setTyped] = useState<string>(() => roles[0] ?? "");

  useEffect(() => {
    if (reduced) return; // static first role is already rendered
    // Typewriter: type (46ms/char), hold 1.4s, delete (28ms/char), next role.
    let i = 0;
    let char = 0;
    let deleting = false;
    let t = 0;

    const tick = () => {
      const role = roles[i] ?? "";
      if (!deleting) {
        char += 1;
        setTyped(role.slice(0, char));
        if (char >= role.length) {
          deleting = true;
          t = window.setTimeout(tick, 1400);
          return;
        }
        t = window.setTimeout(tick, 46);
      } else {
        char -= 1;
        setTyped(role.slice(0, char));
        if (char <= 0) {
          deleting = false;
          i = (i + 1) % roles.length;
          t = window.setTimeout(tick, 350);
          return;
        }
        t = window.setTimeout(tick, 28);
      }
    };

    t = window.setTimeout(tick, 400);
    return () => window.clearTimeout(t);
  }, [reduced, roles]);

  return (
    <div className="hud-card">
      <p className="mono-label mb-3">Portfolio · 2026</p>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
        {profile.name}
      </h1>
      <p className="mt-3 text-lg md:text-xl text-[#67e8f9] font-medium min-h-[1.6em]">
        {typed}
        <span
          aria-hidden="true"
          className="inline-block w-[2px] h-[1.1em] align-middle ml-0.5"
          style={{
            background: "#22d3ee",
            animation: reduced ? "none" : "cue-bob 1s steps(2) infinite",
          }}
        />
        <span className="sr-only">{profile.role}</span>
      </p>
      <p className="mt-3 text-sm md:text-base text-[#c9d4f0] max-w-xl">{profile.tagline}</p>
      <div className="flex flex-wrap gap-3 mt-5">
        <button type="button" className="btn" onClick={() => scrollToSection("about", reduced)}>
          Explore ↓
        </button>
        <a className="btn btn-violet" href={profile.resumePdf} download>
          Download Resume
        </a>
      </div>
      <p className="mono-label mt-6 scroll-cue">Scroll to travel the corridor ↓</p>
    </div>
  );
}
