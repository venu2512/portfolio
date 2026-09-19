"use client";

import { create } from "zustand";

export type Tier = "high" | "medium" | "low";
export type TierOverride = Tier | "auto";
export type WebglStatus = "ok" | "unsupported" | "lost";

export interface SiteState {
  theme: "light" | "dark";
  visibleViews: Set<string>;
  flashBullet: { expId: string; index: number } | null;
  tierOverride: TierOverride;
  runtimeTier: Tier;
  detectedTier: Tier;
  reducedMotion: boolean;
  simpleView: boolean;
  forcedSimple: boolean;
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

export function effectiveTier(override: TierOverride, runtime: Tier, detected: Tier, simple: boolean): Tier {
  if (simple) return "low";
  if (override !== "auto") return override;
  return tierValue(runtime) < tierValue(detected) ? runtime : detected;
}

export const useSiteStore = create<SiteState>((set) => ({
  theme: "light",
  visibleViews: new Set<string>(),
  flashBullet: null,
  tierOverride: "auto",
  runtimeTier: "high",
  detectedTier: "high",
  reducedMotion: false,
  simpleView: false,
  forcedSimple: false,
  webgl: "ok",
  set: (key, value) => set({ [key]: value } as Partial<SiteState>),
}));
