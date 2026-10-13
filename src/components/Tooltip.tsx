import { cloneElement, useEffect, useId, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../lib/cn";
import { usePortalTarget } from "../lib/frame";
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

const gap = 8;

const placementTranslate = {
  top: "-translate-x-1/2 -translate-y-full",
  bottom: "-translate-x-1/2",
  left: "-translate-x-full -translate-y-1/2",
  right: "-translate-y-1/2",
};

function anchor(placement: NonNullable<TooltipProps["placement"]>, trigger: DOMRect, origin: DOMRect | null): CSSProperties {
  const dx = origin ? origin.left : 0;
  const dy = origin ? origin.top : 0;
  switch (placement) {
    case "top":
      return { left: trigger.left + trigger.width / 2 - dx, top: trigger.top - gap - dy };
    case "bottom":
      return { left: trigger.left + trigger.width / 2 - dx, top: trigger.bottom + gap - dy };
    case "left":
      return { left: trigger.left - gap - dx, top: trigger.top + trigger.height / 2 - dy };
    case "right":
      return { left: trigger.right + gap - dx, top: trigger.top + trigger.height / 2 - dy };
  }
}

const motionOffset = { top: { y: 4 }, bottom: { y: -4 }, left: { x: 4 }, right: { x: -4 } };

/**
 * Hover / focus hint. Never the only place a label lives — icon buttons still need `label`.
 * It renders in the overlay portal at the trigger's position, so a scrolling or clipping
 * ancestor never hides it; it closes on scroll and resize instead of following the trigger.
 * It keeps its own compositing layer: WebKit otherwise paints it under any layer a
 * `backdrop-filter` creates, such as AppBar, whatever the z-index says.
 */
export function Tooltip({ content, placement = "top", delay = 300, disabled = false, className, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<CSSProperties | null>(null);
  const timer = useRef<number | null>(null);
  const wrapper = useRef<HTMLSpanElement>(null);
  const portal = usePortalTarget();
  const id = useId();

  const show = () => {
    if (disabled) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setOpen(false);
    setPosition(null);
  };

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (!open) return;
    const trigger = wrapper.current?.getBoundingClientRect();
    if (trigger) {
      const origin = portal && portal !== document.body ? portal.getBoundingClientRect() : null;
      setPosition(anchor(placement, trigger, origin));
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") hide();
    };
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [open, placement, portal]);

  const child = children.props as { onMouseEnter?: (e: unknown) => void; onMouseLeave?: (e: unknown) => void; onFocus?: (e: unknown) => void; onBlur?: (e: unknown) => void };
  const trigger = cloneElement(children, {
    "aria-describedby": open ? id : undefined,
    onMouseEnter: (e: unknown) => { child.onMouseEnter?.(e); show(); },
    onMouseLeave: (e: unknown) => { child.onMouseLeave?.(e); hide(); },
    onFocus: (e: unknown) => { child.onFocus?.(e); if (!disabled) setOpen(true); },
    onBlur: (e: unknown) => { child.onBlur?.(e); hide(); },
  });

  const tip = (
    <AnimatePresence>
      {open && !disabled && position && (
        <span className={cn("pointer-events-none fixed z-50 will-change-transform", placementTranslate[placement])} style={position}>
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, ...motionOffset[placement] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, ...motionOffset[placement] }}
            transition={m.instant}
            className="block whitespace-nowrap rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-xs text-fg-2 shadow-raised"
          >
            {content}
          </motion.span>
        </span>
      )}
    </AnimatePresence>
  );

  return (
    <span ref={wrapper} className={cn("relative inline-flex", className)}>
      {trigger}
      {portal ? createPortal(tip, portal) : tip}
    </span>
  );
}
