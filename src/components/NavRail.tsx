import { createContext, useContext, useId, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PanelLeftClose, Plus } from "lucide-react";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";
import { Tooltip } from "./Tooltip";
import { NavBadge } from "./TabBar";
import type { NavDestination, NavProps } from "./nav";

export interface NavRailProps<T extends string> extends NavProps<T> {
  side?: "left" | "right";
  /** `rail` is a 64px icon column; `sidebar` is 224px with labels. */
  variant?: "rail" | "sidebar";
  /** Detach from the edge and float as a rounded pill column. */
  floating?: boolean;
  align?: "start" | "center" | "end";
  /**
   * Content between the destinations and the footer — the recent chats, on a desktop.
   * It takes the leftover height and scrolls on its own, so the destinations and the
   * footer never move.
   */
  section?: ReactNode;
  /** Show a button that switches between the labelled sidebar and the icon rail. */
  onToggle?: () => void;
}

const alignClass = { start: "justify-start", center: "justify-center", end: "justify-end" };

/**
 * Desktop navigation. A rail of icons, or a labelled sidebar when there is room.
 * Icon-only items get a tooltip, because an icon on its own is a guess.
 */
const NavExpandedContext = createContext(true);

/** Whether the side navigation this sits in is open — for content passed as `section`. */
export function useNavExpanded() {
  return useContext(NavExpandedContext);
}

/** The icon column. Every row keeps its icon in this slot, open or folded. */
const SLOT = "flex w-11 shrink-0 items-center justify-center";

/**
 * A label that is uncovered rather than moved. It never wraps — a line breaking while
 * the width changes is exactly the shift to avoid — and it fades on the way out at once,
 * and on the way in only once there is room for it.
 */
