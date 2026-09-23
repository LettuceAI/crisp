import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type BadgeTone = "neutral" | "accent" | "danger" | "warning" | "info" | "secondary";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Leading status dot. */
  dot?: boolean;
}

const toneClass: Record<BadgeTone, string> = {
  neutral: "border-line-2 bg-fill-2 text-fg-2",
  accent: "border-accent/25 bg-accent/12 text-accent",
  danger: "border-danger/25 bg-danger/12 text-danger",
  warning: "border-warning/25 bg-warning/12 text-warning",
  info: "border-info/25 bg-info/12 text-info",
  secondary: "border-secondary/25 bg-secondary/12 text-secondary",
};

export function Badge({ tone = "neutral", dot, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium",
        toneClass[tone],
        className,
      )}
      {...rest}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}
