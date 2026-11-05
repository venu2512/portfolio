"use client";

/**
 * Shared fixed canvas (z 30, pointer-events none) that renders drei <View>s
 * tracked to DOM placeholders (`[data-view="…"]`), per the migration spec §5:
 *
 * - One Canvas, many views: every 3D slot is a plain <div> placeholder in the
 *   page; the canvas draws each <View> exactly into its rect via
 *   `<View.Port />` (rendered once below — without it nothing ever draws).
 * - Pointer events: the canvas is an inert overlay; R3F raycasting routes
 *   through `eventSource=#app-root` (the page wrapper), so hover/click reach
 *   the 3D objects while page scroll keeps working (touch-action: pan-y).
 * - Registry: slots register stable ids ("hero", "experience", "skills",
 *   "cta", "project-<pid>") + visibility in the store; only visible views are
 *   mounted, capped at tierTables(tier).maxActiveViews (low tier = hero only).
 * - Tier: drei <PerformanceMonitor> steps down on decline; after 3 flip-flops
 *   it locks to the lower tier for the rest of the session (onFallback) —
 *   adaptation pauses instead of being disabled entirely.
 * - Hidden tab: frameloop="never" while document.hidden.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { View, PerformanceMonitor, PerspectiveCamera } from "@react-three/drei";
import { Suspense, lazy, createElement, type ReactElement } from "react";
import * as THREE from "three";
import { useSiteStore, type Tier } from "../lib/store";
import { tierTables } from "../lib/quality";
import Studio from "./Studio";

const LazyHero = lazy(() => import("./views/HeroMedallion"));
const LazyExperience = lazy(() => import("./views/ExperienceStage"));
const LazySkills = lazy(() => import("./views/KeycapCloud"));
const LazyProject = lazy(() => import("./views/ProjectMini"));
const LazyCta = lazy(() => import("./views/CtaShapes"));

/** Per-view camera + studio lighting (each View brings its own). */
function ViewBody({ children, camPos }: { children: React.ReactNode; camPos: [number, number, number] }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={camPos} fov={35} />
      <Studio />
      {children}
    </>
  );
}

/**
 * Finds the DOM placeholder for a view (mounted before the canvas reads it)
 * and owns its `data-3d` attribute: "on" while this view is actually mounted
 * (hiding the DOM fallback via CSS), "off" on unmount. Slots never manage the
 * attribute themselves — under tier capping a visible slot may have no live
 * view, and its fallback must stay showing.
 */
function useSlotElement(selector: string): HTMLElement | null {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    // Defer a frame so all placeholders are mounted before the canvas reads them.
    const raf = requestAnimationFrame(() => {
      const found = document.querySelector<HTMLElement>(selector);
      if (found) found.setAttribute("data-3d", "on");
      setEl(found);
    });
    return () => {
      cancelAnimationFrame(raf);
      setEl((current) => {
        current?.setAttribute("data-3d", "off");
        return current;
      });
    };
  }, [selector]);
  return el;
}

function HeroView() {
  const el = useSlotElement('[data-view="hero"]');
  if (!el) return null;
  return (
    <View track={el as unknown as React.RefObject<HTMLElement>}>
      <ViewBody camPos={[0, 0, 6]}>
        <Suspense fallback={null}>
          <LazyHero />
        </Suspense>
      </ViewBody>
    </View>
  );
}

function ExperienceView() {
  const el = useSlotElement('[data-view="experience"]');
  if (!el) return null;
  return (
    <View track={el as unknown as React.RefObject<HTMLElement>}>
      <ViewBody camPos={[0, 0, 6]}>
        <Suspense fallback={null}>
          <LazyExperience />
        </Suspense>
      </ViewBody>
    </View>
  );
}

function SkillsView() {
  const el = useSlotElement('[data-view="skills"]');
  if (!el) return null;
  return (
    <View track={el as unknown as React.RefObject<HTMLElement>}>
      <ViewBody camPos={[0, 0, 8]}>
        <Suspense fallback={null}>
          <LazySkills />
        </Suspense>
      </ViewBody>
    </View>
  );
}

function ProjectView({
  pid,
}: {
  pid:
    | "ai-college"
    | "ebook-studio"
    | "code-judge"
    | "automl-pipeline"
    | "certchain"
    | "legal-ai"
    | "cloud-nova";
}) {
  const el = useSlotElement(`[data-view="project-${pid}"]`);
  if (!el) return null;
  return (
    <View track={el as unknown as React.RefObject<HTMLElement>}>
      <ViewBody camPos={[0, 0, 4.6]}>
        <Suspense fallback={null}>
          <LazyProject pid={pid} />
        </Suspense>
      </ViewBody>
    </View>
  );
}

