import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../lib/cn";
import { icon } from "../lib/icon";
import { Badge } from "./Badge";
import { useCrispStrings } from "../lib/strings";

export interface PromptSuggestionItem {
  id: string;
  /** Short headline shown prominently, e.g. "Summarize PDF", "Draft reply". */
  title: string;
  /** Complete prompt string passed to composer/model. */
  prompt: string;
  /** Supporting subtitle or description. */
  description?: string;
  /** Icon shown at top-left. */
  icon?: ReactNode;
  /** Category badge, e.g. "Creative", "Code", "Analysis". */
  badge?: string;
}

export interface PromptSuggestionsProps {
  prompts: readonly PromptSuggestionItem[];
  onSelect: (prompt: string, item: PromptSuggestionItem) => void;
  title?: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const colClass = {
  1: "grid-cols-1",
  2: "grid-cols-1 @sm:grid-cols-2",
  3: "grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3",
  4: "grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4",
};

/**
 * Suggested prompt starter cards for empty chat states and onboarding.
 * Helps users discover model capabilities without staring at an empty input.
 */
export function PromptSuggestions({
  prompts,
  onSelect,
  title,
  columns = 2,
  className,
}: PromptSuggestionsProps) {
  const { strings: t } = useCrispStrings();
  const header = title ?? (
    <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-fg-3">
      <Sparkles size={icon.xs} className="text-accent" />
      <span>{t.promptSuggestionsTitle}</span>
    </span>
  );

  return (
    <div className={cn("@container w-full space-y-3", className)}>
      {header && <div>{header}</div>}
      <div className={cn("grid gap-2.5", colClass[columns])}>
        {prompts.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.prompt, item)}
            className={cn(
              "raise touch-target group relative flex flex-col items-start gap-1.5 rounded-xl border border-line bg-surface-1 p-3.5 text-left transition-colors motion-instant",
              "hover:border-accent/40 hover:bg-fill-2 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-fg",
            )}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-surface-2 text-fg-2 transition-colors group-hover:border-accent/40 group-hover:text-accent">
                {item.icon ?? <Sparkles size={icon.sm} />}
              </span>
              {item.badge && (
                <Badge tone="secondary" className="shrink-0">
                  {item.badge}
                </Badge>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-0.5 pt-0.5">
              <p className="line-clamp-1 text-sm font-semibold text-fg transition-colors group-hover:text-accent">
                {item.title}
              </p>
              {item.description && (
                <p className="line-clamp-2 text-xs leading-relaxed text-fg-3">
                  {item.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

PromptSuggestions.displayName = "PromptSuggestions";
