import { Children, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface MasonryProps {
  children: ReactNode;
  /** Smallest acceptable column width; the count follows the container. */
  minColumnWidth?: number;
  /** Hard cap on columns. */
  maxColumns?: number;
  gap?: number;
  className?: string;
}

/**
 * A column layout for items of uneven height — the image library, where a square grid
 * crops every portrait. Balances by placing each item in the shortest column, which
 * keeps DOM order per column and so keeps tab order sane.
 */
export function Masonry({ children, minColumnWidth = 180, maxColumns = 6, gap = 8, className }: MasonryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const columnCount = Math.max(1, Math.min(maxColumns, Math.floor((width + gap) / (minColumnWidth + gap)) || 1));

  const columns = useMemo(() => {
    const items = Children.toArray(children);
    const buckets: ReactNode[][] = Array.from({ length: columnCount }, () => []);
    items.forEach((item, index) => buckets[index % columnCount].push(item));
    return buckets;
  }, [children, columnCount]);

  return (
    <div ref={ref} className={cn("flex w-full items-start", className)} style={{ gap }}>
      {columns.map((column, index) => (
        <div key={index} className="flex min-w-0 flex-1 flex-col" style={{ gap }}>
          {column}
        </div>
      ))}
    </div>
  );
}
