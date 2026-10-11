import type { ReactNode } from "react";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function resolveColor(color: string): string {
  return color === "accent" ? "var(--accent)" : color;
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export type { ReactNode };
