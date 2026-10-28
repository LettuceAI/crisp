import { cn } from "../lib/cn";

type ScaleTone = "accent" | "neutral" | "warning" | "danger";

const fill: Record<ScaleTone, string> = {
  accent: "bg-accent",
  neutral: "bg-fg-3",
  warning: "bg-warning",
  danger: "bg-danger",
};

export interface ScaleProps {
  value: number;
  /** A negative minimum makes the scale two-sided: the bar fills from the centre zero toward the value. */
  min?: number;
  max?: number;
  /** A point to compare against, such as a default or a target, drawn as a small mark on the track. */
  reference?: number;
  /** Names the reference mark for assistive technology and the hover title. */
  referenceLabel?: string;
  tone?: ScaleTone;
  /** The fill below zero on a two-sided scale. */
  negativeTone?: ScaleTone;
  size?: "sm" | "md";
  label: string;
  className?: string;
}

/**
 * A reading on a fixed scale: a level, a mood, a score. It fills from zero, and from the
 * centre when the scale runs from negative to positive, with an optional reference mark.
 * Progress is for how far along something is; Meter is for a budget being spent.
 */
export function Scale({
  value, min = 0, max = 1, reference, referenceLabel, tone = "accent", negativeTone = "danger", size = "sm", label, className,
}: ScaleProps) {
  const span = max - min || 1;
  const at = (x: number) => (Math.min(max, Math.max(min, x)) - min) / span;
  const zero = min < 0 && max > 0 ? at(0) : 0;
  const point = at(value);
  const start = Math.min(zero, point);
  const width = Math.abs(point - zero);
  const negative = min < 0 && value < 0;

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-description={reference !== undefined && referenceLabel ? `${referenceLabel}: ${reference}` : undefined}
      className={cn("relative w-full rounded-full bg-fill-3", size === "sm" ? "h-1" : "h-1.5", className)}
    >
      {zero > 0 && <span aria-hidden className="absolute top-1/2 h-2.5 w-px -translate-x-1/2 -translate-y-1/2 bg-fg-4" style={{ left: `${zero * 100}%` }} />}
      <span
        aria-hidden
        className={cn("absolute inset-y-0 rounded-full transition-[left,width] motion-slow", fill[negative ? negativeTone : tone])}
        style={{ left: `${start * 100}%`, width: `${width * 100}%` }}
      />
      {reference !== undefined && (
        <span
          aria-hidden
          title={referenceLabel}
          className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface-1 bg-fg-3"
          style={{ left: `${at(reference) * 100}%` }}
        />
      )}
    </div>
  );
}
