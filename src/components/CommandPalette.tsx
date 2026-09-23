import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Search } from "lucide-react";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";
import { Highlight } from "./Highlight";
import { Kbd } from "./Kbd";
import { Spinner } from "./Spinner";

export interface Command {
  id: string;
  label: string;
  /** Second line — where it goes, or what it does. */
  description?: string;
  icon?: ReactNode;
  group?: string;
  /** Extra words to match on that aren't in the label. */
  keywords?: string;
  shortcut?: string;
  onRun: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: readonly Command[];
  placeholder?: string;
  /** Take over filtering — for searching messages or characters remotely. */
  onQueryChange?: (query: string) => void;
  loading?: boolean;
  emptyMessage?: string;
}

/**
 * ⌘K. A desktop affordance the app has the data for already — characters, chats,
 * settings and every navigation target are all searchable, just not from one place.
 * It never replaces a visible control; it's a shortcut to ones that exist.
 */
export function CommandPalette({
  open, onOpenChange, commands, placeholder = "Search or jump to…", onQueryChange, loading, emptyMessage = "No matches",
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const restore = useRef<HTMLElement | null>(null);

  const filtered = useMemo(() => {
    if (onQueryChange || !query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter((c) =>
      c.label.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.keywords?.toLowerCase().includes(q),
    );
  }, [commands, query, onQueryChange]);

  const grouped = useMemo(() => {
    const map = new Map<string, Command[]>();
    for (const command of filtered) {
      const key = command.group ?? "";
      const bucket = map.get(key);
      if (bucket) bucket.push(command);
      else map.set(key, [command]);
    }
    return Array.from(map.entries());
  }, [filtered]);

  useEffect(() => {
    if (!open) return;
    restore.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      restore.current?.focus?.();
    };
  }, [open]);

  useEffect(() => { setActive(0); }, [query]);
  useEffect(() => {
    if (open) listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const run = (command: Command) => {
    onOpenChange(false);
    command.onRun();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); onOpenChange(false); }
    if (event.key === "ArrowDown") { event.preventDefault(); setActive((i) => (i + 1) % Math.max(1, filtered.length)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive((i) => (i - 1 + filtered.length) % Math.max(1, filtered.length)); }
    if (event.key === "Enter" && filtered[active]) { event.preventDefault(); run(filtered[active]); }
  };

  let index = -1;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[95] flex items-start justify-center p-4 pt-[12vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={m.quick}
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={m.settle}
            onKeyDown={onKeyDown}
            className="relative flex max-h-[60vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-line bg-surface-2 shadow-raised"
          >
            <div className="flex shrink-0 items-center gap-2.5 border-b border-line px-4 py-3">
              <Search size={18} className="shrink-0 text-fg-3" />
              <input
                autoFocus
                value={query}
                onChange={(event) => { setQuery(event.target.value); onQueryChange?.(event.target.value); }}
                placeholder={placeholder}
                aria-label={placeholder}
                className="min-w-0 flex-1 bg-transparent text-lg text-fg outline-none placeholder:text-fg-4"
              />
              {loading && <Spinner size="sm" />}
              <Kbd>Esc</Kbd>
            </div>

            <div ref={listRef} role="listbox" className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-1.5">
              {filtered.length === 0 && <p className="px-3 py-10 text-center text-sm text-fg-3">{emptyMessage}</p>}
              {grouped.map(([group, list]) => (
                <div key={group || "_"}>
                  {group && <p className="px-2.5 pb-1 pt-2 text-2xs font-medium text-fg-3">{group}</p>}
                  {list.map((command) => {
                    index += 1;
                    const isActive = index === active;
                    return (
                      <div
                        key={command.id}
                        role="option"
                        aria-selected={isActive}
                        data-active={isActive}
                        onPointerEnter={() => setActive(filtered.indexOf(command))}
                        onClick={() => run(command)}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2",
                          isActive && "bg-fill-2",
                        )}
                      >
                        {command.icon && <span className="shrink-0 text-fg-3">{command.icon}</span>}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-base text-fg">
                            <Highlight query={query}>{command.label}</Highlight>
                          </span>
                          {command.description && (
                            <span className="block truncate text-sm text-fg-3">{command.description}</span>
                          )}
                        </span>
                        {command.shortcut && <Kbd>{command.shortcut}</Kbd>}
                        {isActive && <CornerDownLeft size={14} className="shrink-0 text-fg-4" />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Binds ⌘K / Ctrl+K. Ignores the shortcut while a field is focused. */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setOpen((v) => !v);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
  return { open, setOpen };
}
