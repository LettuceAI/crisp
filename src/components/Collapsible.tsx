import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";

export interface CollapsibleProps {
  title: ReactNode;
  description?: ReactNode;
  defaultOpen?: boolean;
  /** Controlled mode. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Right of the title — a count, a badge, a switch. */
  trailing?: ReactNode;
  /** `panel` draws a bordered container; `plain` is just the toggle and its content. */
  variant?: "panel" | "plain";
  className?: string;
  children: ReactNode;
}

/**
 * A single disclosure. Accordion is for a set that share open/closed state; this is
 * one section that stands alone — advanced settings, a long definition, a raw payload.
 */
export function Collapsible({
  title, description, defaultOpen = false, open: openProp, onOpenChange,
  trailing, variant = "panel", className, children,
}: CollapsibleProps) {
  const id = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  };

  return (
    <div className={cn(variant === "panel" && "overflow-hidden rounded-xl border border-line bg-surface-1", className)}>
      {/* The gutter is for the trailing slot. Reserved when there is nothing in it, the
          toggle's hover fill stops short of the edge and leaves a strip down the side. */}
      <div className={cn("flex items-center", trailing && "gap-2", trailing && variant === "panel" && "pr-3")}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          onClick={() => setOpen(!open)}
          className={cn(
            "touch-target flex min-w-0 flex-1 items-center gap-2.5 text-left transition-colors",
            variant === "panel" ? "px-4 py-3 hover:bg-fill-2" : "-mx-1 rounded-lg px-1 py-1.5 hover:bg-fill",
          )}
        >
          <ChevronDown size={16} className={cn("shrink-0 text-fg-3 transition-transform motion-quick", open && "rotate-180")} />
          <span className="min-w-0 flex-1">
            <span className={cn("block truncate font-medium", variant === "panel" ? "text-base text-fg" : "text-sm text-fg-2")}>
              {title}
            </span>
            {description && <span className="block truncate text-sm text-fg-3">{description}</span>}
          </span>
        </button>
        {trailing && <div className="shrink-0">{trailing}</div>}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-button`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={m.collapse}
            className="overflow-hidden"
          >
            <div className={cn(variant === "panel" ? "border-t border-line px-4 py-3" : "pt-2 pl-6")}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
