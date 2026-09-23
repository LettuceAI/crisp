import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface ScrollAreaProps {
  /** Which way it scrolls. */
  axis?: "y" | "x";
  /** Fade the edge that has more content behind it. */
  fade?: boolean;
  /** Show a thin scrollbar instead of hiding it. */
  bar?: boolean;
  className?: string;
  children: ReactNode;
}

const FADE = 28;

/**
 * A scroll container that says when there is more. The fade is a mask on the content,
 * not a gradient overlay — an overlay would have to know the parent's background colour,
 * and over a photo or a gradient it never does.
 */
export function ScrollArea({ axis = "y", fade = true, bar = false, className, children }: ScrollAreaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el || !fade) return;
    const measure = () => {
      const pos = axis === "y" ? el.scrollTop : el.scrollLeft;
      const max = axis === "y" ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth;
      setEdges({ start: pos > 4, end: max > 4 && pos < max - 4 });
    };
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    Array.from(el.children).forEach((child) => observer.observe(child));
    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [axis, fade]);

  const dir = axis === "y" ? "to bottom" : "to right";
  const mask =
    !fade || (!edges.start && !edges.end)
      ? undefined
      : edges.start && edges.end
        ? `linear-gradient(${dir}, transparent, black ${FADE}px, black calc(100% - ${FADE}px), transparent)`
        : edges.end
          ? `linear-gradient(${dir}, black calc(100% - ${FADE}px), transparent)`
          : `linear-gradient(${dir}, transparent, black ${FADE}px)`;

  return (
    <div
      ref={ref}
      className={cn(axis === "y" ? "overflow-y-auto" : "overflow-x-auto", bar ? "scrollbar-thin" : "scrollbar-none", className)}
      style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
    >
      {children}
    </div>
  );
}
