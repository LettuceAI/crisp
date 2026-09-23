import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "../lib/cn";
import { useFieldContext } from "./Field";
import { inputSurface } from "./Input";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

export interface SelectMenuOption<T extends string = string> {
  value: T;
  label: string;
  /** Second line under the label. */
  description?: string;
  icon?: ReactNode;
  /** Right-aligned slot — a badge, a size, a shortcut. */
  meta?: ReactNode;
  group?: string;
  disabled?: boolean;
}

interface BaseProps<T extends string> {
  options: readonly SelectMenuOption<T>[];
  placeholder?: string;
  /** Show the chosen option's icon in the closed trigger. Default true. */
  triggerIcon?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  /** Width of the open list. Defaults to the trigger's width. */
  menuClassName?: string;
}

export interface SingleSelectMenuProps<T extends string> extends BaseProps<T> {
  multiple?: false;
  value: T | null;
  onChange: (value: T | null) => void;
  clearable?: boolean;
}

export interface MultiSelectMenuProps<T extends string> extends BaseProps<T> {
  multiple: true;
  value: readonly T[];
  onChange: (value: T[]) => void;
  /** Collapse to "3 selected" past this many. Default 2. */
  maxLabels?: number;
}

export type SelectMenuProps<T extends string> = SingleSelectMenuProps<T> | MultiSelectMenuProps<T>;

/**
 * Our own select. `Select` stays for the plain cases — it opens the OS picker on a
 * phone, which nothing custom beats for reach. Use this one when the options need
 * icons, descriptions, groups or multi-select.
 *
 * It keeps what a native select gives you for free: typeahead (type "ge" to jump to
 * Gemma), Home/End, and the listbox pattern with aria-activedescendant, so focus never
 * leaves the trigger and screen readers announce the active option.
 */
