import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";
import { icon } from "../lib/icon";
import { IconButton } from "./IconButton";

export interface ShelfProps {
  /** One node per item; each is given the same width. */
  children: ReactNode[];
  /** Item width — a Tailwind width class. */
  itemClassName?: string;
  /** Bleed to the container's edges so the first item starts at the page margin. */
  bleed?: boolean;
  "aria-label": string;
  className?: string;
}

/**
 * A row that scrolls sideways: swipe on touch, arrows where there is a pointer, and
 * the ends fade to say there is more. Discover's shelves, image variants, the guide's
 * screenshots — anything that is a set laid side by side.
 */
export function Shelf({ children, itemClassName = "w-40", bleed = true, className, ...aria }: ShelfProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setEdges({ start: el.scrollLeft > 4, end: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", measure); ro.disconnect(); };
  }, [children.length]);

  const page = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  const mask =
    edges.start && edges.end ? "linear-gradient(90deg, transparent, black 32px, black calc(100% - 32px), transparent)"
    : edges.start ? "linear-gradient(90deg, transparent, black 32px)"
    : edges.end ? "linear-gradient(90deg, black calc(100% - 32px), transparent)"
    : undefined;

  return (
    <div className={cn("group/shelf relative", className)}>
      <div
        ref={ref}
        role="list"
        aria-label={aria["aria-label"]}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        className={cn("flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", bleed && "-mx-4 px-4 @xl:-mx-6 @xl:px-6")}
      >
        {children.map((child, i) => (
          <div key={i} role="listitem" className={cn("shrink-0 snap-start", itemClassName)}>{child}</div>
        ))}
      </div>
      {/* Arrows only where a finger can't swipe. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between [@media(pointer:fine)]:flex">
        <IconButton label="Scroll back" variant="secondary" shape="round" className={cn("pointer-events-auto -ml-2 shadow-raised transition-opacity", edges.start ? "opacity-0 group-hover/shelf:opacity-100" : "opacity-0")} onClick={() => page(-1)} tabIndex={edges.start ? 0 : -1}>
          <ChevronLeft size={icon.lg} />
        </IconButton>
        <IconButton label="Scroll forward" variant="secondary" shape="round" className={cn("pointer-events-auto -mr-2 shadow-raised transition-opacity", edges.end ? "opacity-0 group-hover/shelf:opacity-100" : "opacity-0")} onClick={() => page(1)} tabIndex={edges.end ? 0 : -1}>
          <ChevronRight size={icon.lg} />
        </IconButton>
      </div>
    </div>
  );
}
