"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "../content/data";
import Reveal from "./Reveal";
import ProjectSlot from "./three/ProjectSlot";
import type { ProjectId } from "./three/ProjectSlot";

type Project = (typeof projects)[number];

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
    <dialog ref={ref} className="project-dialog" aria-label={`${project.name} details`}
      onClose={() => {
        // Esc/`close()` path also returns focus (native close bypasses onClose prop).
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // backdrop click
      }}
    >
      <div className="p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-extrabold">{project.name}</h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>{project.subtitle}</p>
          </div>
          <button type="button" className="btn btn-ghost !min-h-0 !px-3 !py-1.5" onClick={onClose}>
            ✕
          </button>
        </div>
        <ul className="mt-4 space-y-2.5 text-[0.95rem] leading-relaxed">
          {project.bullets.map((b, i) => (
            <li key={i} className="flex gap-2.5">
              <span aria-hidden="true" style={{ color: "var(--primary)" }}>▸</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="chip chip-white">{s}</span>
          ))}
        </div>
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">
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
    <section id="projects" className="wrap section">
      <Reveal>
        <p className="mono-label">Projects</p>
        <h2 className="h2 mt-2">Selected work</h2>
      </Reveal>

      <div className="mt-8 flex flex-col gap-8">
        {projects.map((p, i) => (
          <Reveal key={p.id}>
            <div
              ref={(el) => {
                wrapRefs.current[i] = el;
              }}
              className="card p-6 md:p-8 tilt-card"
              onPointerMove={tilt(i)}
              onPointerLeave={untilt(i)}
            >
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <ProjectSlot pid={p.id as ProjectId} onOpen={() => openProject(i)} />
                <div>
                  <h3 className="text-2xl font-extrabold">{p.name}</h3>
                  <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>{p.subtitle}</p>
                  <ul className="mt-4 space-y-2 text-[0.95rem] leading-relaxed">
                    {p.bullets.slice(0, 2).map((b, bi) => (
                      <li key={bi} className="flex gap-2.5">
                        <span aria-hidden="true" style={{ color: "var(--primary)" }}>▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <span key={s} className="chip chip-white">{s}</span>
                    ))}
                  </div>
                  <button type="button" className="btn btn-secondary mt-6" onClick={() => openProject(i)}>
                    View details
                  </button>
                </div>
              </div>
              <ProjectDialog project={p} open={openIdx === i} onClose={closeProject} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
