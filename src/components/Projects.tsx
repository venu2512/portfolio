"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { projects } from "../content/data";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import ProjectSlot from "./three/ProjectSlot";
import type { ProjectId } from "./three/ProjectSlot";

type Project = (typeof projects)[number];

/**
 * Bento arrangement: two equal tiles on row 1, one full-width tile on row 2.
 *
 * Every tile has the SAME internal structure — slot → title → outcome lines →
 * stack → action — so the row heights line up instead of one tile stretching to
 * cover a 2×2 span. The wide tile only changes its inner split (slot beside the
 * copy), which is the one place a full-width row can carry a two-column read.
 */
const TILE = [
  "tile tile-navy",
  "tile tile-lavender",
  "tile tile-sky",
  "tile tile-cream",
  "tile tile-blush",
  "tile tile-soft",
];
function chipClass(i: number) {
  return i % TILE.length === 0 ? "chip chip-on-navy" : "chip chip-white";
}

function ProjectDialog({
  project,
  open,
  onClose,
}: {
  project: Project;
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="project-dialog !p-0 overflow-hidden"
      aria-label={`${project.name} details`}
      onClose={() => {
        // Esc/`close()` path also returns focus (native close bypasses onClose prop).
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // backdrop click
      }}
    >
      {"image" in project && project.image && (
        <div className="w-full aspect-[16/9] max-h-56 overflow-hidden border-b border-[var(--line)] bg-[var(--surface-2)]">
          <Image
            src={project.image}
            alt={project.name}
            width={720}
            height={405}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-extrabold">{project.name}</h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {project.subtitle}
            </p>
          </div>
          <button type="button" className="btn btn-ghost !min-h-0 !px-3 !py-1.5" onClick={onClose}>
            ✕
          </button>
        </div>
        <ul className="mt-4 space-y-2.5 text-[0.95rem] leading-relaxed">
          {project.bullets.map((b, i) => (
            <li key={i} className="flex gap-2.5">
              <span aria-hidden="true" style={{ color: "var(--muted)" }}>
                ▸
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="chip chip-white">
              {s}
            </span>
          ))}
        </div>
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-6"
          >
            View repository
          </a>
        )}
      </div>
    </dialog>
  );
}

export default function Projects() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const wrapRefs = useRef<Array<HTMLDivElement | null>>([]);
  const lastOpener = useRef<HTMLElement | null>(null);

  // Focus returns to the opener on close; page scroll locks while open (§9).
  const openProject = (i: number) => {
    lastOpener.current = document.activeElement as HTMLElement | null;
    setOpenIdx(i);
  };
  const closeProject = () => {
    setOpenIdx(null);
    lastOpener.current?.focus();
  };
  // Narrowed lookup so strict indexed access stays happy.
  const activeProject = openIdx === null ? undefined : projects[openIdx];

  useEffect(() => {
    if (openIdx === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openIdx]);

  const tilt = (i: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrapRefs.current[i];
    if (!el) return;
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
  };
  const untilt = (i: number) => () => {
    const el = wrapRefs.current[i];
    if (el) el.style.transform = "";
  };

  return (
    <section id="projects" className="band" aria-labelledby="projects-heading">
      <div className="wrap">
        <SectionHead
          id="projects"
          eyebrow="Projects"
          title={
            <>
              Selected <em className="accent">work</em>
            </>
          }
          lead="Featured builds and platforms with live repositories. Open a tile for the details."
        />

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {projects.map((p, i) => {
            const wide = projects.length % 2 !== 0 && i === projects.length - 1;
            const bullets = wide ? 3 : 2;
            return (
              <Reveal
                key={p.id}
                delay={i * 80}
                className={`h-full ${wide ? "md:col-span-2" : ""}`}
              >
                <div
                  ref={(el) => {
                    wrapRefs.current[i] = el;
                  }}
                  className={`${TILE[i % TILE.length]} tilt-card h-full flex flex-col !p-6 md:!p-7 ${
                    wide ? "md:grid md:grid-cols-2 md:gap-8 md:items-center" : ""
                  }`}
                  onPointerMove={tilt(i)}
                  onPointerLeave={untilt(i)}
                >
                  <span className="tile-index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className={wide ? "" : "w-full max-w-[22rem]"}>
                    <ProjectSlot
                      pid={p.id as ProjectId}
                      image={"image" in p ? p.image : undefined}
                      onOpen={() => openProject(i)}
                    />
                  </div>

                  <div className={`flex flex-col ${wide ? "" : "flex-1 mt-6"}`}>
                    <div>
                      <h3 className="text-xl md:text-2xl font-extrabold">{p.name}</h3>
                      <p className="text-sm mt-0.5 tile-sub">{p.subtitle}</p>
                    </div>
                    <ul className="mt-4 space-y-2 text-[0.95rem] leading-relaxed">
                      {p.bullets.slice(0, bullets).map((b, bi) => (
                        <li key={bi} className="flex gap-2.5">
                          <span aria-hidden="true" style={{ color: "var(--primary)" }}>
                            ▸
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <span key={s} className={chipClass(i)}>
                          {s}
                        </span>
                      ))}
                    </div>
                    {/* mt-auto keeps every action on the tile's baseline whatever
                        the bullet count is, so the row reads as one board. */}
                    <div className={`${wide ? "mt-6" : "mt-auto pt-6"}`}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => openProject(i)}
                      >
                        View details
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Mounted only while open: the native <dialog> takes focus into the top
          layer, Esc closes it, and unmount returns focus to the tile button. */}
      {activeProject ? (
        <ProjectDialog project={activeProject} open onClose={closeProject} />
      ) : null}
    </section>
  );
}
