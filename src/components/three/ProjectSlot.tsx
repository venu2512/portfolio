"use client";

import { useRef } from "react";
import Image from "next/image";
import { useInViewMargin } from "../../lib/hooks";
import useViewRegistration from "../../lib/useViewRegistration";
import { useSlotPointer } from "../../three/pointer";

export type ProjectId =
  | "ai-college"
  | "ebook-studio"
  | "code-judge"
  | "automl-pipeline"
  | "legal-ai"
  | "cloud-nova"
  | "certchain";

const FALLBACKS: Record<ProjectId, React.ReactNode> = {
  "ai-college": (
    <svg viewBox="0 0 360 280" width="100%" height="100%" aria-hidden="true">
      <circle cx="180" cy="140" r="32" fill="var(--primary-soft)" />
      <circle cx="180" cy="140" r="16" fill="var(--primary)" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 180 + Math.cos(rad) * 82;
        const y = 140 + Math.sin(rad) * 62;
        return (
          <g key={i}>
            <line x1="180" y1="140" x2={x} y2={y} stroke="var(--line)" strokeWidth="2" strokeDasharray="4 3" />
            <circle cx={x} cy={y} r="12" fill={i % 2 === 0 ? "var(--lavender)" : "var(--sky)"} />
          </g>
        );
      })}
    </svg>
  ),
  "ebook-studio": (
    <svg viewBox="0 0 360 280" width="100%" height="100%" aria-hidden="true">
      {/* Book base */}
      <rect x="70" y="70" width="105" height="140" rx="8" fill="var(--lavender)" />
      <rect x="185" y="70" width="105" height="140" rx="8" fill="var(--primary-soft)" />
      <line x1="180" y1="65" x2="180" y2="215" stroke="var(--ink)" strokeWidth="3" opacity="0.3" />
      {/* Lines on pages */}
      <line x1="90" y1="100" x2="155" y2="100" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      <line x1="90" y1="120" x2="155" y2="120" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      <line x1="90" y1="140" x2="140" y2="140" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      <line x1="205" y1="100" x2="270" y2="100" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      <line x1="205" y1="120" x2="270" y2="120" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      <line x1="205" y1="140" x2="250" y2="140" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      {/* AI sparkle */}
      <circle cx="270" cy="80" r="14" fill="var(--primary)" />
    </svg>
  ),
  "code-judge": (
    <svg viewBox="0 0 360 280" width="100%" height="100%" aria-hidden="true">
      {/* Terminal window */}
      <rect x="60" y="60" width="240" height="160" rx="12" fill="var(--ink)" />
      <circle cx="85" cy="80" r="5" fill="#ff5f56" />
      <circle cx="102" cy="80" r="5" fill="#ffbd2e" />
      <circle cx="119" cy="80" r="5" fill="#27c93f" />
      {/* Code prompt and brackets */}
      <text x="85" y="125" fill="#27c93f" fontFamily="monospace" fontSize="18" fontWeight="bold">&gt; judge --test</text>
      <text x="85" y="155" fill="#A5CFFF" fontFamily="monospace" fontSize="14">All 12 testcases passed</text>
      <rect x="85" y="175" width="80" height="22" rx="6" fill="#27c93f" opacity="0.25" />
      <text x="95" y="191" fill="#27c93f" fontFamily="monospace" fontSize="12" fontWeight="bold">ACCEPTED</text>
    </svg>
  ),
  "automl-pipeline": (
    <svg viewBox="0 0 360 280" width="100%" height="100%" aria-hidden="true">
      {/* Pipeline flow */}
      <rect x="50" y="120" width="55" height="40" rx="8" fill="var(--sky)" />
      <rect x="135" y="105" width="55" height="70" rx="8" fill="var(--lavender)" />
      <rect x="220" y="90" width="55" height="100" rx="8" fill="var(--primary-soft)" />
      {/* Flow arrows */}
      <path d="M110 140 L130 140" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
      <path d="M195 140 L215 140" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="300" cy="140" r="18" fill="var(--primary)" />
      <path d="M294 140 l4 4 l8 -8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  ),
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
  image,
  onOpen,
}: {
  pid: ProjectId;
  image?: string;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { visible } = useInViewMargin(ref);
  // Stable registry id — must match CanvasRoot's VIEW_ORDER selector.
  const id = `project-${pid}`;
  useViewRegistration(id, ref, visible);
  // Pointer relative to THIS rect, read by the project mini-scene in useFrame.
  useSlotPointer(id, ref);

  return (
    <div
      ref={ref}
      data-view={`project-${pid}`}
      className="view-slot card-soft overflow-hidden cursor-pointer relative group"
      style={{ aspectRatio: "360 / 280" }}
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
      <div className="view-fallback w-full h-full flex items-center justify-center bg-[var(--surface-2)]">
        {image ? (
          <Image
            src={image}
            alt={`${pid} preview`}
            width={360}
            height={280}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          FALLBACKS[pid]
        )}
      </div>
    </div>
  );
}
