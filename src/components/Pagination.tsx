import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  /** How many numbers to show around the current page. */
  siblings?: number;
  className?: string;
}

function range(from: number, to: number) {
  return Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
}

/** Numbered paging, for lists where "load more" loses your place — logs, search results. */
export function Pagination({ page, pageCount, onChange, siblings = 1, className }: PaginationProps) {
  if (pageCount <= 1) return null;

  const start = Math.max(2, page - siblings);
  const end = Math.min(pageCount - 1, page + siblings);
  const items: (number | "gap")[] = [
    1,
    ...(start > 2 ? (["gap"] as const) : []),
    ...range(start, end),
    ...(end < pageCount - 1 ? (["gap"] as const) : []),
    ...(pageCount > 1 ? [pageCount] : []),
  ];

  const step = (delta: number) => onChange(Math.min(pageCount, Math.max(1, page + delta)));

  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="touch-target flex h-8 w-8 items-center justify-center rounded-lg text-fg-3 transition-colors hover:bg-fill-2 hover:text-fg disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronLeft size={16} />
      </button>
      {items.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} aria-hidden="true" className="px-1 text-sm text-fg-4">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
            aria-label={`Page ${item}`}
            className={cn(
              "touch-target h-8 min-w-8 rounded-lg px-2 text-sm tabular-nums transition-colors",
              item === page ? "bg-fill-3 font-medium text-fg" : "text-fg-3 hover:bg-fill-2 hover:text-fg",
            )}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => step(1)}
        disabled={page >= pageCount}
        aria-label="Next page"
        className="touch-target flex h-8 w-8 items-center justify-center rounded-lg text-fg-3 transition-colors hover:bg-fill-2 hover:text-fg disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
