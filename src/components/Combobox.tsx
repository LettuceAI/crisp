import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "../lib/cn";
import { useFieldContext } from "./Field";
import { inputSurface } from "./Input";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Spinner } from "./Spinner";

export interface ComboboxOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  icon?: ReactNode;
  group?: string;
  disabled?: boolean;
}

export interface ComboboxProps<T extends string> {
  options: readonly ComboboxOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  /** Take over filtering — for a remote list like the HuggingFace catalogue. */
  onSearch?: (query: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  clearable?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/**
 * A select you can type into. The app has four hand-rolled versions of this
 * (PersonaSelector, ReferenceSelector, CharacterSelectorSingle, LoraSelector) and a
 * 5,000-line HuggingFace browser that a native select can't serve.
 */
export function Combobox<T extends string>({
  options, value, onChange, placeholder = "Select…", searchPlaceholder = "Search…",
  onSearch, loading, emptyMessage = "No matches", clearable, disabled, id, className,
}: ComboboxProps<T>) {
  const field = useFieldContext();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (onSearch || !query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q));
  }, [options, query, onSearch]);

  const grouped = useMemo(() => {
    const map = new Map<string, ComboboxOption<T>[]>();
    for (const option of filtered) {
      const key = option.group ?? "";
      const list = map.get(key);
      if (list) list.push(option);
      else map.set(key, [option]);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const flat = useMemo(() => grouped.flatMap(([, list]) => list), [grouped]);
  const selected = options.find((o) => o.value === value) ?? null;

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(Math.max(0, flat.findIndex((o) => o.value === value)));
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const commit = (option: ComboboxOption<T>) => {
    if (option.disabled) return;
    onChange(option.value);
    setOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setActive((i) => {
        let next = i;
        for (let step = 0; step < flat.length; step++) {
          next = (next + delta + flat.length) % flat.length;
          if (!flat[next]?.disabled) break;
        }
        return next;
      });
    }
    if (event.key === "Enter" && flat[active]) {
      event.preventDefault();
      commit(flat[active]);
    }
    if (event.key === "Home") { event.preventDefault(); setActive(0); }
    if (event.key === "End") { event.preventDefault(); setActive(flat.length - 1); }
  };

  let index = -1;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <button
          type="button"
          id={id ?? field?.id}
          role="combobox"
          aria-expanded={open}
          aria-describedby={field?.describedBy}
          aria-invalid={field?.invalid || undefined}
          disabled={disabled}
          className={cn(inputSurface, "control-md flex items-center gap-2 pl-3.5 pr-2 text-left", className)}
        >
          {selected?.icon && <span className="shrink-0 text-fg-3">{selected.icon}</span>}
          <span className={cn("min-w-0 flex-1 truncate", selected ? "text-fg" : "text-fg-4")}>
            {selected?.label ?? placeholder}
          </span>
          {clearable && selected && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear"
              onClick={(event) => { event.stopPropagation(); onChange(null); }}
              className="tap-target flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-fg-3 hover:bg-fill-2 hover:text-fg"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown size={16} className="shrink-0 text-fg-3" />
        </button>
      </PopoverTrigger>

      <PopoverContent matchWidth className="p-0">
        <div className="flex items-center gap-2 border-b border-line px-3 py-2">
          <Search size={16} className="shrink-0 text-fg-3" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => { setQuery(event.target.value); setActive(0); onSearch?.(event.target.value); }}
            onKeyDown={onKeyDown}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-fg-4"
          />
          {loading && <Spinner size="sm" />}
        </div>

        <div ref={listRef} role="listbox" className="scrollbar-thin max-h-64 overflow-y-auto p-1">
          {flat.length === 0 && <p className="px-2.5 py-6 text-center text-sm text-fg-3">{emptyMessage}</p>}
          {grouped.map(([group, list]) => (
            <div key={group || "_"}>
              {group && <p className="px-2.5 pb-1 pt-2 text-2xs font-medium text-fg-3">{group}</p>}
              {list.map((option) => {
                index += 1;
                const isActive = index === active;
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-active={isActive}
                    disabled={option.disabled}
                    onPointerEnter={() => setActive(flat.indexOf(option))}
                    onClick={() => commit(option)}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left",
                      isActive && "bg-fill-2",
                      option.disabled && "pointer-events-none opacity-40",
                    )}
                  >
                    {option.icon && <span className="mt-0.5 shrink-0 text-fg-3">{option.icon}</span>}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-base text-fg">{option.label}</span>
                      {option.description && <span className="block truncate text-sm text-fg-3">{option.description}</span>}
                    </span>
                    {isSelected && <Check size={16} className="mt-0.5 shrink-0 text-accent" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
