import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/cn";
import { icon } from "../lib/icon";

export type ButtonVariant = "primary" | "tonal" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Fill the width. For two buttons sharing a row, give each `className="flex-1"` instead. */
  block?: boolean;
  children?: ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  // One per screen. Solid accent with on-accent text is the only high-emphasis surface.
  primary: "bg-accent text-on-accent hover:bg-accent/82 active:bg-accent/68",
  // The app's familiar tinted-accent CTA.
  tonal: "border border-accent/30 bg-accent/15 text-accent hover:border-accent/55 hover:bg-accent/28 active:bg-accent/38",
  secondary: "border border-line bg-fill-2 text-fg hover:border-line-3 hover:bg-fill-3 active:bg-line-2",
  ghost: "text-fg-2 hover:bg-fill-2 hover:text-fg active:bg-fill-3",
  danger: "border border-danger/25 bg-danger/12 text-danger hover:border-danger/55 hover:bg-danger/22 active:bg-danger/32",
};

/* The ring has to contrast with what it rings: accent on an accent fill disappears, and
   a green ring around a destructive button contradicts the button. */
const focusClass: Record<ButtonVariant, string> = {
  primary: "focus-visible:outline-fg",
  tonal: "focus-visible:outline-accent",
  secondary: "focus-visible:outline-fg-2",
  ghost: "focus-visible:outline-fg-2",
  danger: "focus-visible:outline-danger",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "control-sm gap-1.5 rounded-lg px-3 text-sm",
  md: "control-md gap-2 rounded-xl px-4 text-base",
  lg: "control-lg gap-2 rounded-xl px-5 text-base",
};

export const iconSize: Record<ButtonSize, number> = { sm: icon.sm, md: icon.md, lg: icon.lg };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "secondary",
    size = "md",
    loading = false,
    leading,
    trailing,
    block,
    className,
    children,
    disabled,
    type = "button",
    ...rest
  },
  ref,
) {
  const inert = disabled || loading;
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={inert || undefined}
      className={cn(
        "touch-target relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium",
        /* Depth comes from CSS, not a JS spring: one less animation to schedule per tap,
           and it survives a webview that is already busy streaming tokens. */
        variant === "ghost" ? "raise-flat" : "raise",
        "focus-visible:outline-1 focus-visible:outline-offset-2",
        focusClass[variant],
        "disabled:opacity-45",
        /* Loading keeps focus: `disabled` would drop it to the body mid-submit. */
        (loading || disabled) && "pointer-events-none",
        variantClass[variant],
        sizeClass[size],
        block && "w-full",
        className,
      )}
      {...rest}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 size={iconSize[size]} className="animate-spin" />
        </span>
      )}
      <span className={cn("inline-flex items-center gap-[inherit]", loading && "invisible")}>
        {leading}
        {children}
        {trailing}
      </span>
    </button>
  );
});
