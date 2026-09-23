import { forwardRef, useRef, type InputHTMLAttributes } from "react";
import { Search, X } from "lucide-react";
import { cn } from "../lib/cn";
import { Kbd } from "./Kbd";
import { Spinner } from "./Spinner";

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type" | "size"> {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  /** Hint the keyboard shortcut that focuses this field. Hidden once there is text. */
  shortcut?: string;
  size?: "sm" | "md";
}

/**
 * Search with a clear button and Escape-to-clear. The app repeats this markup in the
 * page header, the library, discovery and the model browser.
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { value, onChange, loading, shortcut, size = "md", placeholder = "Search", className, ...rest },
  ref,
) {
  const inner = useRef<HTMLInputElement>(null);
  return (
    <div className="relative">
      <Search size={size === "sm" ? 14 : 16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-3" />
      <input
        ref={(node) => {
          inner.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && value) {
            event.preventDefault();
            onChange("");
          }
        }}
        className={cn(
          "w-full rounded-xl border border-line bg-fill text-fg placeholder:text-fg-4",
          "transition-[border-color,background-color] motion-instant",
          "hover:border-line-2 focus:border-accent focus:bg-fill-2 focus:outline-none focus:ring-1 focus:ring-accent/35",
          "[&::-webkit-search-cancel-button]:hidden",
          size === "sm" ? "h-8 pl-8 pr-8 text-sm" : "h-10 pl-9 pr-9 text-base",
          className,
        )}
        {...rest}
      />
      {value ? (
        <button
          type="button"
          onClick={() => { onChange(""); inner.current?.focus(); }}
          aria-label="Clear search"
          className="tap-target absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-fg-3 transition-colors hover:bg-fill-2 hover:text-fg"
        >
          <X size={14} />
        </button>
      ) : loading ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2"><Spinner size="sm" /></span>
      ) : shortcut ? (
        <span className="absolute right-2 top-1/2 hidden -translate-y-1/2 hoverable:block"><Kbd>{shortcut}</Kbd></span>
      ) : null}
    </div>
  );
});
