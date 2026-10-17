import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";
import { useCrispStrings } from "../lib/strings";

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
  /** `bar` is one row of labelled steps joined by lines; `dots` is a compact row for a sheet header. */
  variant?: "bar" | "dots";
  className?: string;
}

/**
 * Progress through a flow. Character creation, onboarding, the engine wizard and the
 * lorebook generator each grew their own; this is the one.
 */
export function Stepper({ steps, current, onStepClick, variant = "bar", className }: StepperProps) {
  const { strings: t } = useCrispStrings();
  const clamped = Math.max(0, Math.min(current, steps.length - 1));

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-1.5", className)} role="group" aria-label={t.stepperProgress(clamped + 1, steps.length)}>
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
    <ol className={cn("flex items-center gap-2", className)} aria-label={t.stepperProgress(clamped + 1, steps.length)}>
        {steps.map((step, index) => {
          const done = index < clamped;
          const active = index === clamped;
          const reachable = done && onStepClick;
          const Tag = reachable ? "button" : "div";
          return (
            <li key={step.id} className={cn("flex min-w-0 items-center gap-2", index < steps.length - 1 && "flex-1")}>
              <Tag
                {...(reachable ? { type: "button" as const, onClick: () => onStepClick(index) } : {})}
                aria-current={active ? "step" : undefined}
                aria-label={reachable ? t.stepperBackTo(step.label) : undefined}
                className={cn(
                  "-mx-1.5 flex min-w-0 shrink-0 items-center gap-1.5 rounded-lg px-1.5 py-1 text-left transition-colors",
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
                <span className={cn("min-w-0 truncate text-sm", active ? "block font-medium text-fg" : "hidden @md:block", done ? "text-fg-2" : !active && "text-fg-4")}>
                  {step.label}
                </span>
              </Tag>
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn("h-px min-w-3 flex-1 transition-colors motion-slow", done ? "bg-accent" : "bg-line-2")}
                />
              )}
            </li>
          );
        })}
    </ol>
  );
}
