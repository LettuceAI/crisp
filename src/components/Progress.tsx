import { cn } from "../lib/cn";

export interface ProgressProps {
  /** 0–100. Omit for indeterminate. */
  value?: number;
  size?: "sm" | "md";
  tone?: "accent" | "info" | "warning" | "danger";
  label?: string;
  className?: string;
}

const toneClass = { accent: "bg-accent", info: "bg-info", warning: "bg-warning", danger: "bg-danger" };

export function Progress({ value, size = "md", tone = "accent", label, className }: ProgressProps) {
  const indeterminate = value === undefined;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : Math.round(value)}
      className={cn("relative w-full overflow-hidden rounded-full bg-fill-3", size === "sm" ? "h-1" : "h-1.5", className)}
    >
      <div
        className={cn("h-full rounded-full transition-[width] motion-slow ease-out", toneClass[tone], indeterminate && "w-1/3 animate-[indeterminate_1.4s_ease-in-out_infinite]")}
        style={indeterminate ? undefined : { width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
