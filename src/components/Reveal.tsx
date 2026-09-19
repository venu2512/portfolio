"use client";

import { useReveal } from "../lib/hooks";

/**
 * Adds .reveal and toggles .in on first intersection (shared CSS in globals).
 * With JS off, children are fully visible (hidden states require html.enhanced).
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
