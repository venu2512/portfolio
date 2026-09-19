"use client";

import { useEffect, useRef, useState } from "react";
import { useSiteStore } from "../lib/store";
import { scrollToSection } from "../lib/scroll";
import { useReducedMotion } from "../lib/hooks";
import { waypoints } from "../scene/waypoints";
import SimpleViewToggle from "./SimpleViewToggle";

export default function Nav() {
  const active = useSiteStore((s) => s.active);
  const reduced = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToSection(id, reduced);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Desktop vertical dot rail */}
      <nav aria-label="Sections" className="nav-rail">
        {waypoints.map((w, i) => (
          <a
            key={w.id}
            href={`#${w.id}`}
            onClick={go(w.id)}
            className="nav-dot"
            aria-current={i === active ? "true" : undefined}
          >
            <span className="nav-label">{w.navLabel}</span>
          </a>
        ))}
        <div className="mt-3 flex flex-col items-center gap-2">
          <SimpleViewToggle compact />
        </div>
        <TierMenu />
      </nav>

      {/* Mobile top bar */}
      <div className="topbar">
        <a href="#hero" onClick={go("hero")} className="font-semibold tracking-wide">
          Venu<span style={{ color: "#22d3ee" }}>.</span>
        </a>
        <div className="flex items-center gap-2">
          <SimpleViewToggle compact />
          <button
            type="button"
            className="btn px-3 py-1"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
        {menuOpen && (
          <nav id="mobile-menu" aria-label="Sections" className="topbar-menu">
            {waypoints.map((w, i) => (
              <a
                key={w.id}
                href={`#${w.id}`}
                onClick={go(w.id)}
                aria-current={i === active ? "page" : undefined}
              >
                {w.navLabel}
              </a>
            ))}
          </nav>
        )}
      </div>
    </>
  );
}

function TierMenu() {
  const tierOverride = useSiteStore((s) => s.tierOverride);
  const set = useSiteStore((s) => s.set);
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const items: Array<{ v: "auto" | "high" | "medium" | "low"; label: string }> = [
    { v: "auto", label: "Auto" },
    { v: "high", label: "High" },
    { v: "medium", label: "Medium" },
    { v: "low", label: "Low" },
  ];

  return (
    <div className="relative mt-3" ref={ref}>
      <button
        type="button"
        className="nav-dot w-auto rounded-full px-2 py-0.5 font-mono text-[0.55rem]"
        style={{ height: "auto" }}
        aria-expanded={open}
        aria-label={`Quality tier: ${tierOverride}`}
        onClick={() => setOpen((v) => !v)}
      >
        {tierOverride.toUpperCase()}
      </button>
      {open && (
        <div
          className="absolute right-0 bottom-0 mb-9 w-24 rounded-md border py-1"
          style={{ background: "rgba(7,9,20,0.97)", borderColor: "rgba(34,211,238,0.25)" }}
        >
          {items.map((it) => (
            <button
              key={it.v}
              type="button"
              className="block w-full px-3 py-1.5 text-left font-mono text-[0.65rem] tracking-wider"
              style={{ color: tierOverride === it.v ? "#f59e0b" : "#9aa7c7" }}
              onClick={() => {
                set("tierOverride", it.v);
                setOpen(false);
              }}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
