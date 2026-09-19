"use client";

import { useId, useRef } from "react";
import { useInViewMargin } from "../../lib/hooks";
import { useSiteStore } from "../../lib/store";
import useViewRegistration from "../../lib/useViewRegistration";

export type ProjectId = "certchain" | "legal-ai" | "cloud-nova";

const FALLBACKS: Record<ProjectId, React.ReactNode> = {
  certchain: (
    <svg viewBox="0 0 360 280" width="100%" height="100%" aria-hidden="true">
      <rect x="40" y="110" width="56" height="56" rx="14" fill="var(--lavender)" />
      <rect x="106" y="110" width="56" height="56" rx="14" fill="var(--primary-soft)" />
      <rect x="172" y="110" width="56" height="56" rx="14" fill="var(--lavender)" />
      <rect x="238" y="110" width="56" height="56" rx="14" fill="var(--primary-soft)" />
      <circle cx="290" cy="90" r="20" fill="var(--sky)" />
      <path d="M282 90 l6 6 l12 -12" stroke="var(--primary)" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  ),
  "legal-ai": (
    <svg viewBox="0 0 360 280" width="100%" height="100%" aria-hidden="true">
      <rect x="120" y="170" width="120" height="14" rx="6" fill="var(--sky)" />
      <rect x="126" y="148" width="108" height="14" rx="6" fill="var(--lavender)" />
      <rect x="132" y="126" width="96" height="14" rx="6" fill="var(--blush)" />
      <circle cx="180" cy="80" r="26" fill="var(--primary-soft)" />
      <rect x="172" y="30" width="16" height="34" rx="8" fill="var(--ink)" opacity="0.7" />
      <circle cx="255" cy="200" r="16" fill="var(--cream)" />
    </svg>
  ),
  "cloud-nova": (
    <svg viewBox="0 0 360 280" width="100%" height="100%" aria-hidden="true">
      <circle cx="140" cy="140" r="42" fill="var(--sky)" />
      <circle cx="190" cy="120" r="50" fill="var(--lavender)" />
      <circle cx="235" cy="150" r="38" fill="var(--sky)" />
      <circle cx="165" cy="165" r="40" fill="var(--blush)" />
      <ellipse cx="110" cy="220" rx="16" ry="8" fill="var(--primary-soft)" />
      <ellipse cx="270" cy="210" rx="14" ry="7" fill="var(--primary-soft)" />
    </svg>
  ),
};

export default function ProjectSlot({
  pid,
  onOpen,
}: {
  pid: ProjectId;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { visible } = useInViewMargin(ref);
  const id = useId();
  const webgl = useSiteStore((s) => s.webgl);
  const simpleView = useSiteStore((s) => s.simpleView);
  useViewRegistration(id, ref, visible);

  const canvasLive = webgl === "ok" && !simpleView;

  return (
    <div
      ref={ref}
      data-view={`project-${pid}`}
      className="view-slot card-soft overflow-hidden cursor-pointer"
      style={{ aspectRatio: "360 / 280" }}
      data-3d={canvasLive ? "on" : "off"}
      role="button"
      tabIndex={0}
      aria-label={`Open ${pid} details`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      {!canvasLive && <div className="view-fallback">{FALLBACKS[pid]}</div>}
    </div>
  );
}
