import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface ToolbarProps {
  "aria-label": string;
  /** `bar` sits flush in a layout; `floating` is a rounded pill over content. */
  variant?: "bar" | "floating";
  className?: string;
  children: ReactNode;
}

/**
 * A row of icon buttons with dividers. Arrow keys move between the controls, so the
 * whole group is one tab stop instead of nine.
 */
export function Toolbar({ variant = "bar", className, children, ...aria }: ToolbarProps) {
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]"),
    );
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    event.preventDefault();
    items[(index + delta + items.length) % items.length]?.focus();
  };

  return (
    <div
      role="toolbar"
      aria-label={aria["aria-label"]}
      onKeyDown={onKeyDown}
      className={cn(
        "flex items-center gap-0.5",
        variant === "floating" && "rounded-full border border-line bg-surface-el/95 p-1 shadow-raised backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ToolbarSeparator() {
  return <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-line" />;
}

export function ToolbarGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex items-center gap-0.5", className)}>{children}</div>;
}
