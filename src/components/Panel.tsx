import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export type PanelTone = "neutral" | "subtle" | "accent" | "info" | "warning" | "danger" | "secondary";

export interface PanelProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  tone?: PanelTone;
  /** Right of the title — a switch, a badge, a link. */
  action?: ReactNode;
  /** Raise contrast for use over a photo or gradient. */
  onSurface?: boolean;
  children?: ReactNode;
}

const toneClass: Record<PanelTone, string> = {
  neutral: "border-line bg-surface-1",
  subtle: "border-line bg-surface-1/60",
  accent: "border-accent/30 bg-accent/8",
  info: "border-info/30 bg-info/8",
  warning: "border-warning/30 bg-warning/8",
  danger: "border-danger/30 bg-danger/8",
  secondary: "border-secondary/30 bg-secondary/8",
};

const titleTone: Record<PanelTone, string> = {
  neutral: "text-fg",
  subtle: "text-fg-2",
  accent: "text-accent",
  info: "text-info",
  warning: "text-warning",
  danger: "text-danger",
  secondary: "text-secondary",
};

/**
 * A titled container with a tone. Alert is a notice you read and dismiss; Panel is a
 * region you put things in — the chat widgets, a grouped set of settings, a callout
 * with controls inside.
 */
export function Panel({ title, description, tone = "neutral", action, onSurface, className, children, ...rest }: PanelProps) {
  return (
    <section
      className={cn("flex flex-col gap-2 rounded-xl border px-3.5 py-3", toneClass[tone], onSurface && "backdrop-blur-md", className)}
      {...rest}
    >
      {(title || description || action) && (
        <header className="flex items-start gap-2">
          <div className="min-w-0 flex-1 space-y-0.5">
            {title && <h3 className={cn("truncate text-base font-semibold", titleTone[tone])}>{title}</h3>}
            {description && <p className="text-sm leading-snug text-fg-3">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
