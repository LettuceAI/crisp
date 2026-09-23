import { createElement, type ComponentType } from "react";
import { cn } from "../lib/cn";

/**
 * Four icon sizes, and only four. The app uses fifteen — from 9px to 36px — in two
 * different notations (`size={14}` and `className="h-4 w-4"`). Going through this
 * component makes that impossible to drift back into.
 */
export const ICON_SIZE = {
  /** 14 — inside dense controls, badges, chips. */
  sm: 14,
  /** 16 — buttons, list rows, inline with body text. */
  md: 16,
  /** 18 — icon buttons, toolbars. */
  lg: 18,
  /** 22 — navigation, empty states. */
  xl: 22,
} as const;

export type IconSize = keyof typeof ICON_SIZE;

export interface IconProps {
  /** A lucide icon component. */
  as: ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean }>;
  size?: IconSize;
  /** Give it a label only when the icon is the sole carrier of meaning. */
  label?: string;
  strokeWidth?: number;
  className?: string;
}

export function Icon({ as: Component, size = "md", label, strokeWidth = 2, className }: IconProps) {
  return createElement(Component, {
    size: ICON_SIZE[size],
    strokeWidth,
    "aria-hidden": label ? undefined : true,
    ...(label ? { role: "img", "aria-label": label } : {}),
    className: cn("shrink-0", className),
  });
}
