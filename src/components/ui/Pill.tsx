import type { ReactNode } from "react";
import { cx, resolveColor } from "../../lib/ui";

interface PillProps {
  children: ReactNode;
  /** CSS colour for the leading dot, or "accent" for the theme accent. */
  dot?: string;
  className?: string;
  /** Set false when the pill sits on a dark surface. */
  bordered?: boolean;
}

/** Status pill and small labels. White by default, 1px line, 14px / 600. */
export default function Pill({
  children,
  dot,
  className,
  bordered = true,
}: PillProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-pill bg-card px-[14px] py-2 text-sm font-semibold leading-none text-ink",
        bordered && "border border-line",
        className,
      )}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: resolveColor(dot) }}
        />
      ) : null}
      {children}
    </span>
  );
}
