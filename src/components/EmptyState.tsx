import type { ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { cn } from "../lib/cn";
import { icon } from "../lib/icon";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  /** Say what would put something here. */
  description?: ReactNode;
  action?: ReactNode;
  /** Compact variant for inside cards and sheets. */
  size?: "sm" | "md";
  className?: string;
}

/** An empty screen is an invitation to act, not an apology. */
export function EmptyState({ icon, title, description, action, size = "md", className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center text-center", size === "md" ? "px-6 py-14" : "px-4 py-8", className)}>
      {icon && (
        <div className={cn("mb-4 flex items-center justify-center rounded-2xl border border-line bg-fill text-fg-3", size === "md" ? "h-14 w-14" : "h-11 w-11")}>
          {icon}
        </div>
      )}
      <p className={cn("font-semibold text-fg", size === "md" ? "text-lg" : "text-base")}>{title}</p>
      {description && <p className={cn("mt-1 max-w-xs text-fg-3", size === "md" ? "text-base" : "text-sm")}>{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export interface ErrorStateProps {
  title?: ReactNode;
  /** What went wrong and, if it can be helped, what to do. Never an apology. */
  description?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  size?: "sm" | "md";
  className?: string;
}

/** Something failed to load. Says what, and offers the one thing that might fix it. */
export function ErrorState({ title = "Couldn't load this", description, onRetry, retryLabel = "Try again", size = "md", className }: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center text-center", size === "md" ? "px-6 py-14" : "px-4 py-8", className)}>
      <div className={cn("mb-4 flex items-center justify-center rounded-2xl border border-danger/25 bg-danger/10 text-danger", size === "md" ? "h-14 w-14" : "h-11 w-11")}>
        <AlertTriangle size={size === "md" ? icon.xl : icon.lg} />
      </div>
      <p className={cn("font-semibold text-fg", size === "md" ? "text-lg" : "text-base")}>{title}</p>
      {description && <p className={cn("mt-1 max-w-xs text-fg-3", size === "md" ? "text-base" : "text-sm")}>{description}</p>}
      {onRetry && <Button variant="secondary" className="mt-5" leading={<RotateCcw size={icon.sm} />} onClick={onRetry}>{retryLabel}</Button>}
    </div>
  );
}
