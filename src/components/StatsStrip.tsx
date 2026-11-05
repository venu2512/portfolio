"use client";

import { deriveStats } from "../content/data";
import { useCountUp, useReveal } from "../lib/hooks";
import { scrollToSection } from "../lib/scroll";

// Presentation only — the pastel per card is this project's wash set.
const WASH = ["tile tile-lavender", "tile tile-sky", "tile tile-blush", "tile tile-cream"];

function Stat({
  value,
  label,
  caption,
  href,
  wash,
}: {
  value: number | string;
  label: string;
  caption: string;
  href: string;
  wash: string;
}) {
  const { ref, inView } = useReveal<HTMLAnchorElement>();
  const isPlusString = typeof value === "string" && value.endsWith("+") && !isNaN(parseInt(value, 10));
  const numericTarget = typeof value === "number" ? value : isPlusString ? parseInt(value, 10) : 0;
  const isNum = typeof value === "number" && value < 100;
  const shouldAnimate = (isNum || isPlusString) && numericTarget < 100;
  const shown = useCountUp(shouldAnimate ? numericTarget : 0, inView);

  return (
    <a
      ref={ref}
      href={href}
      className={`${wash} stat-card`}
      onClick={(e) => {
        e.preventDefault();
        scrollToSection(href.slice(1), window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      }}
    >
      <div className="stat-num">
        {shouldAnimate ? (isPlusString ? `${shown}+` : shown) : value}
      </div>
      <div className="mono-label mt-1">{label}</div>
      <div className="stat-caption tile-sub mt-2">{caption}</div>
    </a>
  );
}

export default function StatsStrip() {
  const stats = deriveStats();
  return (
    <section aria-label="Stats" className="wrap py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {stats.map((s, i) => (
          <Stat
            key={s.label}
            value={s.value}
            label={s.label}
            caption={s.caption}
            href={s.href}
            wash={WASH[i % WASH.length]!}
          />
        ))}
      </div>
      {/* Qualified-claim habit from the reference teardown (§9): the numbers are
          countable from src/content/data.ts, so say that instead of implying more. */}
      <p className="stat-note mt-4">
        Every figure is counted from the résumé data on this page — none are estimates.
      </p>
    </section>
  );
}
