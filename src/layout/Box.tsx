import { forwardRef, type ElementType, type ForwardedRef } from "react";
import { cn } from "../lib/cn";
import type { PolymorphicComponent, PolymorphicProps } from "../lib/polymorphic";

/**
 * The root primitive. A `div` by default; `as` swaps the element, `className` styles it.
 * Styling is Tailwind classes, not style props — that keeps one styling language across the codebase.
 */
export const Box = forwardRef(function Box<C extends ElementType = "div">(
  { as, className, ...rest }: PolymorphicProps<C>,
  ref: ForwardedRef<unknown>,
) {
  const Tag = (as ?? "div") as ElementType;
  return <Tag ref={ref} className={cn(className)} {...rest} />;
}) as PolymorphicComponent<"div">;
