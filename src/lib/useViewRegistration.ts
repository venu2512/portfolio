"use client";

import { useEffect, type RefObject } from "react";
import { useSiteStore } from "./store";

/**
 * Registers a 3D placeholder in the shared registry that CanvasRoot's Views
 * read from — only while its placeholder is within the visibility margin
 * (200px). Invisible slots are NOT in the registry, so the low/medium-tier
 * maxActiveViews cap always picks the views actually on screen. Registry ids
 * are stable slot kinds ("hero", "experience", "skills", "cta",
 * "project-<pid>") matching CanvasRoot's VIEW_ORDER.
 */
export default function useViewRegistration(
  id: string,
  ref: RefObject<HTMLElement | null>,
  visible: boolean
): void {
  const set = useSiteStore((s) => s.set);

  useEffect(() => {
    const cur = useSiteStore.getState().visibleViews;
    if (cur.has(id) === visible) return;
    const next = new Set(cur);
    if (visible) next.add(id);
    else next.delete(id);
    set("visibleViews", next);
  }, [visible, id, set]);
}
