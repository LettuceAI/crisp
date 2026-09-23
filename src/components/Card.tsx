import { forwardRef, type HTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";

/* Elevation does the separating; the hairline is only there to hold an edge against a
   busy backdrop. `bordered={false}` drops it where the lift is enough on its own. */
const surface = "rounded-xl bg-surface-1";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** `raised` sits on the page; `overlay` floats above everything. */
  level?: "raised" | "overlay";
  /** A hairline edge. Off by default — elevation already separates it. */
  bordered?: boolean;
  padding?: "none" | "sm" | "md";
}

const paddingClass = { none: "", sm: "p-3", md: "p-4" };

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { level = "flat", padding = "md", className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        surface,
        level === "raised" && "bg-surface-el shadow-raised",
        paddingClass[padding],
        className,
      )}
      {...rest}
    />
  );
});

/** A clickable card is a button, not a div with onClick. */
export interface CardButtonProps extends HTMLMotionProps<"button"> {
  selected?: boolean;
  padding?: "none" | "sm" | "md";
}

export const CardButton = forwardRef<HTMLButtonElement, CardButtonProps>(function CardButton(
  { selected, padding = "md", className, type = "button", ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      aria-pressed={selected}
      whileTap={{ scale: 0.99 }}
      transition={m.instant}
      className={cn(
        surface,
        "touch-target block w-full text-left transition-[background-color,box-shadow] motion-instant",
        "hover:bg-fill-2",
        /* Chosen, not painted: accent stays the colour of things you act on. */
        selected && "ring-2 ring-inset ring-fg/30",
        paddingClass[padding],
        className,
      )}
      {...rest}
    />
  );
});
