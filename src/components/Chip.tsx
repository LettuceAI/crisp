import type { ButtonHTMLAttributes, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../lib/cn";

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  /** Filter chip: toggles. Without `selected` it's a plain tag. */
  selected?: boolean;
  /** Removable tag: renders an × and calls this. */
  onRemove?: () => void;
  icon?: ReactNode;
  children: ReactNode;
}

/** Tags and filters. Badge is read-only; Chip is something you tap. */
export function Chip({ selected, onRemove, icon, className, children, ...rest }: ChipProps) {
  const base = cn(
    "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors motion-instant",
    selected ? "border-accent/40 bg-accent/15 text-accent" : "border-line-2 bg-fill text-fg-2 hover:border-line-3 hover:bg-fill-2 hover:text-fg",
    className,
  );
  if (onRemove) {
    return (
      <span className={cn(base, "pr-1")}>
        {icon}
        {children}
        <button type="button" onClick={onRemove} aria-label="Remove" className="tap-target ml-0.5 flex h-5 w-5 items-center justify-center rounded-full hover:bg-fill-3">
          <X size={12} />
        </button>
      </span>
    );
  }
  return (
    <button type="button" aria-pressed={selected} className={base} {...rest}>
      {icon}
      {children}
    </button>
  );
}
