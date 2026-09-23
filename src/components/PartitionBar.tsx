import { useId, type ReactNode } from "react";
import { cn } from "../lib/cn";

export type PartitionTone = "accent" | "info" | "secondary" | "warning" | "danger" | "neutral";

export interface Partition {
  id: string;
  label: ReactNode;
  value: number;
  /** A semantic tone, or any CSS colour when the segment stands for something with its own. */
  tone?: PartitionTone;
  color?: string;
}

export interface PartitionBarProps {
  segments: readonly Partition[];
  /** Denominator. Defaults to the sum, making the bar a share-of-total. */
  total?: number;
  /** Format each value — bytes, tokens, a currency. Percentages by default. */
  format?: (value: number, share: number) => string;
  /** `below` labels each segment under the bar; `legend` wraps them into rows. */
  labels?: "below" | "legend" | "none";
  /**
   * Under this share, a label is narrower than its own word. `below` falls back to
   * `legend` for the whole row rather than truncating some labels and not others.
   */
  minLabelShare?: number;
  size?: "sm" | "md" | "lg";
  /** Leave the unused remainder visible as an empty track. */
  showRemainder?: boolean;
  "aria-label"?: string;
  className?: string;
}

const toneVar: Record<PartitionTone, string> = {
  accent: "var(--color-accent)",
  info: "var(--color-info)",
  secondary: "var(--color-secondary)",
  warning: "var(--color-warning)",
  danger: "var(--color-danger)",
  neutral: "var(--color-fg-3)",
};

const height = { sm: "h-1.5", md: "h-2.5", lg: "h-3.5" };

/**
 * A bar split into named parts: where storage went, which providers answered, how a
 * context window is spent. Progress answers "how far"; a Meter answers "how much is
 * left"; this answers "of what it is made".
 *
 * Segments are separated by a real gap rather than a border, so two adjacent colours
 * never read as one — and each keeps its own rounded ends, which is what makes the
 * parts legible at 6px tall.
 */
export function PartitionBar({
  segments, total, format, labels = "below", minLabelShare = 0.12, size = "md", showRemainder, className, ...aria
}: PartitionBarProps) {
  const id = useId();
  const sum = segments.reduce((acc, s) => acc + Math.max(0, s.value), 0);
  const denominator = total ?? sum;
  const share = (value: number) => (denominator > 0 ? Math.max(0, value) / denominator : 0);
  const remainder = Math.max(0, denominator - sum);

  /* One truncated label among readable ones looks like a bug; the whole row moving to a
     legend looks like a decision. */
  const tooNarrow = segments.some((s) => share(s.value) > 0 && share(s.value) < minLabelShare);
  const resolvedLabels = labels === "below" && tooNarrow ? "legend" : labels;

  const text = (segment: Partition) =>
    format ? format(segment.value, share(segment.value)) : `${Math.round(share(segment.value) * 100)}%`;

  const colourOf = (segment: Partition) => segment.color ?? toneVar[segment.tone ?? "neutral"];

  return (
    <div className={cn("w-full", className)}>
      <div
        role="img"
        aria-label={
          aria["aria-label"] ??
          segments.map((s) => `${typeof s.label === "string" ? s.label : s.id} ${text(s)}`).join(", ")
        }
        className={cn("flex w-full items-stretch gap-1", height[size])}
      >
        {segments.map((segment) => {
          const fraction = share(segment.value);
          if (fraction <= 0) return null;
          return (
            <div
              key={segment.id}
              className="min-w-1 rounded-full"
              style={{ flexGrow: fraction, flexBasis: 0, background: colourOf(segment) }}
            />
          );
        })}
        {showRemainder && remainder > 0 && (
          <div className="min-w-1 rounded-full bg-fill-3" style={{ flexGrow: share(remainder), flexBasis: 0 }} />
        )}
      </div>

      {resolvedLabels === "below" && (
        <div className="mt-2 flex w-full gap-1">
          {segments.map((segment) => {
            const fraction = share(segment.value);
            if (fraction <= 0) return null;
            return (
              <div key={`${id}-${segment.id}`} className="min-w-0 text-center" style={{ flexGrow: fraction, flexBasis: 0 }}>
                <p className="truncate text-sm font-medium" style={{ color: colourOf(segment) }}>
                  {segment.label}
                </p>
                <p className="truncate text-2xs tabular-nums text-fg-3">{text(segment)}</p>
              </div>
            );
          })}
          {showRemainder && remainder > 0 && (
            <div className="min-w-0 text-center" style={{ flexGrow: share(remainder), flexBasis: 0 }}>
              <p className="truncate text-sm font-medium text-fg-3">Free</p>
              <p className="truncate text-2xs tabular-nums text-fg-3">{format ? format(remainder, share(remainder)) : `${Math.round(share(remainder) * 100)}%`}</p>
            </div>
          )}
        </div>
      )}

      {resolvedLabels === "legend" && (
        <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
          {segments.map((segment) => (
            <li key={`${id}-${segment.id}`} className="flex min-w-0 items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: colourOf(segment) }} />
              <span className="truncate text-sm text-fg-2">{segment.label}</span>
              <span className="shrink-0 text-sm tabular-nums text-fg-3">{text(segment)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
