import { cloneElement, useId, useState, type ReactElement, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";

export interface TooltipProps {
  content: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  /** ms before it shows on hover. */
  delay?: number;
  /** Keep it from opening — for a label that is already on screen. The wrapper stays,
      so the trigger is not remounted when this flips. */
  disabled?: boolean;
  /** Classes for the wrapper, which is an inline-flex span by default. */
  className?: string;
  children: ReactElement<Record<string, unknown>>;
}

const placementClass = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

const motionOffset = { top: { y: 4 }, bottom: { y: -4 }, left: { x: 4 }, right: { x: -4 } };

/** Hover / focus hint. Never the only place a label lives — icon buttons still need `label`. */
export function Tooltip({ content, placement = "top", delay = 300, disabled = false, className, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const id = useId();

  const show = () => {
    if (disabled) return;
    if (timer) window.clearTimeout(timer);
    setTimer(window.setTimeout(() => setOpen(true), delay));
  };
  const hide = () => {
    if (timer) window.clearTimeout(timer);
    setTimer(null);
    setOpen(false);
  };

  const child = children.props as { onMouseEnter?: (e: unknown) => void; onMouseLeave?: (e: unknown) => void; onFocus?: (e: unknown) => void; onBlur?: (e: unknown) => void };
  const trigger = cloneElement(children, {
    "aria-describedby": open ? id : undefined,
    onMouseEnter: (e: unknown) => { child.onMouseEnter?.(e); show(); },
    onMouseLeave: (e: unknown) => { child.onMouseLeave?.(e); hide(); },
    onFocus: (e: unknown) => { child.onFocus?.(e); if (!disabled) setOpen(true); },
    onBlur: (e: unknown) => { child.onBlur?.(e); hide(); },
  });

  return (
    <span className={cn("relative inline-flex", className)}>
      {trigger}
      <AnimatePresence>
        {open && !disabled && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, ...motionOffset[placement] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, ...motionOffset[placement] }}
            transition={m.instant}
            className={cn(
              "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-xs text-fg-2 shadow-raised",
              placementClass[placement],
            )}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
