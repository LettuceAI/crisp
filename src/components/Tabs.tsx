import { createContext, useContext, useId, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";

interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
  id: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs parts must be used inside <Tabs>");
  return ctx;
}

export interface TabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  className?: string;
  children: ReactNode;
}

/** Underlined tabs for page-level sections. For 2–4 toggles inside a card, use Segmented. */
/**
 * Tabs switch between views of one thing (a provider's language and audio lists, a
 * character's details and scenes). For narrowing one list by a facet — kind, tag,
 * status — use FilterBar, whose chips carry counts and scroll; for two or three
 * peer settings, Segmented.
 */
export function Tabs<T extends string>({ value, onChange, className, children }: TabsProps<T>) {
  const id = useId();
  return (
    <TabsContext.Provider value={{ value, onChange: onChange as (v: string) => void, id }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children, className, "aria-label": ariaLabel }: { children: ReactNode; className?: string; "aria-label"?: string }) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = tabs[(index + delta + tabs.length) % tabs.length];
    next.focus();
    next.click();
  };
  return (
    <div role="tablist" aria-label={ariaLabel} onKeyDown={onKeyDown} className={cn("scrollbar-none flex gap-1 overflow-x-auto border-b border-line", className)}>
      {children}
    </div>
  );
}

export function Tab({ value, icon, count, children }: { value: string; icon?: ReactNode; count?: number; children: ReactNode }) {
  const tabs = useTabs();
  const selected = tabs.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${tabs.id}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${tabs.id}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      onClick={() => tabs.onChange(value)}
      className={cn(
        "relative -mb-px inline-flex h-10 shrink-0 items-center gap-2 px-3 text-base font-medium transition-colors",
        selected ? "text-fg" : "text-fg-3 hover:text-fg-2",
      )}
    >
      {icon}
      {children}
      {count !== undefined && (
        <span className={cn("rounded-full px-1.5 py-0.5 text-2xs tabular-nums", selected ? "bg-fill-3 text-fg" : "bg-fill-2 text-fg-3")}>{count}</span>
      )}
      {selected && (
        <motion.span layoutId={`${tabs.id}-indicator`} transition={m.settle} className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-fg" />
      )}
    </button>
  );
}

export function TabPanel({ value, className, children }: { value: string; className?: string; children: ReactNode }) {
  const tabs = useTabs();
  if (tabs.value !== value) return null;
  return (
    <div role="tabpanel" id={`${tabs.id}-panel-${value}`} aria-labelledby={`${tabs.id}-tab-${value}`} tabIndex={0} className={cn("pt-4 outline-none", className)}>
      {children}
    </div>
  );
}
