import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

export type IconButtonVariant = "ghost" | "secondary" | "tonal";
export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Required: icon buttons have no visible text. */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /** Round for standalone (close, back); square inside toolbars. */
  shape?: "square" | "round";
  active?: boolean;
  children: ReactNode;
}

const variantClass: Record<IconButtonVariant, string> = {
  ghost: "text-fg-2 hover:bg-fill-2 hover:text-fg active:bg-fill-3",
  secondary: "border border-line bg-fill text-fg-2 hover:border-line-3 hover:bg-fill-2 hover:text-fg active:bg-fill-3",
  tonal: "border border-accent/30 bg-accent/15 text-accent hover:border-accent/55 hover:bg-accent/28 active:bg-accent/38",
};

const sizeClass: Record<IconButtonSize, string> = {
  sm: "control-sm w-8",
  md: "control-md w-10",
  lg: "control-lg w-11",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = "ghost", size = "md", shape = "square", active, className, disabled, type = "button", children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      className={cn(
        "touch-target inline-flex shrink-0 select-none items-center justify-center",
        variant === "ghost" ? "raise-flat" : "raise",
        "focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-fg-2",
        "disabled:pointer-events-none disabled:opacity-45",
        shape === "round" ? "rounded-full" : "rounded-lg",
        variantClass[variant],
        sizeClass[size],
        active && "bg-fill-2 text-fg",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
