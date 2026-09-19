"use client";

import { create } from "zustand";

export type Tier = "high" | "medium" | "low";
export type TierOverride = Tier | "auto";
export type WebglStatus = "ok" | "unsupported" | "lost";

export interface SiteState {
  active: number;
  hoveredId: string | null;
  selectedId: string | null;
  tierOverride: TierOverride;
  runtimeTier: Tier; // adjusted by PerformanceMonitor while override is "auto"
  detectedTier: Tier; // one-time hardware detection, cap for auto adjustments
  reducedMotion: boolean;
  simpleView: boolean; // user toggle (persisted)
  forcedSimple: boolean; // computed: no WebGL / context lost / save-data+RM
  webgl: WebglStatus;
  set: <T extends keyof SiteState>(key: T, value: SiteState[T]) => void;
}

const TIER_ORDER: Tier[] = ["low", "medium", "high"];

export function tierValue(t: Tier): number {
  return TIER_ORDER.indexOf(t);
}

export function stepTier(t: Tier, dir: 1 | -1): Tier {
  const i = Math.min(TIER_ORDER.length - 1, Math.max(0, TIER_ORDER.indexOf(t) + dir));
  return TIER_ORDER[i] ?? t;
}

export function effectiveTier(
  override: TierOverride,
  runtime: Tier,
  detected: Tier,
  simple: boolean
): Tier {
  if (simple) return "low";
  if (override !== "auto") return override;
  return tierValue(runtime) < tierValue(detected) ? runtime : detected;
}

export const useSiteStore = create<SiteState>((set) => ({
  active: 0,
  hoveredId: null,
  selectedId: null,
  tierOverride: "auto",
  runtimeTier: "high",
  detectedTier: "high",
  reducedMotion: false,
  simpleView: false,
  forcedSimple: false,
  webgl: "ok",
  set: (key, value) => set({ [key]: value } as Partial<SiteState>),
}));
