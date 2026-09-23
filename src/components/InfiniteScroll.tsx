import { useEffect, useRef } from "react";
import { cn } from "../lib/cn";
import { Spinner } from "./Spinner";

export interface InfiniteScrollProps {
  /** Called when the sentinel comes near the viewport. Guard against re-entry yourself. */
  onLoadMore: () => void;
  /** Stop observing — nothing left, or a request is in flight. */
  disabled?: boolean;
  loading?: boolean;
  /** Shown once there is nothing more to fetch. */
  endMessage?: string;
  /** How far ahead of the viewport to trigger. Default 600px. */
  rootMargin?: string;
  className?: string;
}

/** Sentinel for "load the next page". Pair with VirtualList for very long lists. */
export function InfiniteScroll({
  onLoadMore, disabled = false, loading = false, endMessage, rootMargin = "600px", className,
}: InfiniteScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const callback = useRef(onLoadMore);
  callback.current = onLoadMore;

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) callback.current();
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [disabled, rootMargin]);

  return (
    <div className={cn("flex items-center justify-center py-6", className)}>
      <div ref={ref} className="h-px w-px" aria-hidden="true" />
      {loading && <Spinner label="Loading more" />}
      {!loading && disabled && endMessage && <p className="text-sm text-fg-3">{endMessage}</p>}
    </div>
  );
}
