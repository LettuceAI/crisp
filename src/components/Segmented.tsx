import { useId, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
}

export interface SegmentedProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  block?: boolean;
  "aria-label"?: string;
  className?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  block,
  className,
  ...aria
}: SegmentedProps<T>) {
  const layoutId = useId();

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = options.findIndex((option) => option.value === value);
    if (index < 0) return;
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = options[(index + delta + options.length) % options.length];
    onChange(next.value);
    (event.currentTarget.querySelector<HTMLButtonElement>(`[data-value="${next.value}"]`))?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={aria["aria-label"]}
      onKeyDown={onKeyDown}
      className={cn(
        "inline-flex rounded-xl border border-line bg-fill p-1",
        block && "flex w-full",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            data-value={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors motion-instant",
              size === "sm" ? "h-7 px-2.5 text-sm" : "h-8 px-3.5 text-sm",
              block && "flex-1",
              selected ? "text-fg" : "text-fg-3 hover:text-fg-2",
            )}
          >
            {selected && (
              <motion.span
                layoutId={layoutId}
                transition={m.settle}
                className="absolute inset-0 rounded-lg bg-fill-3 shadow-sm"
              />
            )}
            <span className="relative inline-flex items-center gap-1.5">
              {option.icon}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
