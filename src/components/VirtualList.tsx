import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "../lib/cn";

export interface VirtualListProps<T> {
  items: readonly T[];
  /** Rendered per row. Keep it cheap — it runs on every scroll frame. */
  children: (item: T, index: number) => ReactNode;
  /** Estimated row height in px; exact values are measured after mount. */
  estimateSize?: number;
  overscan?: number;
  /** Stable key per row, so React reuses the right nodes. */
  itemKey?: (item: T, index: number) => string | number;
  className?: string;
  scrollRef?: RefObject<HTMLElement | null>;
  gap?: number;
}

/**
 * Renders only the rows in view. `@tanstack/react-virtual` is already a dependency but
 * only two of the app's long-list screens use it — chat memories, logs and the model
 * browser all mount every row.
 */
export function VirtualList<T>({ items, children, estimateSize = 56, overscan = 8, itemKey, className, scrollRef, gap = 0 }: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);
  useLayoutEffect(() => {
    const parent = parentRef.current;
    const scroller = scrollRef?.current;
    if (!parent || !scroller) return;
    const measure = () => setScrollMargin(parent.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [scrollRef, items.length, estimateSize]);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef?.current ?? parentRef.current,
    scrollMargin,
    gap,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey: itemKey ? (index) => itemKey(items[index], index) : undefined,
  });

  useLayoutEffect(() => { virtualizer.measure(); }, [virtualizer, estimateSize, gap]);

  return (
    <div ref={parentRef} className={cn(!scrollRef && "scrollbar-thin overflow-y-auto", className)}>
      <div style={{ height: virtualizer.getTotalSize(), position: "relative", width: "100%" }}>
        {virtualizer.getVirtualItems().map((row) => (
          <div
            key={row.key}
            ref={virtualizer.measureElement}
            data-index={row.index}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${row.start - scrollMargin}px)` }}
          >
            {children(items[row.index], row.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
