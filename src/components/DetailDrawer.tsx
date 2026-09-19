"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSiteStore } from "../lib/store";
import { experience, projects } from "../content/data";

type DrawerKind = { kind: "experience" | "project"; id: string } | null;

function resolve(kind: DrawerKind) {
  if (!kind) return null;
  if (kind.kind === "experience") {
    const e = experience.find((x) => x.id === kind.id);
    if (!e) return null;
    return {
      title: e.title,
      subtitle: e.org,
      meta: e.period ?? undefined,
      current: "current" in e ? Boolean(e.current) : false,
      bullets: e.bullets,
      chips: "tools" in e ? e.tools : undefined,
      chipLabel: "tools" in e ? "Tools & agents" : undefined,
      repoUrl: undefined,
    };
  }
  const p = projects.find((x) => x.id === kind.id);
  if (!p) return null;
  return {
    title: p.name,
    subtitle: p.subtitle,
    meta: undefined,
    current: false,
    bullets: p.bullets,
    chips: p.stack,
    chipLabel: "Stack",
    repoUrl: p.repoUrl ?? undefined,
  };
}

export default function DetailDrawer() {
  const selectedId = useSiteStore((s) => s.selectedId);
  const set = useSiteStore((s) => s.set);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  // Selected ids are namespaced: "exp:<id>" or "proj:<id>".
  const kind: DrawerKind = !selectedId
    ? null
    : selectedId.startsWith("exp:")
      ? { kind: "experience", id: selectedId.slice(4) }
      : selectedId.startsWith("proj:")
        ? { kind: "project", id: selectedId.slice(5) }
        : null;

  const data = resolve(kind);

  useEffect(() => {
    if (!data) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;

    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );
    const first = focusables()[0];
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        set("selectedId", null);
        return;
      }
      if (e.key === "Tab") {
        const list = focusables();
        if (list.length === 0) return;
        const firstEl = list[0] as HTMLElement;
        const lastEl = list[list.length - 1] as HTMLElement;
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      restoreFocusRef.current?.focus?.();
    };
  }, [data, set]);

  if (!data || typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        className="drawer-backdrop"
        onClick={() => set("selectedId", null)}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="drawer-panel p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mono-label">{data.subtitle}</p>
            <h3 id="drawer-title" className="text-lg font-semibold mt-1">
              {data.title}
            </h3>
            {data.meta && <p className="text-sm text-[#9aa7c7] mt-1">{data.meta}</p>}
            {data.current && (
              <span className="chip chip-amber mt-2">Active · Present</span>
            )}
          </div>
          <button
            type="button"
            className="btn px-3 py-1"
            onClick={() => set("selectedId", null)}
          >
            Close
          </button>
        </div>

        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#c9d4f0]">
          {data.bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden="true" style={{ color: "#22d3ee" }}>▸</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {data.chips && data.chips.length > 0 && (
          <div className="mt-5">
            <p className="mono-label mb-2">{data.chipLabel}</p>
            <div className="flex flex-wrap gap-2">
              {data.chips.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.repoUrl && (
          <a href={data.repoUrl} target="_blank" rel="noopener noreferrer" className="btn mt-6">
            View repository ↗
          </a>
        )}
      </div>
    </>,
    document.body
  );
}
