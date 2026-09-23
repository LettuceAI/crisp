import { useId } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";
import type { NavDestination, NavProps } from "./nav";


export interface TabBarProps<T extends string> extends NavProps<T> {
  showLabels?: boolean;
}

export function NavBadge({ badge }: { badge: number | boolean }) {
  return (
    <span
      className={cn(
        "absolute -right-1.5 -top-1 flex items-center justify-center rounded-full bg-accent text-on-accent",
        typeof badge === "number" ? "h-4 min-w-4 px-1 text-2xs font-semibold tabular-nums" : "h-2 w-2",
      )}
    >
      {typeof badge === "number" ? (badge > 99 ? "99+" : badge) : null}
    </span>
  );
}

/**
 * Bottom navigation, for touch and narrow windows. Destinations are quiet;
 * the create action is the only accented control on the bar.
 */
export function TabBar<T extends string>({
  items, value, onChange, onCreate, createLabel = "Create", showLabels = false, className,
}: TabBarProps<T>) {
  const layoutId = useId();
  const middle = Math.ceil(items.length / 2);

  const renderItem = (item: NavDestination<T>) => {
    const active = item.id === value;
    return (
      <button
        key={item.id}
        type="button"
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        onClick={() => onChange(item.id)}
        className={cn(
          "relative flex h-12 flex-1 flex-col items-center justify-center gap-1 rounded-xl transition-colors motion-instant",
          active ? "text-fg" : "text-fg-3 hover:text-fg-2",
        )}
      >
        {active && (
          <motion.span layoutId={layoutId} transition={m.settle} className="absolute inset-0 rounded-xl bg-fill-2" />
        )}
        <span className="relative">
          {item.icon}
          {item.badge ? <NavBadge badge={item.badge} /> : null}
        </span>
        {showLabels ? <span className="relative text-2xs font-medium leading-none">{item.label}</span> : <span className="sr-only">{item.label}</span>}
      </button>
    );
  };

  return (
    <nav aria-label="Primary" className={cn("border-t border-line bg-nav/95 px-3 pb-[calc(var(--safe-bottom)+8px)] pt-2 backdrop-blur-md", className)}>
      <div className="mx-auto flex max-w-md items-center gap-1">
        {items.slice(0, middle).map(renderItem)}
        {onCreate && (
          <div className="flex flex-1 items-center justify-center">
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={onCreate}
              aria-label={createLabel}
              className={cn("flex items-center justify-center rounded-full bg-accent text-on-accent shadow-raised", showLabels ? "h-11 w-11" : "h-10 w-10")}
            >
              <Plus size={20} strokeWidth={2.5} />
            </motion.button>
          </div>
        )}
        {items.slice(middle).map(renderItem)}
      </div>
    </nav>
  );
}
