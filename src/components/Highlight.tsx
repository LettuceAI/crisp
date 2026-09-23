import { useMemo, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface HighlightProps {
  children: string;
  /** The search term(s) to mark. Empty renders the text untouched. */
  query: string;
  /** Treat the query as separate words rather than one phrase. */
  words?: boolean;
  className?: string;
  markClassName?: string;
}

function escape(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Marks the matching part of a search result. Uses `<mark>`, so a screen reader
 * announces the match rather than it being colour-only — which is what a span would be.
 */
export function Highlight({ children, query, words, className, markClassName }: HighlightProps) {
  const parts = useMemo<ReactNode[]>(() => {
    const trimmed = query.trim();
    if (!trimmed) return [children];

    const terms = words ? trimmed.split(/\s+/).filter(Boolean) : [trimmed];
    const pattern = new RegExp(`(${terms.map(escape).join("|")})`, "gi");
    return children.split(pattern).map((piece, index) =>
      index % 2 === 1 ? (
        <mark key={index} className={cn("rounded-[3px] bg-accent/25 px-0.5 text-fg", markClassName)}>
          {piece}
        </mark>
      ) : (
        piece
      ),
    );
  }, [children, query, words, markClassName]);

  return <span className={className}>{parts}</span>;
}
