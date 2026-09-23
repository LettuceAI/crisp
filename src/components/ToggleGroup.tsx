import { type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface ToggleOption<T extends string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps<T extends string> {
  options: readonly ToggleOption<T>[];
  value: readonly T[];
  onChange: (value: T[]) => void;
  /** Require at least one selection. */
  min?: number;
  size?: "sm" | "md";
  "aria-label": string;
  className?: string;
}

/**
 * Multi-select toggles. Segmented picks exactly one; this picks any number —
 * text formatting, which sources a filter includes, which providers to query.
 */
export function ToggleGroup<T extends string>({ options, value, onChange, min = 0, size = "md", className, ...aria }: ToggleGroupProps<T>) {
  const toggle = (option: ToggleOption<T>) => {
    if (option.disabled) return;
    const on = value.includes(option.value);
    if (on && value.length <= min) return;
    onChange(on ? value.filter((v) => v !== option.value) : [...value, option.value]);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not([disabled])"));
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    event.preventDefault();
    buttons[(index + delta + buttons.length) % buttons.length]?.focus();
  };

  return (
    <div role="group" aria-label={aria["aria-label"]} onKeyDown={onKeyDown} className={cn("inline-flex rounded-xl border border-line bg-fill p-1", className)}>
      {options.map((option) => {
        const on = value.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={on}
            disabled={option.disabled}
            onClick={() => toggle(option)}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors motion-instant",
              size === "sm" ? "h-7 px-2.5 text-sm" : "h-8 px-3 text-sm",
              on ? "bg-fill-3 text-fg" : "text-fg-3 hover:text-fg-2",
              option.disabled && "pointer-events-none opacity-40",
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
