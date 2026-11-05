"use client";

import { useEffect, useRef, useState } from "react";
import { profile, roles } from "../content/data";
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

// Right rail of the Roles panel — real destinations only.
// Mobile sheet order — the desktop dropdown collapses to one entry here.
const MOBILE_LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "roles", label: "Interests" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

const RAIL = [
  { label: "Résumé", href: profile.resumePdf, hint: "PDF download", download: true },
  { label: "GitHub", href: profile.github, hint: "code", external: true },
  { label: "LinkedIn", href: profile.linkedin, hint: "profile", external: true },
  { label: profile.email, href: `mailto:${profile.email}`, hint: "email" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const rolesRef = useRef<HTMLDivElement>(null);

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

  // Roles panel: Esc closes and returns focus, outside click closes. No close
  // delay — the reference's 1s delay is hostile to keyboard users.
  useEffect(() => {
    if (!rolesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setRolesOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (rolesRef.current && !rolesRef.current.contains(e.target as Node)) setRolesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [rolesOpen]);

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
    setRolesOpen(false);
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

        {/* Desktop links appear at lg: at 768–1023 the eight links plus the
            right rail overran the viewport, so those widths get the sheet. */}
        <div className="hidden lg:flex items-center gap-5">
          <a href="#about" onClick={go("about")} className="nav-link" aria-current={active === "about" ? "true" : undefined}>
            About
          </a>

          {/* Roles disclosure: four role names on the left, real destinations
              on the right. Button + panel (not role="menu") so keyboard use is
              plain Tab/Shift-Tab/Esc. */}
          <div className="nav-drop" ref={rolesRef}>
            <button
              type="button"
              className="nav-link flex items-center gap-1"
              aria-expanded={rolesOpen}
              aria-controls="roles-panel"
              onClick={() => setRolesOpen((v) => !v)}
            >
              Interests
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" style={{ transform: rolesOpen ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }}>
                <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            {rolesOpen && (
              <div id="roles-panel" className="nav-drop-panel">
                <div className="nav-drop-col">
                  <p className="mono-label mb-2">Target roles</p>
                  {roles.map((r) => (
                    <a key={r.id} href={r.href} className="nav-drop-item" onClick={go(r.href.slice(1))}>
                      {r.title}
                      <span>{r.line}</span>
                    </a>
                  ))}
                </div>
                <div className="nav-drop-col">
                  <p className="mono-label mb-2">Explore more</p>
                  {RAIL.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="nav-drop-item"
                      {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      {...(item.download ? { download: true } : {})}
                      onClick={() => setRolesOpen(false)}
                    >
                      {item.label}
                      <span>{item.hint}</span>
                    </a>
                  ))}
                  <div className="nav-drop-divider mt-3" />
                  <a href="#roles" className="mono-label mt-3 hover:opacity-70" onClick={go("roles")}>
                    See all four roles ↓
                  </a>
                </div>
              </div>
            )}
          </div>

          {LINKS.filter((l) => l.id !== "about").map((l) => (
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
          <a href="#contact" onClick={go("contact")} className="btn btn-primary hidden lg:inline-flex !min-h-0 !py-2">
            Contact
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="btn btn-secondary lg:hidden !min-h-0 !px-3 !py-2"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div ref={sheetRef} id="mobile-menu" className="fixed inset-0 z-50 flex flex-col p-6 lg:hidden"
          style={{ background: "var(--surface)" }} role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex items-center justify-between mb-8">
            <span className="font-extrabold">{profile.monogram}</span>
            <button type="button" className="btn btn-secondary !min-h-0 !px-3 !py-2" aria-label="Close menu"
              onClick={() => { setMenuOpen(false); toggleRef.current?.focus(); }}>
              ✕
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-col gap-2">
            {MOBILE_LINKS.map((l) => (
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
