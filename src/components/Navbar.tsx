"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "../content/data";
import { scrollToSection } from "../lib/scroll";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "faq", label: "FAQ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active-section highlight + hash sync.
  useEffect(() => {
    const ids = LINKS.map((l) => l.id);
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (e.isIntersecting) {
            const id = e.target.id;
            setActive(id);
            if (window.location.hash !== `#${id}`) {
              history.replaceState(null, "", `#${id}`);
            }
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Focus trap + Esc for the mobile sheet.
  useEffect(() => {
    if (!menuOpen) return;
    const sheet = sheetRef.current;
    if (!sheet) return;
    const focusables = () =>
      Array.from(sheet.querySelectorAll<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])"));
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    sheet.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      sheet.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToSection(id, window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <nav aria-label="Primary" className="wrap flex items-center justify-between gap-4 py-3">
        <a
          href="#hero"
          onClick={go("hero")}
          className="flex items-center gap-2 font-extrabold text-lg"
          aria-label={`${profile.name} — home`}
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm text-white"
            style={{ background: "linear-gradient(135deg, var(--primary), #ff9a4d)" }}
            aria-hidden="true"
          >
            {profile.monogram}
          </span>
          {profile.shortName}
        </a>

        <div className="hidden md:flex items-center gap-5">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={go(l.id)}
              className="nav-link"
              aria-current={active === l.id ? "true" : undefined}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href="#contact" onClick={go("contact")} className="btn btn-primary hidden md:inline-flex !min-h-0 !py-2">
            Contact
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="btn btn-secondary md:hidden !min-h-0 !px-3 !py-2"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div ref={sheetRef} id="mobile-menu" className="fixed inset-0 z-50 flex flex-col p-6 md:hidden"
          style={{ background: "var(--surface)" }} role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex items-center justify-between mb-8">
            <span className="font-extrabold">{profile.monogram}</span>
            <button type="button" className="btn btn-secondary !min-h-0 !px-3 !py-2" aria-label="Close menu"
              onClick={() => { setMenuOpen(false); toggleRef.current?.focus(); }}>
              ✕
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-col gap-2">
            {[...LINKS, { id: "contact", label: "Contact" }].map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={go(l.id)}
                className="py-3 text-3xl font-extrabold"
                style={{ letterSpacing: "-0.02em" }}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
