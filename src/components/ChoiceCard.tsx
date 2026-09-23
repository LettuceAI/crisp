import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface ChoiceCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  selected: boolean;
  title: ReactNode;
  description?: ReactNode;
  /** Left of the title, in a tile. */
  icon?: ReactNode;
  /** Right of the title — a badge, a price. */
  meta?: ReactNode;
  /** The selection mark: a tick for one-of-many, a box for any-of-many, or none when the border says enough. */
  indicator?: "radio" | "checkbox" | "none";
  /** Below the description — bullet lists, a form that opens once chosen. */
  children?: ReactNode;
  /** `row` puts icon, text and mark on one line; `stack` puts the icon above the text, for grids of equal cards. */
  layout?: "row" | "stack";
}

/**
 * One option among a few: a provider, a plan, a memory mode, a character to add to a
 * group. The selected border is the state, the mark confirms it, and every card in
 * a grid is the same height so the row reads as a set.
 */
export const ChoiceCard = forwardRef<HTMLButtonElement, ChoiceCardProps>(function ChoiceCard(
  { selected, title, description, icon, meta, indicator = "radio", children, layout = "row", className, type = "button", ...rest },
  ref,
) {
  const mark =
    indicator === "none" ? null : (
      <span
        aria-hidden="true"
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center border transition-colors motion-instant",
          indicator === "radio" ? "rounded-full" : "rounded-md",
          selected ? "border-accent bg-accent text-on-accent" : "border-line-3",
        )}
      >
        {selected && <Check size={12} strokeWidth={3} />}
      </span>
    );
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      className={cn(
        "flex h-full w-full rounded-2xl border bg-surface-1 p-4 text-left transition-colors motion-instant",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        selected ? "border-accent bg-accent/8" : "border-line hover:border-line-2 hover:bg-fill",
        layout === "row" ? "flex-col" : "flex-col",
        className,
      )}
      {...rest}
    >
      <span className={cn("flex w-full gap-3", layout === "row" ? "items-start" : "flex-col items-start")}>
        {icon && (
          <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", selected ? "bg-accent/15 text-accent" : "bg-fill-2 text-fg-2")}>
            {icon}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="min-w-0 flex-1 text-base font-semibold text-fg">{title}</span>
            {meta}
            {layout === "row" && mark}
          </span>
          {description && <span className="mt-0.5 block text-sm leading-snug text-fg-2">{description}</span>}
        </span>
        {layout === "stack" && mark && <span className="absolute right-4 top-4">{mark}</span>}
      </span>
      {children && <span className="mt-3 block w-full">{children}</span>}
    </button>
  );
});
