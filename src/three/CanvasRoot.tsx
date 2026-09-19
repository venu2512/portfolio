"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { View, PerformanceMonitor, PerspectiveCamera } from "@react-three/drei";
import { Suspense, lazy } from "react";
import * as THREE from "three";
import { useSiteStore } from "../lib/store";
import { tierTables } from "../lib/quality";
import Studio from "./Studio";

const LazyHero = lazy(() => import("./views/HeroMedallion"));
const LazyExperience = lazy(() => import("./views/ExperienceStage"));
const LazySkills = lazy(() => import("./views/KeycapCloud"));
const LazyProject = lazy(() => import("./views/ProjectMini"));
const LazyCta = lazy(() => import("./views/CtaShapes"));

function ViewBody({ children, camPos }: { children: React.ReactNode; camPos: [number, number, number] }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={camPos} fov={35} />
      <Studio />
      {children}
    </>
  );
}

/** Selector table: registry id -> DOM placeholder + scene. */
function useSlotElement(selector: string): HTMLElement | null {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    // Defer a frame so all placeholders are mounted before the canvas reads them.
    const raf = requestAnimationFrame(() => setEl(document.querySelector<HTMLElement>(selector)));
    return () => cancelAnimationFrame(raf);
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

function ProjectView({ pid }: { pid: "certchain" | "legal-ai" | "cloud-nova" }) {
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

function Views() {
  const visibleViews = useSiteStore((s) => s.visibleViews);
  const [version, setVersion] = useState(0);

  // Registry mutates the Set in place; re-render when its identity changes.
  useEffect(() => {
    return useSiteStore.subscribe((s, prev) => {
      if (s.visibleViews !== prev.visibleViews) setVersion((v) => v + 1);
    });
  }, []);
  void version;

  const has = (suffix: string) => {
    for (const id of visibleViews) {
      if (id.endsWith(suffix) || id.includes(suffix)) return true;
    }
    return false;
  };

  return (
    <>
      {has("hero") && <HeroView />}
      {has("experience") && <ExperienceView />}
      {has("skills") && <SkillsView />}
      {has("cta") && <CtaView />}
      {has("certchain") && <ProjectView pid="certchain" />}
      {has("legal-ai") && <ProjectView pid="legal-ai" />}
      {has("cloud-nova") && <ProjectView pid="cloud-nova" />}
    </>
  );
}

export default function CanvasRoot() {
  const [eventRoot, setEventRoot] = useState<HTMLElement | null>(null);
  const [runtimeStep, setRuntimeStep] = useState(0); // 0 = detected, -1 step down, etc.
  const detectedTier = useSiteStore((s) => s.detectedTier);
  const tierOverride = useSiteStore((s) => s.tierOverride);

  useEffect(() => {
    // Defer to a task so the effect isn't a synchronous setState.
    const id = window.setTimeout(() => setEventRoot(document.getElementById("app-root")), 0);
    return () => window.clearTimeout(id);
  }, []);

  const tier =
    tierOverride !== "auto"
      ? tierOverride
      : runtimeStep === 0
        ? detectedTier
        : runtimeStep < 0
          ? detectedTier === "high"
            ? "medium"
            : "low"
          : detectedTier;

  const tables = tierTables(tier);

  return (
    <Canvas
      eventSource={eventRoot ?? undefined}
      eventPrefix="client"
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 30 }}
      gl={{ alpha: true, antialias: tables.antialias, powerPreference: "high-performance" }}
      dpr={tables.dpr}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault();
            window.setTimeout(() => {
              useSiteStore.getState().set("webgl", "lost");
            }, 2000);
          },
          false
        );
      }}
    >
      <PerformanceMonitor
        onDecline={() => setRuntimeStep((s) => Math.max(-1, s - 1))}
        onIncline={() => setRuntimeStep((s) => Math.min(0, s + 1))}
        flipflops={3}
      />
      <Views />
    </Canvas>
  );
}
