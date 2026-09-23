import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface Step {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface StepperProps {
  steps: readonly Step[];
  /** Index of the step in progress. Everything before it counts as done. */
  current: number;
  /** Jump back to a completed step. Forward jumps are never offered. */
  onStepClick?: (index: number) => void;
  /** `bar` is a segmented progress strip; `dots` is a compact row for a sheet header. */
  variant?: "bar" | "dots";
  className?: string;
}

/**
 * Progress through a flow. Character creation, onboarding, the engine wizard and the
 * lorebook generator each grew their own; this is the one.
 */
export function Stepper({ steps, current, onStepClick, variant = "bar", className }: StepperProps) {
  const clamped = Math.max(0, Math.min(current, steps.length - 1));

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-1.5", className)} role="group" aria-label={`Step ${clamped + 1} of ${steps.length}`}>
        {steps.map((step, index) => (
          <span
            key={step.id}
            aria-current={index === clamped ? "step" : undefined}
            className={cn(
              "h-1.5 rounded-full transition-all motion-slow",
              index === clamped ? "w-5 bg-accent" : index < clamped ? "w-1.5 bg-accent/50" : "w-1.5 bg-fill-3",
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm text-fg-3">
          Step {clamped + 1} of {steps.length}
          <span className="mx-1.5 text-fg-4">·</span>
          <span className="font-medium text-fg-2">{steps[clamped]?.label}</span>
        </p>
        <span className="shrink-0 text-sm tabular-nums text-fg-3">
          {Math.round((clamped / Math.max(1, steps.length - 1)) * 100)}%
        </span>
      </div>
      <ol className="flex gap-1.5">
        {steps.map((step, index) => {
          const done = index < clamped;
          const active = index === clamped;
          const reachable = done && onStepClick;
          const Tag = reachable ? "button" : "div";
          return (
            <li key={step.id} className="min-w-0 flex-1">
              <Tag
                {...(reachable ? { type: "button" as const, onClick: () => onStepClick(index) } : {})}
                aria-current={active ? "step" : undefined}
                aria-label={reachable ? `Back to ${step.label}` : undefined}
                className={cn(
                  "flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-left transition-colors",
                  reachable && "hover:bg-fill-2",
                )}
              >
                <motion.span
                  layout
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-2xs font-semibold",
                    done ? "bg-accent text-on-accent" : active ? "bg-accent/20 text-accent" : "bg-fill-3 text-fg-4",
                  )}
                >
                  {done ? <Check size={12} strokeWidth={3} /> : step.icon ?? index + 1}
                </motion.span>
                <span className={cn("hidden min-w-0 truncate text-sm @md:block", active ? "font-medium text-fg" : done ? "text-fg-2" : "text-fg-4")}>
                  {step.label}
                </span>
              </Tag>
              <span
                aria-hidden="true"
                className={cn("mt-1 block h-1 rounded-full transition-colors motion-slow", done || active ? "bg-accent" : "bg-fill-3")}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
