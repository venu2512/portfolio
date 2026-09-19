"use client";

import { useEffect, useRef } from "react";
import { useInViewMargin } from "../../lib/hooks";
import useViewRegistration from "../../lib/useViewRegistration";
import { skills } from "../../content/data";
import { setSkillsFilter } from "../../three/filterMirror";

/**
 * Skills 3D slot. The static chip-grid fallback is always rendered beneath
 * (same filter highlighting as the 3D cloud); CanvasRoot toggles data-3d when
 * the 3D cloud actually mounts. On low tier the chip grid stays visible.
 */
export default function SkillsSlot({ filter }: { filter: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { visible } = useInViewMargin(ref);
  // Stable registry id — must match CanvasRoot's VIEW_ORDER selector.
  const id = "skills";
  useViewRegistration(id, ref, visible);

  // Current filter is pushed to the 3D cloud through a module-scope mirror
  // (kept out of render per React Compiler rules).
  useEffect(() => {
    setSkillsFilter(filter);
  }, [filter]);

  const ALL = skills.flatMap((s) => s.items.map((i) => ({ item: i, color: s.color, cat: s.id })));

  return (
    <div
      ref={ref}
      data-view="skills"
      className="view-slot card overflow-hidden"
      style={{ aspectRatio: "16 / 9" }}
    >
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
    </div>
  );
}
