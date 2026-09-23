import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { Chip } from "./Chip";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
  count?: number;
  icon?: ReactNode;
}

export interface FilterBarProps<T extends string> {
  options: readonly FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  "aria-label"?: string;
  className?: string;
}

const FADE = 28;

/**
 * Horizontal filter row. It narrows one list by a facet; the list stays the same
 * list. When the choice changes what the screen is, that is Tabs, not a filter. Counts sit inside the chip so the row stays one line.
 * The overflow hint is a mask on the scroller, not a gradient overlay — an overlay
 * would have to know the parent's background colour, and it never does.
 */
export function FilterBar<T extends string>({ options, value, onChange, className, ...aria }: FilterBarProps<T>) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const measure = () => {
      const max = el.scrollWidth - el.clientWidth;
      setEdges({ start: el.scrollLeft > 4, end: max > 4 && el.scrollLeft < max - 4 });
    };
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [options.length]);

  const mask =
    edges.start && edges.end
      ? `linear-gradient(to right, transparent, black ${FADE}px, black calc(100% - ${FADE}px), transparent)`
      : edges.end
        ? `linear-gradient(to right, black calc(100% - ${FADE}px), transparent)`
        : edges.start
          ? `linear-gradient(to right, transparent, black ${FADE}px)`
          : undefined;

  return (
    <div
      ref={scrollerRef}
      role="radiogroup"
      aria-label={aria["aria-label"]}
      className={cn("scrollbar-none flex gap-2 overflow-x-auto pb-0.5", className)}
      style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Chip
            key={option.value}
            role="radio"
            aria-checked={selected}
            selected={selected}
            icon={option.icon}
            onClick={() => onChange(option.value)}
            className="shrink-0"
          >
            {option.label}
            {option.count !== undefined && (
              <span className={cn("tabular-nums", selected ? "text-accent/70" : "text-fg-3")}>{option.count}</span>
            )}
          </Chip>
        );
      })}
    </div>
  );
}
