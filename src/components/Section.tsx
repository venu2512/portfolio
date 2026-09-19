"use client";

import { ReactNode } from "react";
import { useSiteStore } from "../lib/store";

export default function Section({
  id,
  index,
  title,
  label,
  children,
}: {
  id: string;
  index: number;
  title: string;
  label: string;
  children: ReactNode;
}) {
  const active = useSiteStore((s) => s.active);
  const isActive = active === index;
  const isNear = Math.abs(active - index) === 1;

  return (
    <section id={id} className="section" data-active={isActive ? "true" : isNear ? "near" : "false"} aria-labelledby={`${id}-heading`}>
      <div className="w-full">
        <p className="mono-label mb-2">{label}</p>
        <h2 id={`${id}-heading`} className="text-xl md:text-2xl font-semibold mb-4">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
