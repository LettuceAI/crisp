import { motion as m } from "../lib/motion";
import { useCallback, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./Button";
import { Stepper } from "./Stepper";

export interface TourStep {
  /** CSS selector for the element to highlight. Omit for a centred, anchorless step. */
  target?: string;
  title: ReactNode;
  body: ReactNode;
  /** Preferred side; it flips when there isn't room. */
  side?: "top" | "bottom";
}

export interface TourProps {
  steps: readonly TourStep[];
  open: boolean;
  onClose: () => void;
  onFinish?: () => void;
  finishLabel?: string;
}

const PAD = 8;

/**
 * Coach marks over the real interface: a cut-out spotlight on the target and a card
 * beside it. Replaces a 1,000-line bespoke tour. It scrolls the target into view and
 * traps Escape, so it can always be left.
 */
export function Tour({ steps, open, onClose, onFinish, finishLabel = "Got it" }: TourProps) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = steps[index];

  useEffect(() => { if (open) setIndex(0); }, [open]);

  useLayoutEffect(() => {
    if (!open || !step) return;
    const measure = () => {
      if (!step.target) return setRect(null);
      const el = document.querySelector(step.target);
      if (!el) return setRect(null);
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      setRect(el.getBoundingClientRect());
    };
    measure();
    const id = window.setTimeout(measure, 260);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, step]);

  const finish = useCallback(() => { onFinish?.(); onClose(); }, [onFinish, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setIndex((i) => Math.min(steps.length - 1, i + 1));
      if (event.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, steps.length]);

  if (!step) return null;

  const below = rect ? rect.bottom + 160 < window.innerHeight || step.side === "bottom" : true;
  const cardStyle = rect
    ? {
        top: below ? rect.bottom + PAD * 2 : undefined,
        bottom: below ? undefined : window.innerHeight - rect.top + PAD * 2,
        left: Math.max(12, Math.min(rect.left, window.innerWidth - 332)),
      }
    : { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* The spotlight is a giant ring, so one element cuts a hole in the veil
              without needing an SVG mask or cloning the target. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={m.quick}
            onClick={onClose}
            className="fixed inset-0 z-[85]"
          >
            {rect ? (
              <motion.span
                layout
                transition={m.surface}
                style={{ top: rect.top - PAD, left: rect.left - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2 }}
                className="absolute rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.72)] ring-2 ring-accent"
              />
            ) : (
              <span className="absolute inset-0 bg-black/72" />
            )}
          </motion.div>

          <motion.div
            role="dialog"
            aria-label="Product tour"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={m.quick}
            style={cardStyle}
            className="fixed z-[86] w-80 max-w-[calc(100vw-24px)] rounded-xl border border-line bg-surface-2 p-4 shadow-raised"
          >
            <div className="flex items-start gap-2">
              <h2 className="min-w-0 flex-1 text-base font-semibold text-fg">{step.title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Skip tour"
                className="-mr-1 -mt-1 rounded-lg p-1.5 text-fg-3 hover:bg-fill-2 hover:text-fg"
              >
                <X size={14} />
              </button>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-fg-2">{step.body}</p>

            <div className="mt-4 flex items-center gap-3">
              <Stepper steps={steps.map((s, i) => ({ id: String(i), label: String(s.title) }))} current={index} variant="dots" />
              <span className="flex-1" />
              {index > 0 && (
                <Button size="sm" variant="ghost" onClick={() => setIndex((i) => i - 1)}>Back</Button>
              )}
              <Button
                size="sm"
                variant="primary"
                onClick={() => (index === steps.length - 1 ? finish() : setIndex((i) => i + 1))}
              >
                {index === steps.length - 1 ? finishLabel : "Next"}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
