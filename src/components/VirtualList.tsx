import { useRef, type ReactNode } from "react";
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
}

/**
 * Renders only the rows in view. `@tanstack/react-virtual` is already a dependency but
 * only two of the app's long-list screens use it — chat memories, logs and the model
 * browser all mount every row.
 */
export function VirtualList<T>({ items, children, estimateSize = 56, overscan = 8, itemKey, className }: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey: itemKey ? (index) => itemKey(items[index], index) : undefined,
  });

  return (
    <div ref={parentRef} className={cn("scrollbar-thin overflow-y-auto", className)}>
      <div style={{ height: virtualizer.getTotalSize(), position: "relative", width: "100%" }}>
        {virtualizer.getVirtualItems().map((row) => (
          <div
            key={row.key}
            ref={virtualizer.measureElement}
            data-index={row.index}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${row.start}px)` }}
          >
            {children(items[row.index], row.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
