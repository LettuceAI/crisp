import { useRef, useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "../lib/cn";
import { useFieldContext } from "./Field";
import { inputSurface } from "./Input";

export interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  /** Refuse tags past this many. */
  max?: number;
  /** Characters that also commit a tag, besides Enter. Default comma. */
  separators?: readonly string[];
  disabled?: boolean;
  id?: string;
  className?: string;
}

/**
 * Tags as chips instead of a comma-separated string — character tags are a plain text
 * field today, so "sci-fi, fantasy" is one value the app has to split on read.
 * Enter or a separator commits; Backspace on an empty input removes the last one.
 */
export function TagInput({
  value, onChange, placeholder = "Add a tag…", max, separators = [","], disabled, id, className,
}: TagInputProps) {
  const field = useFieldContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");

  const commit = (raw: string) => {
    const tag = raw.trim();
    if (!tag || value.includes(tag)) return setDraft("");
    if (max !== undefined && value.length >= max) return;
    onChange([...value, tag]);
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || separators.includes(event.key)) {
      event.preventDefault();
      commit(draft);
      return;
    }
    if (event.key === "Backspace" && !draft && value.length) {
      event.preventDefault();
      onChange(value.slice(0, -1));
    }
  };

  const full = max !== undefined && value.length >= max;

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={cn(
        inputSurface,
        "flex min-h-[var(--control-md)] cursor-text flex-wrap items-center gap-1.5 px-2 py-1.5",
        "focus-within:border-accent/50 focus-within:bg-fill-2",
        disabled && "pointer-events-none opacity-40",
        className,
      )}
    >
      {value.map((tag) => (
        <span key={tag} className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-line-2 bg-fill-2 pl-2.5 pr-1 text-xs font-medium text-fg-2">
          {tag}
          <button
            type="button"
            onClick={(event) => { event.stopPropagation(); onChange(value.filter((t) => t !== tag)); }}
            aria-label={`Remove ${tag}`}
            className="tap-target flex h-4 w-4 items-center justify-center rounded-full text-fg-3 transition-colors hover:bg-fill-3 hover:text-fg"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        id={id ?? field?.id}
        value={draft}
        disabled={disabled || full}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => commit(draft)}
        placeholder={full ? `Limit of ${max} reached` : value.length ? "" : placeholder}
        aria-describedby={field?.describedBy}
        className="min-w-24 flex-1 bg-transparent px-1 text-base text-fg outline-none placeholder:text-fg-4"
      />
    </div>
  );
}
