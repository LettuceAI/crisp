import { Loader2 } from "lucide-react";
import { cn } from "../lib/cn";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  /** Announced to screen readers; omit only when a sibling already says what's loading. */
  label?: string;
  className?: string;
}

const sizeMap = { sm: 14, md: 18, lg: 24 };

/** The one spinner. `animate-spin` appears 302 times in the app; this replaces all of them. */
export function Spinner({ size = "md", label, className }: SpinnerProps) {
  return (
    <Loader2
      size={sizeMap[size]}
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("animate-spin text-fg-3", className)}
    />
  );
}

/** Centred spinner with a line of copy, for a panel that has nothing to show yet. */
export function LoadingState({ label = "Loading…", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 px-6 py-12", className)} role="status">
      <Spinner size="lg" />
      <p className="text-sm text-fg-3">{label}</p>
    </div>
  );
}
