"use client";

import { ReactNode } from "react";

export default function HudCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`hud-card ${className}`}>{children}</div>;
}
