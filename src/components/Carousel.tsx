import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface CarouselProps {
  /** One node per slide. */
  children: ReactNode[];
  /** Dots and arrows. Arrows are hidden where there is no pointer. */
  controls?: boolean;
  "aria-label": string;
  className?: string;
  slideClassName?: string;
}

/**
 * A horizontal pager built on native scroll-snap: swipe on touch, arrows and keys on
 * desktop, and it keeps working with JavaScript busy. Onboarding, feature tours,
 * image variants.
 */
export function Carousel({ children, controls = true, className, slideClassName, ...aria }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = children.length;

  const scrollTo = useCallback((next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(next, count - 1));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  }, [count]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      if (track.clientWidth === 0) return;
      setIndex(Math.round(track.scrollLeft / track.clientWidth));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={cn("relative", className)} role="group" aria-roledescription="carousel" aria-label={aria["aria-label"]}>
      <div
        ref={trackRef}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); scrollTo(index + 1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); scrollTo(index - 1); }
        }}
        className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto rounded-xl outline-none"
      >
        {children.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            className={cn("w-full shrink-0 snap-center", slideClassName)}
          >
            {slide}
          </div>
        ))}
      </div>

      {controls && count > 1 && (
        <>
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {children.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={cn("h-1.5 rounded-full transition-all motion-slow", i === index ? "w-5 bg-accent" : "w-1.5 bg-fill-3 hover:bg-line-3")}
              />
            ))}
          </div>
          {/* Arrows only where a pointer can reach them; touch has the swipe. */}
          <button
            type="button"
            onClick={() => scrollTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface-el/90 text-fg-2 backdrop-blur-md transition-colors hover:text-fg disabled:opacity-0 hoverable:flex"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollTo(index + 1)}
            disabled={index === count - 1}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface-el/90 text-fg-2 backdrop-blur-md transition-colors hover:text-fg disabled:opacity-0 hoverable:flex"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  );
}
