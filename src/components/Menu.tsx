import {
  createContext, useCallback, useContext, useEffect, useId, useRef, useState,
  type KeyboardEvent, type ReactElement, type ReactNode, cloneElement,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";

interface MenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export interface MenuProps {
  children: ReactNode;
}

/**
 * Dropdown menu. Compose: <Menu><MenuTrigger>…</MenuTrigger><MenuContent>…</MenuContent></Menu>
 * Anchored to the trigger; use Sheet on touch when the list is long.
 */
export function Menu({ children }: MenuProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <MenuContext.Provider value={{ open, setOpen, id }}>
      <div ref={ref} className="relative inline-flex">
        {children}
      </div>
    </MenuContext.Provider>
  );
}

function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("Menu parts must be used inside <Menu>");
  return ctx;
}

export function MenuTrigger({ children }: { children: ReactElement<Record<string, unknown>> }) {
  const { open, setOpen, id } = useMenu();
  const child = children.props as { onClick?: (e: unknown) => void };
  return cloneElement(children, {
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-controls": id,
    onClick: (e: unknown) => { child.onClick?.(e); setOpen(!open); },
  });
}

export interface MenuContentProps {
  align?: "start" | "end";
  side?: "bottom" | "top";
  className?: string;
  children: ReactNode;
}

export function MenuContent({ align = "start", side = "bottom", className, children }: MenuContentProps) {
  const { open, setOpen, id } = useMenu();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) listRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')?.focus();
  }, [open]);

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? []);
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (event.key === "ArrowDown") { event.preventDefault(); items[(index + 1) % items.length]?.focus(); }
    if (event.key === "ArrowUp") { event.preventDefault(); items[(index - 1 + items.length) % items.length]?.focus(); }
    if (event.key === "Home") { event.preventDefault(); items[0]?.focus(); }
    if (event.key === "End") { event.preventDefault(); items[items.length - 1]?.focus(); }
    if (event.key === "Tab") setOpen(false);
  }, [setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={listRef}
          id={id}
          role="menu"
          onKeyDown={onKeyDown}
          initial={{ opacity: 0, scale: 0.97, y: side === "bottom" ? -4 : 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: side === "bottom" ? -4 : 4 }}
          transition={m.instant}
          className={cn(
            "absolute z-50 min-w-48 rounded-xl border border-line bg-surface-2 p-1 shadow-raised",
            side === "bottom" ? "top-full mt-1.5" : "bottom-full mb-1.5",
            align === "start" ? "left-0 origin-top-left" : "right-0 origin-top-right",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export interface MenuItemProps {
  icon?: ReactNode;
  shortcut?: string;
  /** Paint it as destructive. */
  danger?: boolean;
  disabled?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  children: ReactNode;
}

export function MenuItem({ icon, shortcut, danger, disabled, selected, onSelect, children }: MenuItemProps) {
  const { setOpen } = useMenu();
  const activate = () => {
    if (disabled) return;
    onSelect?.();
    setOpen(false);
  };
  return (
    <button
      type="button"
      role="menuitem"
      aria-disabled={disabled || undefined}
      tabIndex={-1}
      onClick={activate}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-base outline-none",
        "focus-visible:bg-fill-2 hover:bg-fill-2",
        danger ? "text-danger" : "text-fg",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      {icon && <span className={cn("shrink-0", danger ? "text-danger" : "text-fg-3")}>{icon}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {selected && <Check size={14} className="shrink-0 text-accent" />}
      {shortcut && <kbd className="shrink-0 text-xs text-fg-3">{shortcut}</kbd>}
    </button>
  );
}

export function MenuSeparator() {
  return <div role="separator" className="my-1 h-px bg-line" />;
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return <div className="px-2.5 pb-1 pt-2 text-2xs font-medium text-fg-3">{children}</div>;
}
