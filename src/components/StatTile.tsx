import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface StatTileProps {
  label: ReactNode;
  value: ReactNode;
  /** A line under the value — the comparison, the unit, the period. */
  sub?: ReactNode;
  /** Percentage change. `up` is not automatically good; pass `goodDirection`. */
  trend?: { value: number; direction: "up" | "down" };
  /** Which direction should read as positive. Default "up". */
  goodDirection?: "up" | "down";
  icon?: ReactNode;
  highlight?: boolean;
  className?: string;
}

/**
 * One number with its label. Usage stats, model details, memory counts.
 * The label is sentence case, not tracked-out uppercase — a stat tile is read, not scanned.
 */
export function StatTile({ label, value, sub, trend, goodDirection = "up", icon, highlight, className }: StatTileProps) {
  const good = trend ? trend.direction === goodDirection : undefined;
  return (
    <div
      className={cn(
        "rounded-xl border px-3.5 py-3",
        highlight ? "border-accent/30 bg-accent/8" : "border-line bg-surface-1",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 text-sm text-fg-3">
          {icon && <span className="shrink-0">{icon}</span>}
          <span className="truncate">{label}</span>
        </span>
        {trend && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums",
              good ? "bg-accent/12 text-accent" : "bg-danger/12 text-danger",
            )}
          >
            {trend.direction === "up" ? "+" : "−"}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="mt-1 truncate text-2xl font-semibold tabular-nums text-fg">
        {value}
      </p>
      {sub && <p className="mt-0.5 truncate text-sm text-fg-3">{sub}</p>}
    </div>
  );
}

export interface KeyValueProps {
  items: readonly { label: ReactNode; value: ReactNode }[];
  /** `rows` stacks label over value on narrow; `inline` keeps them on one line. */
  layout?: "inline" | "rows";
  className?: string;
}

/** Detail lists — model metadata, image properties, request info. */
export function KeyValue({ items, layout = "inline", className }: KeyValueProps) {
  return (
    <dl className={cn("divide-y divide-line", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn("py-2", layout === "inline" ? "flex items-baseline justify-between gap-4" : "space-y-0.5")}
        >
          <dt className="shrink-0 text-sm text-fg-3">{item.label}</dt>
          <dd className={cn("min-w-0 text-base text-fg", layout === "inline" && "truncate text-right")}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
