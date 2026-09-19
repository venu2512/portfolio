"use client";

import type { Tier } from "./store";

interface NavigatorConnection {
  saveData?: boolean;
}

export function detectTier(): Tier {
  if (typeof navigator === "undefined") return "medium";
  let score = 0;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (!coarse) score += 2;

  const cores = navigator.hardwareConcurrency ?? 0;
  if (cores >= 8) score += 2;
  else if (cores >= 4) score += 1;

  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 0;
  if (mem >= 8) score += 2;
  else if (mem >= 4) score += 1;

  const conn = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
  if (conn?.saveData) score = 0;

  return score >= 5 ? "high" : score >= 3 ? "medium" : "low";
}

export interface TierTables {
  dpr: [number, number];
  particles: number;
  bloom: boolean;
  antialias: boolean;
  lines: "full" | "hero-only" | "none";
}

export function tierTables(tier: Tier): TierTables {
  switch (tier) {
    case "high":
      return { dpr: [1, 2], particles: 4000, bloom: true, antialias: true, lines: "full" };
    case "medium":
      return { dpr: [1, 1.5], particles: 1800, bloom: false, antialias: true, lines: "full" };
    case "low":
      return { dpr: [1, 1], particles: 600, bloom: false, antialias: false, lines: "hero-only" };
  }
}