export function SelectMenu<T extends string>(props: SelectMenuProps<T>) {
  const {
    options, placeholder = "Select…", triggerIcon = true, disabled, id, className, menuClassName,
  } = props;
  const multiple = props.multiple === true;
  const field = useFieldContext();
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const typeahead = useRef({ query: "", at: 0 });

  const selectedValues = useMemo<readonly T[]>(
    () => (multiple ? (props as MultiSelectMenuProps<T>).value : [(props as SingleSelectMenuProps<T>).value].filter(Boolean) as T[]),
    [multiple, props],
  );

  const enabled = useMemo(() => options.filter((o) => !o.disabled), [options]);
  const grouped = useMemo(() => {
    const map = new Map<string, SelectMenuOption<T>[]>();
    for (const option of options) {
      const key = option.group ?? "";
      map.get(key)?.push(option) ?? map.set(key, [option]);
    }
    return Array.from(map.entries());
  }, [options]);

  const select = useCallback(
    (option: SelectMenuOption<T>) => {
      if (option.disabled) return;
      if (multiple) {
        const { value, onChange } = props as MultiSelectMenuProps<T>;
        onChange(value.includes(option.value) ? value.filter((v) => v !== option.value) : [...value, option.value]);
        return;
      }
      (props as SingleSelectMenuProps<T>).onChange(option.value);
      setOpen(false);
    },
    [multiple, props],
  );

  useEffect(() => {
    if (!open) return;
    const first = enabled.findIndex((o) => selectedValues.includes(o.value));
    setActive(first < 0 ? 0 : first);
  }, [open, enabled, selectedValues]);

  useEffect(() => {
    if (open) listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const move = (delta: number) =>
    setActive((i) => {
      if (enabled.length === 0) return 0;
      return (i + delta + enabled.length) % enabled.length;
    });

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!open && (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;

    if (event.key === "ArrowDown") { event.preventDefault(); move(1); return; }
    if (event.key === "ArrowUp") { event.preventDefault(); move(-1); return; }
    if (event.key === "Home") { event.preventDefault(); setActive(0); return; }
    if (event.key === "End") { event.preventDefault(); setActive(enabled.length - 1); return; }
    if (event.key === "Enter" || (event.key === " " && !typeahead.current.query)) {
      event.preventDefault();
      if (enabled[active]) select(enabled[active]);
      return;
    }
    if (event.key === "Tab") { setOpen(false); return; }

    /* Typeahead: printable keys build a prefix that resets after a second, the way a
       native select behaves. Without this, a long model list is only reachable by scroll. */
    if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      const now = Date.now();
      const state = typeahead.current;
      state.query = now - state.at > 1000 ? event.key : state.query + event.key;
      state.at = now;
      const prefix = state.query.toLowerCase();
      const from = state.query.length === 1 ? active + 1 : active;
      const order = [...enabled.slice(from), ...enabled.slice(0, from)];
      const hit = order.find((o) => o.label.toLowerCase().startsWith(prefix));
      if (hit) setActive(enabled.indexOf(hit));
    }
  };

  const selectedOptions = options.filter((o) => selectedValues.includes(o.value));
  const maxLabels = multiple ? (props as MultiSelectMenuProps<T>).maxLabels ?? 2 : 1;
  const triggerLabel =
    selectedOptions.length === 0
      ? placeholder
      : multiple && selectedOptions.length > maxLabels
        ? `${selectedOptions.length} selected`
        : selectedOptions.map((o) => o.label).join(", ");

  let index = -1;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <button
          type="button"
          id={id ?? field?.id}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={open && enabled[active] ? `${listId}-${enabled[active].value}` : undefined}
          aria-describedby={field?.describedBy}
          aria-invalid={field?.invalid || undefined}
          disabled={disabled}
          onKeyDown={onKeyDown}
          className={cn(inputSurface, "control-md flex items-center gap-2 pl-3 pr-2 text-left", className)}
        >
          {triggerIcon && selectedOptions.length === 1 && selectedOptions[0].icon && (
            <span className="shrink-0 text-fg-3">{selectedOptions[0].icon}</span>
          )}
          <span className={cn("min-w-0 flex-1 truncate", selectedOptions.length ? "text-fg" : "text-fg-4")}>
            {triggerLabel}
          </span>
          {!multiple && (props as SingleSelectMenuProps<T>).clearable && selectedOptions.length > 0 && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear selection"
              onClick={(event) => { event.stopPropagation(); (props as SingleSelectMenuProps<T>).onChange(null); }}
              className="tap-target flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-fg-3 hover:bg-fill-2 hover:text-fg"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown size={16} className={cn("shrink-0 text-fg-3 transition-transform motion-instant", open && "rotate-180")} />
        </button>
      </PopoverTrigger>

      <PopoverContent matchWidth className={cn("p-0", menuClassName)}>
        <div ref={listRef} id={listId} role="listbox" aria-multiselectable={multiple || undefined} className="scrollbar-thin max-h-72 overflow-y-auto p-1">
          {options.length === 0 && <p className="px-2.5 py-6 text-center text-sm text-fg-3">Nothing to choose from</p>}
          {grouped.map(([group, list]) => (
            <div key={group || "_"}>
              {group && <p className="px-2.5 pb-1 pt-2 text-2xs font-medium text-fg-3">{group}</p>}
              {list.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                if (!option.disabled) index += 1;
                const isActive = !option.disabled && index === active;
                return (
                  <div
                    key={option.value}
                    id={`${listId}-${option.value}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    data-active={isActive}
                    onPointerEnter={() => !option.disabled && setActive(enabled.indexOf(option))}
                    onClick={() => select(option)}
                    className={cn(
                      "flex cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2",
                      isActive && "bg-fill-2",
                      option.disabled && "cursor-not-allowed opacity-40",
                    )}
                  >
                    {option.icon && <span className="mt-0.5 shrink-0 text-fg-3">{option.icon}</span>}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-base text-fg">{option.label}</span>
                      {option.description && <span className="block truncate text-sm text-fg-3">{option.description}</span>}
                    </span>
                    {option.meta && <span className="mt-0.5 shrink-0 text-sm text-fg-3">{option.meta}</span>}
                    {isSelected && <Check size={16} className="mt-0.5 shrink-0 text-accent" />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
