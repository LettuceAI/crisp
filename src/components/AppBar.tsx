import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Search, X } from "lucide-react";
import { cn } from "../lib/cn";
import { IconButton } from "./IconButton";
import { Input } from "./Input";

export interface AppBarProps {
  title: ReactNode;
  /** Small text after the title — a count, a status. */
  meta?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  /** Renders a search field on desktop and a search icon that expands on compact. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  actions?: ReactNode;
  /** A filter row under the title. */
  filters?: ReactNode;
  /**
   * Shrink the title when the page scrolls. Pass the scrolling element;
   * defaults to the window.
   */
  scrollRef?: React.RefObject<HTMLElement | null>;
  /** Desktop window chrome sits above; leave room for it. */
  inset?: boolean;
  className?: string;
}

/**
 * The page header. One component for both platforms: on desktop the title is large
 * and search is always visible; on compact it condenses on scroll and search expands
 * from an icon, because a permanent search field costs a third of a phone's width.
 */
export function AppBar({
  title, meta, onBack, backLabel = "Back", searchValue, onSearchChange, searchPlaceholder = "Search",
  actions, filters, scrollRef, inset, className,
}: AppBarProps) {
  const [condensed, setCondensed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const target = scrollRef?.current ?? window;
    const read = () => (scrollRef?.current ? scrollRef.current.scrollTop : window.scrollY);
    const onScroll = () => setCondensed(read() > 12);
    onScroll();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [scrollRef]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const searchField = onSearchChange && (
    <Input
      ref={searchRef}
      value={searchValue ?? ""}
      onChange={(event) => onSearchChange(event.target.value)}
      placeholder={searchPlaceholder}
      aria-label={searchPlaceholder}
      leading={<Search size={16} />}
      trailing={
        searchValue ? (
          <IconButton label="Clear search" size="sm" onClick={() => onSearchChange("")}>
            <X size={14} />
          </IconButton>
        ) : undefined
      }
      className="h-9"
    />
  );

  return (
    <header
      className={cn(
        "@container sticky top-0 z-30 bg-surface/90 backdrop-blur-md transition-shadow",
        condensed && "border-b border-line",
        inset && "pt-[var(--safe-top)]",
        className,
      )}
    >
      <div className="px-4 @xl:px-6">
        {/* Compact: search replaces the row when open, so the title never squeezes. */}
        {searchOpen && onSearchChange ? (
          <div className="flex items-center gap-2 py-2.5 @xl:hidden">
            <div className="min-w-0 flex-1">{searchField}</div>
            <IconButton label="Close search" onClick={() => { setSearchOpen(false); onSearchChange(""); }}>
              <X size={18} />
            </IconButton>
          </div>
        ) : (
          <div className={cn("flex items-center gap-2 transition-[padding] motion-quick", condensed ? "py-2" : "py-3 @xl:py-4")}>
            {onBack && (
              <IconButton label={backLabel} shape="round" onClick={onBack} className="-ml-1 shrink-0">
                <ArrowLeft size={18} />
              </IconButton>
            )}
            <div className="flex min-w-0 flex-1 items-baseline gap-2">
              <h1
                className={cn(
                  "truncate font-bold tracking-tight text-fg transition-[font-size] motion-quick",
                  condensed ? "text-lg" : "text-xl @xl:text-3xl",
                )}
              >
                {title}
              </h1>
              {meta && <span className="shrink-0 text-sm text-fg-3">{meta}</span>}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {onSearchChange && (
                <>
                  <div className="hidden w-64 @xl:block @3xl:w-80">{searchField}</div>
                  <IconButton label="Search" className="@xl:hidden" onClick={() => setSearchOpen(true)}>
                    <Search size={18} />
                  </IconButton>
                </>
              )}
              {actions}
            </div>
          </div>
        )}
        {filters && <div className="pb-3">{filters}</div>}
      </div>
    </header>
  );
}
