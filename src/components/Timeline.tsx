import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export type TimelineTone = "neutral" | "accent" | "info" | "warning" | "danger" | "secondary";

export interface TimelineItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  time?: ReactNode;
  icon?: ReactNode;
  tone?: TimelineTone;
  /** Still happening — the marker pulses. */
  active?: boolean;
}

const toneClass: Record<TimelineTone, string> = {
  neutral: "border-line-3 bg-fill-2 text-fg-3",
  accent: "border-accent/45 bg-accent/18 text-accent",
  info: "border-info/40 bg-info/15 text-info",
  warning: "border-warning/40 bg-warning/15 text-warning",
  danger: "border-danger/40 bg-danger/15 text-danger",
  secondary: "border-secondary/40 bg-secondary/15 text-secondary",
};

/** An ordered sequence of events: memory updates, sync stages, a generation's history. */
export function Timeline({ items, className }: { items: readonly TimelineItem[]; className?: string }) {
  return (
    <ol className={cn("relative", className)}>
      {items.map((item, index) => (
        <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
          {index < items.length - 1 && (
            <span aria-hidden="true" className="absolute left-3.5 top-8 h-[calc(100%-2rem)] w-px bg-line" />
          )}
          <span
            className={cn(
              "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
              toneClass[item.tone ?? "neutral"],
            )}
          >
            {item.active && (
              <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-current opacity-25 motion-reduce:hidden" />
            )}
            {item.icon ?? <span className="h-1.5 w-1.5 rounded-full bg-current" />}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="min-w-0 text-base font-medium text-fg">{item.title}</p>
              {item.time && <span className="shrink-0 text-2xs tabular-nums text-fg-3">{item.time}</span>}
            </div>
            {item.description && <p className="mt-0.5 text-sm text-fg-3">{item.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
