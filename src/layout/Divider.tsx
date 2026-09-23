import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  orientation?: "horizontal" | "vertical";
  /** Text set into the line — "or", a date, a section name. */
  label?: ReactNode;
  /** Vertical rhythm around a horizontal divider. */
  spacing?: "none" | "sm" | "md" | "lg";
}

const spacingClass = { none: "", sm: "my-2", md: "my-4", lg: "my-8" };

export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = "horizontal", label, spacing = "none", className, ...rest },
  ref,
) {
  if (orientation === "vertical") {
    return <div ref={ref} role="separator" aria-orientation="vertical" className={cn("w-px self-stretch bg-line", className)} {...rest} />;
  }
  if (!label) {
    return <div ref={ref} role="separator" className={cn("h-px w-full bg-line", spacingClass[spacing], className)} {...rest} />;
  }
  return (
    <div ref={ref} role="separator" className={cn("flex items-center gap-3", spacingClass[spacing], className)} {...rest}>
      <span className="h-px flex-1 bg-line" />
      <span className="shrink-0 text-xs text-fg-3">{label}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
});