export function NavLabel({ children, className }: { children: ReactNode; className?: string }) {
  const open = useNavExpanded();
  return (
    <span
      className={cn(
        "relative min-w-0 flex-1 overflow-hidden whitespace-nowrap text-left transition-opacity",
        "[mask-image:linear-gradient(to_right,black_calc(100%-14px),transparent)]",
        open ? "opacity-100 duration-200 delay-100" : "opacity-0 duration-100",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Desktop navigation: an icon rail, or a labelled sidebar — the same element either
 * way. Folding and unfolding animates the width and nothing else. Icons sit in one
 * fixed slot in both states, so they never move; labels are revealed by the width, not
 * laid out again; the section and the footer keep their rows. What changes is how much
 * of each row you can see.
 */
export function NavRail<T extends string>(props: NavRailProps<T>) {
  if (props.floating) return <FloatingRail {...props} />;
  return <DockedNav {...props} />;
}

function DockedNav<T extends string>({
  items, value, onChange, onCreate, createLabel = "Create", footerItems, side = "left",
  variant = "rail", section, onToggle, className,
}: NavRailProps<T>) {
  const layoutId = useId();
  const reduced = useReducedMotion();
  const open = variant === "sidebar";
  const width = open ? (section ? 256 : 224) : 64;
  const tip = side === "left" ? "right" : "left";

  const row = (item: NavDestination<T>) => {
    const active = item.id === value;
    return (
      <Tooltip key={item.id} content={item.label} placement={tip} disabled={open} className="flex w-full">
        <button
          type="button"
          aria-label={item.label}
          aria-current={active ? "page" : undefined}
          onClick={() => onChange(item.id)}
          className={cn(
            "relative flex h-10 w-full shrink-0 items-center overflow-hidden rounded-xl transition-colors motion-instant",
            active ? "text-fg" : "text-fg-3 hover:bg-fill hover:text-fg-2",
          )}
        >
          {active && <motion.span layoutId={layoutId} transition={m.settle} className="absolute inset-0 rounded-xl bg-fill-2" />}
          <span className={cn(SLOT, "relative")}>
            {item.icon}
            {item.badge ? <NavBadge badge={item.badge} /> : null}
          </span>
          <NavLabel className="text-base font-medium">{item.label}</NavLabel>
        </button>
      </Tooltip>
    );
  };

  const divider = <span aria-hidden="true" className="mx-1 my-1 h-px shrink-0 bg-line" />;

  return (
    <NavExpandedContext.Provider value={open}>
      <motion.nav
        aria-label="Primary"
        initial={false}
        animate={{ width }}
        transition={reduced ? { duration: 0 } : m.sidebar}
        className={cn(
          "z-30 flex h-full shrink-0 flex-col gap-1 bg-nav px-2.5 py-3 text-fg",
          side === "left" ? "border-r border-line" : "border-l border-line",
          className,
        )}
      >
        {onCreate && (
          <Tooltip content={createLabel} placement={tip} disabled={open} className="flex w-full">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={onCreate}
              aria-label={createLabel}
              className="flex h-10 w-full shrink-0 items-center overflow-hidden rounded-xl bg-accent text-on-accent transition-colors hover:bg-accent/90"
            >
              <span className={SLOT}>
                <Plus size={18} strokeWidth={2.5} />
              </span>
              <NavLabel className="text-base font-medium">{createLabel}</NavLabel>
            </motion.button>
          </Tooltip>
        )}
        {onCreate && divider}
        {items.map(row)}

        {/* The section fades in and out rather than popping — a screen that takes the
            recent chats away animates the width at the same moment. While it leaves,
            it and the spacer share the free height, so the footer does not move. */}
        <AnimatePresence initial={false}>
          {section && (
            <motion.div
              key="section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduced ? { duration: 0 } : m.quick}
              className="-mx-2.5 flex min-h-0 flex-1 flex-col px-2.5"
            >
              {/* Nothing above it to divide from when the section is all there is. */}
              {(onCreate || items.length > 0) && divider}
              <div className="scrollbar-thin -mx-2.5 min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2.5">{section}</div>
            </motion.div>
          )}
        </AnimatePresence>
        {!section && <span aria-hidden="true" className="flex-1" />}

        {(footerItems?.length || onToggle) && divider}
        {/* The fold sits above the footer: settings is always the last thing in the rail. */}
        {onToggle && (
          <Tooltip content="Expand sidebar" placement={tip} disabled={open} className="flex w-full">
            <button
              type="button"
              onClick={onToggle}
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
              aria-expanded={open}
              className="flex h-10 w-full shrink-0 items-center overflow-hidden rounded-xl text-fg-3 transition-colors hover:bg-fill hover:text-fg"
            >
              <span className={SLOT}>
                {/* One glyph, turned: it points the way the panel will go. */}
                <motion.span animate={{ rotate: open ? 0 : 180 }} transition={reduced ? { duration: 0 } : m.sidebar} className="flex">
                  <PanelLeftClose size={18} className={side === "right" ? "-scale-x-100" : undefined} />
                </motion.span>
              </span>
              <NavLabel className="text-base font-medium">Collapse</NavLabel>
            </button>
          </Tooltip>
        )}
        {footerItems?.map(row)}
      </motion.nav>
    </NavExpandedContext.Provider>
  );
}

function FloatingRail<T extends string>({
  items, value, onChange, onCreate, createLabel = "Create", footerItems, side = "left",
  variant = "rail", floating = false, align = "start", className,
}: NavRailProps<T>) {
  const layoutId = useId();
  const labelled = variant === "sidebar";

  const renderItem = (item: NavDestination<T>) => {
    const active = item.id === value;
    const button = (
      <button
        key={item.id}
        type="button"
        aria-label={labelled ? undefined : item.label}
        aria-current={active ? "page" : undefined}
        onClick={() => onChange(item.id)}
        className={cn(
          "relative flex shrink-0 items-center transition-colors motion-instant",
          labelled ? "h-10 w-full gap-3 rounded-xl px-3" : "h-11 w-11 justify-center",
          !labelled && (floating ? "rounded-full" : "rounded-xl"),
          active ? "text-fg" : "text-fg-3 hover:text-fg-2",
        )}
      >
        {active && (
          <motion.span
            layoutId={layoutId}
            transition={m.settle}
            className={cn("absolute inset-0 bg-fill-2", labelled || !floating ? "rounded-xl" : "rounded-full")}
          />
        )}
        <span className="relative shrink-0">
          {item.icon}
          {item.badge ? <NavBadge badge={item.badge} /> : null}
        </span>
        {labelled && <span className="relative min-w-0 flex-1 truncate text-left text-base font-medium">{item.label}</span>}
        {labelled && item.badge && typeof item.badge === "number" && (
          <span className="relative shrink-0 rounded-full bg-fill-3 px-1.5 text-2xs font-semibold tabular-nums text-fg-2">{item.badge}</span>
        )}
      </button>
    );
    return labelled ? button : <Tooltip key={item.id} content={item.label} placement={side === "left" ? "right" : "left"}>{button}</Tooltip>;
  };

  const createButton = onCreate && (
    labelled ? (
      <button
        type="button"
        onClick={onCreate}
        className="flex h-10 w-full items-center gap-2.5 rounded-xl bg-accent px-3 text-base font-medium text-on-accent transition-colors hover:bg-accent/90"
      >
        <Plus size={18} strokeWidth={2.5} />
        {createLabel}
      </button>
    ) : (
      <Tooltip content={createLabel} placement={side === "left" ? "right" : "left"}>
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={onCreate}
          aria-label={createLabel}
          className={cn("flex h-11 w-11 shrink-0 items-center justify-center bg-accent text-on-accent transition-colors hover:bg-accent/90", floating ? "rounded-full" : "rounded-xl")}
        >
          <Plus size={20} strokeWidth={2.5} />
        </motion.button>
      </Tooltip>
    )
  );

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "z-30 flex flex-col text-fg",
        labelled ? "w-56 gap-1 p-3" : "w-16 items-center gap-1.5 py-3",
        floating
          ? "gap-1.5 rounded-2xl border border-line bg-nav/95 p-2 shadow-raised backdrop-blur-md"
          : cn("h-full bg-nav", side === "left" ? "border-r border-line" : "border-l border-line"),
        !floating && alignClass[align],
        className,
      )}
    >
      {createButton}
      {createButton && <span aria-hidden="true" className={cn("my-1 h-px bg-line", labelled ? "w-full" : "w-7")} />}
      {items.map(renderItem)}
      {footerItems && footerItems.length > 0 && (
        <>
          <span aria-hidden="true" className="flex-1" />
          <span aria-hidden="true" className={cn("my-1 h-px bg-line", labelled ? "w-full" : "w-7")} />
          {footerItems.map(renderItem)}
        </>
      )}
    </nav>
  );
}
