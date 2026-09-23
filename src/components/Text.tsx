import { createElement, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * The type roles. Every piece of text in the app should be one of these;
 * if it isn't, that's a new role to add here, not a one-off class.
 */
export type TextVariant =
  | "hero"      // 48–60 bold — a first-run or marketing headline, one per screen
  | "display"   // 36 bold — a big statement inside the app (an empty home, a wizard's first screen)
  | "page"      // 28/34 bold  — page title
  | "section"   // 20/26 semibold — section heading
  | "title"     // 16/22 semibold — card / row / sheet title
  | "body"      // 14/20 — default
  | "secondary" // 14/20 fg-2 — supporting copy
  | "label"     // 13/18 medium fg-2 — form labels
  | "hint"      // 13/18 fg-3 — hints, meta
  | "caption";  // 11/14 fg-3 — timestamps, counts

const variantClass: Record<TextVariant, string> = {
  hero: "text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-fg @3xl:text-6xl",
  display: "text-4xl font-bold leading-[1.1] tracking-tight text-fg",
  page: "text-3xl font-bold tracking-tight text-fg",
  section: "text-xl font-semibold tracking-tight text-fg",
  title: "text-lg font-semibold text-fg",
  body: "text-base text-fg",
  secondary: "text-base text-fg-2",
  label: "text-sm font-medium text-fg-2",
  hint: "text-sm text-fg-3",
  caption: "text-2xs text-fg-3",
};

const defaultTag: Record<TextVariant, keyof HTMLElementTagNameMap> = {
  hero: "h1",
  display: "h1",
  page: "h1",
  section: "h2",
  title: "h3",
  body: "p",
  secondary: "p",
  label: "span",
  hint: "p",
  caption: "span",
};

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  as?: keyof HTMLElementTagNameMap;
  children?: ReactNode;
}

export function Text({ variant = "body", as, className, ...rest }: TextProps) {
  return createElement(as ?? defaultTag[variant], {
    className: cn(variantClass[variant], className),
    ...rest,
  });
}
