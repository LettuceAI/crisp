import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface MeterProps {
  value: number;
  max?: number;
  label?: ReactNode;
  /** Right of the label — "12.4k / 128k". */
  valueLabel?: ReactNode;
  /** Fractions where the bar changes tone. Default warns at 0.75, alarms at 0.9. */
  thresholds?: { warning: number; danger: number };
  size?: "sm" | "md";
  className?: string;
}

/**
 * A budget you are spending: context window, token allowance, disk quota.
 * Progress says "how far along"; a Meter says "how much is left" and turns as it fills.
 */
export function Meter({
  value, max = 100, label, valueLabel, thresholds = { warning: 0.75, danger: 0.9 }, size = "md", className,
}: MeterProps) {
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const tone = ratio >= thresholds.danger ? "danger" : ratio >= thresholds.warning ? "warning" : "accent";
  const bar = { accent: "bg-fg-3", warning: "bg-warning", danger: "bg-danger" }[tone];
  const text = { accent: "text-fg-2", warning: "text-warning", danger: "text-danger" }[tone];

  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || valueLabel) && (
        <div className="flex items-baseline justify-between gap-3">
          {label && <span className="min-w-0 truncate text-sm text-fg-3">{label}</span>}
          {valueLabel && <span className={cn("shrink-0 text-sm tabular-nums", text)}>{valueLabel}</span>}
        </div>
      )}
      <div
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={typeof label === "string" ? label : undefined}
        className={cn("w-full overflow-hidden rounded-full bg-fill-3", size === "sm" ? "h-1" : "h-1.5")}
      >
        <div className={cn("h-full rounded-full transition-[width,background-color] motion-slow", bar)} style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  );
}
