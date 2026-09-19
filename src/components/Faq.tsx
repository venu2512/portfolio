"use client";

import { useRef } from "react";
import { faq } from "../content/data";
import Reveal from "./Reveal";

export default function Faq() {
  const openRef = useRef<HTMLDetailsElement | null>(null);

  const onToggle = (e: React.ToggleEvent<HTMLDetailsElement>) => {
    const el = e.currentTarget;
    if (el.open && openRef.current && openRef.current !== el) {
      openRef.current.open = false;
    }
    if (el.open) openRef.current = el;
    else if (openRef.current === el) openRef.current = null;
  };

  return (
    <section id="faq" className="wrap section">
      <Reveal>
        <p className="mono-label">FAQ</p>
        <h2 className="h2 mt-2">Questions, answered</h2>
      </Reveal>
      <Reveal delay={80}>
        <div className="mt-6 card px-7 py-2">
          {faq.map((f, i) => (
            <details key={i} className="faq-item" onToggle={onToggle}>
              <summary>
                {f.q}
                <span className="faq-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <div className="faq-body">
                <div>
                  <p className="pb-5 pr-8" style={{ color: "var(--muted)" }}>{f.a}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
