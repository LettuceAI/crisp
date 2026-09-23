import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";
import { Stepper, type Step } from "./Stepper";

export interface WizardState {
  index: number;
  step: Step;
  first: boolean;
  last: boolean;
  next: () => void;
  back: () => void;
  goTo: (index: number) => void;
}

/** Where you are in a stepped flow, and the two moves. */
export function useWizard(steps: readonly Step[], initial = 0): WizardState {
  const [index, setIndex] = useState(initial);
  const clamp = (i: number) => Math.max(0, Math.min(steps.length - 1, i));
  return {
    index,
    step: steps[index],
    first: index === 0,
    last: index === steps.length - 1,
    next: () => setIndex((i) => clamp(i + 1)),
    back: () => setIndex((i) => clamp(i - 1)),
    goTo: (i) => setIndex(clamp(i)),
  };
}

export interface WizardProps {
  steps: readonly Step[];
  index: number;
  /** Jump back to a completed step from the stepper. */
  onStepClick?: (index: number) => void;
  /** Shown above the step's content; a title and a lead for this step. */
  title?: ReactNode;
  description?: ReactNode;
  /** The stepper: the labelled bar, the compact dots, or nothing. */
  progress?: "bar" | "dots" | "none";
  className?: string;
  children: ReactNode;
}

/**
 * The frame around a multi-step flow: the stepper, the step's heading, and the step's
 * content sliding in the direction of travel. Character creation, onboarding, the
 * lorebook generator and the engine wizard each drew their own; this is the one.
 * Pair with `useWizard` for the state and `ActionBar` for the buttons.
 */
export function Wizard({ steps, index, onStepClick, title, description, progress = "bar", className, children }: WizardProps) {
  const reduced = useReducedMotion();
  const [last, setLast] = useState(index);
  const dir = index >= last ? 1 : -1;
  if (last !== index) setLast(index);
  return (
    <div className={cn("space-y-6", className)}>
      {progress !== "none" && <Stepper steps={steps} current={index} onStepClick={onStepClick} variant={progress} />}
      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <motion.div
          key={index}
          custom={dir}
          initial={reduced ? false : { opacity: 0, x: 24 * dir }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: -24 * dir }}
          transition={m.settle}
        >
          {(title || description) && (
            <div className="mb-6">
              {title && <h1 className="text-2xl font-bold tracking-tight text-fg @2xl:text-3xl">{title}</h1>}
              {description && <p className="mt-2 max-w-xl text-base leading-relaxed text-fg-2">{description}</p>}
            </div>
          )}
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
