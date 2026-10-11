import type { ReactNode } from "react";
import { cx } from "../../lib/ui";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Turns on the shared hover lift used by project and skill cards. */
  interactive?: boolean;
}

/** White surface, 1px #E4E4EA border, generous radius. */
export default function Card({ children, className, interactive = false }: CardProps) {
  return (
    <div
      className={cx(
        "card",
        interactive && "hover-lift",
        className,
      )}
    >
      {children}
    </div>
  );
}
