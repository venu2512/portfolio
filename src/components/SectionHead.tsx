import type { ReactNode } from "react";
import Reveal from "./Reveal";

/**
 * One section head for the whole page: a meta row (mono eyebrow + permalink) →
 * display headline → optional lead.
 *
 * The permalink deliberately sits OUTSIDE the <h2>: appended inline it read as
 * "Selected work #" and it corrupted the heading's accessible name (the anchor's
 * aria-label became part of the heading). On the eyebrow row it reads as
 * metadata — the same job the reference gives its mono labels (teardown §8).
 */
export default function SectionHead({
  id,
  eyebrow,
  title,
  lead,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <Reveal>
      <div className="section-head">
        <div className="section-meta">
          <p className="mono-label">{eyebrow}</p>
          <a
            href={`#${id}`}
            className="section-anchor"
            aria-label={`Permalink to the ${eyebrow} section`}
          >
            #{id}
          </a>
        </div>
        <h2 id={`${id}-heading`} className="h2 mt-2">
          {title}
        </h2>
        {lead ? <p className="section-lead mt-3">{lead}</p> : null}
      </div>
    </Reveal>
  );
}
