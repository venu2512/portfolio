"use client";

import { useEffect, type RefObject } from "react";
import { useSiteStore } from "./store";

/**
 * Registers/unregisters a 3D placeholder in the shared registry that
 * CanvasRoot's <View track={...}> elements read from. Registry ids embed the
 * slot kind (e.g. "hero", "project-certchain") as the last path segment.
 */
export default function useViewRegistration(
  id: string,
  ref: RefObject<HTMLElement | null>,
  visible: boolean
): void {
  const set = useSiteStore((s) => s.set);

  useEffect(() => {
    const next = new Set(useSiteStore.getState().visibleViews);
    next.add(id);
    set("visibleViews", next);
    return () => {
      const s = useSiteStore.getState();
      const n = new Set(s.visibleViews);
      n.delete(id);
      s.set("visibleViews", n);
    };
  }, [id, set]);

  useEffect(() => {
    const cur = useSiteStore.getState().visibleViews;
    if (visible === cur.has(id)) return;
    const next = new Set(cur);
    if (visible) next.add(id);
    else next.delete(id);
    set("visibleViews", next);
  }, [visible, id, set]);
}
