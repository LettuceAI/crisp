import { useId } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";
import { Tooltip } from "./Tooltip";
import { NavBadge } from "./TabBar";
import type { NavDestination, NavProps } from "./nav";

export interface DockProps<T extends string> extends NavProps<T> {
  edge?: "top" | "bottom";
}

/** A floating pill of destinations. Desktop and tablet; it does not reach the thumb on a phone. */
export function Dock<T extends string>({ items, value, onChange, onCreate, createLabel = "Create", edge = "bottom", className }: DockProps<T>) {
  const layoutId = useId();

  const renderItem = (item: NavDestination<T>) => {
    const active = item.id === value;
    return (
      <Tooltip key={item.id} content={item.label} placement={edge === "bottom" ? "top" : "bottom"}>
        <button
          type="button"
          aria-label={item.label}
          aria-current={active ? "page" : undefined}
          onClick={() => onChange(item.id)}
          className={cn(
            "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors motion-instant",
            active ? "text-fg" : "text-fg-3 hover:text-fg-2",
          )}
        >
          {active && (
            <motion.span layoutId={layoutId} transition={m.settle} className="absolute inset-0 rounded-full bg-fill-2" />
          )}
          <span className="relative">
            {item.icon}
            {item.badge ? <NavBadge badge={item.badge} /> : null}
          </span>
        </button>
      </Tooltip>
    );
  };

  return (
    <nav
      aria-label="Primary"
      className={cn("z-30 flex items-center gap-1 rounded-full border border-line bg-nav/95 p-1.5 shadow-raised backdrop-blur-md", className)}
    >
      {items.map(renderItem)}
      {onCreate && (
        <>
          <span aria-hidden="true" className="mx-0.5 h-6 w-px bg-line" />
          <Tooltip content={createLabel} placement={edge === "bottom" ? "top" : "bottom"}>
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={onCreate}
              aria-label={createLabel}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent transition-colors hover:bg-accent/90"
            >
              <Plus size={20} strokeWidth={2.5} />
            </motion.button>
          </Tooltip>
        </>
      )}
    </nav>
  );
}
