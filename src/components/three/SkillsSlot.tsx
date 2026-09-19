"use client";

import { useEffect, useRef } from "react";
import { useInViewMargin } from "../../lib/hooks";
import { useSiteStore } from "../../lib/store";
import useViewRegistration from "../../lib/useViewRegistration";
import { skills } from "../../content/data";
import { setSkillsFilter } from "../../three/filterMirror";

export default function SkillsSlot({ filter }: { filter: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { visible } = useInViewMargin(ref);
  // Stable registry id — must match CanvasRoot's VIEW_ORDER selector.
  const id = "skills";
  const webgl = useSiteStore((s) => s.webgl);
  const simpleView = useSiteStore((s) => s.simpleView);
  useViewRegistration(id, ref, visible);

  // Current filter is pushed to the 3D cloud through a module-scope mirror
  // (kept out of render per React Compiler rules).
  useEffect(() => {
    setSkillsFilter(filter);
  }, [filter]);

  const canvasLive = webgl === "ok" && !simpleView;
  const ALL = skills.flatMap((s) => s.items.map((i) => ({ item: i, color: s.color, cat: s.id })));

  return (
    <div
      ref={ref}
      data-view="skills"
      className="view-slot card overflow-hidden"
      style={{ aspectRatio: "16 / 9" }}
      data-3d={canvasLive ? "on" : "off"}
    >
      {!canvasLive && (
        <div className="view-fallback p-8 flex flex-wrap content-center justify-center gap-2">
          {ALL.map(({ item, color, cat }) => (
            <span
              key={item}
              className={`chip chip-${color}`}
              style={{ opacity: filter === "all" || filter === cat ? 1 : 0.35 }}
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
