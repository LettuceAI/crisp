import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";
import { useFieldContext } from "./Field";

export interface CheckboxProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Partially selected (a parent of a mixed list). */
  indeterminate?: boolean;
  /** Inline label. For label + hint layouts wrap in <Field inline>. */
  label?: ReactNode;
  size?: "sm" | "md";
}

const sizeClass = { sm: "h-4 w-4 rounded-[5px]", md: "h-5 w-5 rounded-md" };

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { checked, onChange, indeterminate, label, size = "md", disabled, className, id, ...rest },
  ref,
) {
  const field = useFieldContext();
  const on = checked || indeterminate;
  const box = (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      id={id ?? field?.id}
      aria-checked={indeterminate ? "mixed" : checked}
      aria-describedby={field?.describedBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex shrink-0 items-center justify-center border transition-colors motion-instant",
        sizeClass[size],
        on ? "border-accent bg-accent text-on-accent" : "border-line-3 bg-fill hover:border-fg-3",
        disabled && !label && "cursor-not-allowed opacity-40",
        disabled && "cursor-not-allowed",
        className,
      )}
      {...rest}
    >
      <svg viewBox="0 0 16 16" className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {indeterminate ? (
          <motion.path d="M4 8h8" initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={m.quick} />
        ) : (
          <motion.path d="M3.5 8.5l3 3 6-6.5" initial={false} animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }} transition={{ ...m.quick, ease: "easeOut" }} />
        )}
      </svg>
    </button>
  );
  if (!label) return box;
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-2.5 text-base text-fg", disabled && "cursor-not-allowed opacity-40")}>
      {box}
      <span>{label}</span>
    </label>
  );
});