function CtaView() {
  const el = useSlotElement('[data-view="cta"]');
  if (!el) return null;
  return (
    <View track={el as unknown as React.RefObject<HTMLElement>}>
      <ViewBody camPos={[0, 0, 5]}>
        <Suspense fallback={null}>
          <LazyCta />
        </Suspense>
      </ViewBody>
    </View>
  );
}

/** Stable view ids in priority order (hero first → wins the low-tier slot). */
const VIEW_ORDER = [
  "hero",
  "experience",
  "skills",
  "cta",
  "project-ai-college",
  "project-ebook-studio",
  "project-code-judge",
  "project-automl-pipeline",
  "project-legal-ai",
  "project-cloud-nova",
  "project-certchain",
] as const;

const VIEW_COMPONENTS: Record<(typeof VIEW_ORDER)[number], () => ReactElement | null> = {
  hero: HeroView,
  experience: ExperienceView,
  skills: SkillsView,
  cta: CtaView,
  "project-ai-college": () => <ProjectView pid="ai-college" />,
  "project-ebook-studio": () => <ProjectView pid="ebook-studio" />,
  "project-code-judge": () => <ProjectView pid="code-judge" />,
  "project-automl-pipeline": () => <ProjectView pid="automl-pipeline" />,
  "project-legal-ai": () => <ProjectView pid="legal-ai" />,
  "project-cloud-nova": () => <ProjectView pid="cloud-nova" />,
  "project-certchain": () => <ProjectView pid="certchain" />,
};

/**
 * Mounts only the currently-visible registered views, capped at
 * maxActiveViews (high = all, medium = 2, low = hero only). Off-screen views
 * never mount, so they do zero useFrame work.
 */
function Views({ maxActiveViews }: { maxActiveViews: number }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => {
      const next = [...useSiteStore.getState().visibleViews];
      setIds((prev) =>
        prev.length === next.length && prev.every((v, i) => prev[i] === next[i]) ? prev : next
      );
    };
    sync();
    return useSiteStore.subscribe(sync);
  }, []);

  const active = VIEW_ORDER.filter((id) => ids.includes(id)).slice(0, maxActiveViews);

  return (
    <>
      <View.Port />
      {active.map((id) => {
        const Cmp = VIEW_COMPONENTS[id];
        return Cmp ? createElement(Cmp, { key: id }) : null;
      })}
    </>
  );
}

export default function CanvasRoot() {
  const [eventRoot, setEventRoot] = useState<HTMLElement | null>(null);
  const detectedTier = useSiteStore((s) => s.detectedTier);
  const tierOverride = useSiteStore((s) => s.tierOverride);
  const runtimeStepRef = useRef(0);
  const [runtimeStep, setRuntimeStep] = useState(0); // 0 = detected, <0 = stepped down
  const [locked, setLocked] = useState(false); // flip-flop fallback: lower tier for the session
  const [hidden, setHidden] = useState(false);

  // #app-root wraps the whole page (page.tsx) so R3F pointer coordinates map
  // to real page geometry; a zero-size wrapper would deaden all 3D events.
  useEffect(() => {
    const id = window.setTimeout(() => setEventRoot(document.getElementById("app-root")), 0);
    return () => window.clearTimeout(id);
  }, []);

  // Pause the frameloop entirely while the tab is hidden.
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const tier: Tier = useMemo(() => {
    if (tierOverride !== "auto") return tierOverride;
    if (locked) return detectedTier === "high" ? "medium" : "low";
    if (runtimeStep < 0) return detectedTier === "high" ? "medium" : "low";
    return detectedTier;
  }, [tierOverride, locked, runtimeStep, detectedTier]);

  const tables = tierTables(tier);

  return (
    <Canvas
      eventSource={eventRoot ?? undefined}
      eventPrefix="client"
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 30 }}
      gl={{ alpha: true, antialias: tables.antialias, powerPreference: "high-performance" }}
      dpr={tables.dpr}
      frameloop={hidden ? "never" : "always"}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        // Context loss → simple mode after the 2 s restore grace.
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault();
            window.setTimeout(() => {
              if (!useSiteStore.getState().reducedMotion) {
                useSiteStore.getState().set("webgl", "lost");
              }
            }, 2000);
          },
          false
        );
      }}
    >
      <PerformanceMonitor
        onDecline={() => {
          runtimeStepRef.current -= 1;
          setRuntimeStep(runtimeStepRef.current);
        }}
        onIncline={() => {
          if (locked) return;
          runtimeStepRef.current = Math.min(0, runtimeStepRef.current + 1);
          setRuntimeStep(runtimeStepRef.current);
        }}
        // After 3 flip-flops, stop adapting and lock to the lower tier for the
        // session (rather than disabling adaptation at the current tier).
        flipflops={3}
        onFallback={() => setLocked(true)}
      />
      <Views maxActiveViews={tables.maxActiveViews} />
    </Canvas>
  );
}
