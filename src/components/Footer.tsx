"use client";

import { profile } from "../content/data";
import { scrollToSection } from "../lib/scroll";
import ThreeDToggle from "./ThreeDToggle";

const LINKS = ["about", "roles", "experience", "skills", "projects", "education", "faq", "contact"];

// Display label per section id; `roles` keeps its id (and every existing
// #roles link) but is labelled "Interests" to match the section heading.
const LABELS: Record<string, string> = { roles: "Interests" };

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="wrap pb-10 pt-4">
      {/* Landmark name read from the reference teardown (§8): the footer opens
          with a visually hidden heading so the <footer> landmark is announced. */}
      <h2 className="sr-only">Site footer</h2>
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-6 py-8"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm text-white"
            style={{ background: "linear-gradient(135deg, var(--primary), #ff9a4d)" }}
            aria-hidden="true"
          >
            {profile.monogram}
          </span>
          <div>
            <p className="font-bold">{profile.name}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>{profile.location}</p>
          </div>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
          {LINKS.map((l) => (
            <a
              key={l}
              href={`#${l}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(l, window.matchMedia("(prefers-reduced-motion: reduce)").matches);
              }}
              style={{ color: "var(--muted)" }}
              className="capitalize hover:opacity-70"
            >
              {LABELS[l] ?? l}
            </a>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
          <div className="flex gap-3">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="underline">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="underline">LinkedIn</a>
            <button
              type="button"
              className="underline"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to top
            </button>
          </div>
          <ThreeDToggle />
        </div>
      </div>
      <p className="text-center text-xs mt-6" style={{ color: "var(--muted)" }}>
        Built with Next.js, React Three Fiber and Three.js · © {year} Venugopal V · every number on
        this page is countable from the résumé data in the source
      </p>
    </footer>
  );
}
