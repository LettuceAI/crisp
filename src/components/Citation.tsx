import { useState } from "react";
import { ExternalLink, Globe } from "lucide-react";
import { cn } from "../lib/cn";
import { icon } from "../lib/icon";
import { useCompactLayout } from "../lib/useMediaQuery";
import { HoverCard } from "./HoverCard";
import { Sheet } from "./Sheet";
import { useCrispStrings } from "../lib/strings";

export interface CitationProps {
  /** Numeric position or brief source tag: 1, 2, "arXiv", "docs". */
  index: number | string;
  /** Full document title or webpage header. */
  title: string;
  /** Direct URL to the source. */
  url?: string;
  /** Key excerpt or snippet used for model grounding. */
  snippet?: string;
  /** Domain name (e.g. "wikipedia.org") or publisher. */
  domain?: string;
  /** Optional custom icon or favicon URL. */
  favicon?: string;
  className?: string;
}

/**
 * An inline citation for retrieved context and RAG sources.
 * Reveals a hover card on desktop and opens a bottom sheet on mobile.
 */
export function Citation({ index, title, url, snippet, domain, favicon, className }: CitationProps) {
  const { strings: t } = useCrispStrings();
  const compact = useCompactLayout();
  const [sheetOpen, setSheetOpen] = useState(false);

  const resolvedDomain = domain ?? (url ? (() => {
    try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return undefined; }
  })() : undefined);

  const badge = (
    <button
      type="button"
      onClick={compact ? () => setSheetOpen(true) : undefined}
      aria-label={t.citationSource(title)}
      className={cn(
        "tap-target inline-flex items-center justify-center font-mono text-2xs font-semibold leading-none",
        "mx-0.5 -translate-y-0.5 rounded px-1.5 py-0.5 align-baseline transition-colors motion-instant",
        "border border-line bg-fill-2 text-fg-2 hover:border-accent/40 hover:bg-fill-3 hover:text-accent",
        className,
      )}
    >
      {index}
    </button>
  );

  const preview = (
    <div className="space-y-2 p-1">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line bg-surface-1 text-fg-3">
          {favicon ? (
            <img src={favicon} alt="" className="h-4 w-4 rounded-sm object-contain" />
          ) : (
            <Globe size={icon.xs} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold text-fg">{title}</p>
          {resolvedDomain && <p className="text-2xs text-fg-3">{resolvedDomain}</p>}
        </div>
      </div>
      {snippet && (
        <p className="line-clamp-3 rounded-lg border border-line-2 bg-fill p-2 text-xs leading-relaxed text-fg-2">
          “{snippet}”
        </p>
      )}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
        >
          <span>{t.citationVisit}</span>
          <ExternalLink size={12} />
        </a>
      )}
    </div>
  );

  if (compact) {
    return (
      <>
        {badge}
        <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={`[${index}] ${resolvedDomain ?? "Source"}`}>
          <div className="pb-2">{preview}</div>
        </Sheet>
      </>
    );
  }

  return (
    <HoverCard content={<div className="w-72">{preview}</div>}>
      {badge}
    </HoverCard>
  );
}

Citation.displayName = "Citation";
