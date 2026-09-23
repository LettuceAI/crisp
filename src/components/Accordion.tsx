import { createContext, useContext, useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";

interface AccordionContextValue {
  openItems: Set<string>;
  toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps {
  /** Allow several items open at once. */
  multiple?: boolean;
  defaultOpen?: string[];
  className?: string;
  children: ReactNode;
}

export function Accordion({ multiple, defaultOpen = [], className, children }: AccordionProps) {
  const [openItems, setOpenItems] = useState(() => new Set(defaultOpen));
  const toggle = (value: string) => {
    setOpenItems((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };
  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className={cn("divide-y divide-line rounded-xl border border-line bg-surface-1", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ value, title, description, children }: { value: string; title: ReactNode; description?: ReactNode; children: ReactNode }) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem must be used inside <Accordion>");
  const open = ctx.openItems.has(value);
  const id = useId();
  return (
    <div>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          onClick={() => ctx.toggle(value)}
          className="touch-target flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-fill-2"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-base font-medium text-fg">{title}</span>
            {description && <span className="block text-sm text-fg-3">{description}</span>}
          </span>
          <ChevronDown size={16} className={cn("shrink-0 text-fg-3 transition-transform motion-quick", open && "rotate-180")} />
        </button>
      </h3>
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
            <div className="px-4 pb-4 text-base text-fg-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
