import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cx } from "../lib/ui";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger helper, in seconds. */
  delay?: number;
  /** Render as a list item when the child sits inside a <ul>. */
  as?: "div" | "li";
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Fade + rise 24px, once, when 15% of the element is in view.
 * Renders a plain element (no motion at all) under prefers-reduced-motion.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return as === "li" ? (
      <li className={cx(className)}>{children}</li>
    ) : (
      <div className={cx(className)}>{children}</div>
    );
  }

  if (as === "li") {
    return (
      <motion.li
        className={cx(className)}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, delay, ease: EASE }}
      >
        {children}
      </motion.li>
    );
  }

  return (
    <motion.div
      className={cx(className)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
