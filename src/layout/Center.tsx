import { forwardRef, type ElementType, type ForwardedRef } from "react";
import { cn } from "../lib/cn";
import type { PolymorphicComponent, PolymorphicProps } from "../lib/polymorphic";

export const Center = forwardRef(function Center<C extends ElementType = "div">(
  { as, className, ...rest }: PolymorphicProps<C>,
  ref: ForwardedRef<unknown>,
) {
  const Tag = (as ?? "div") as ElementType;
  return <Tag ref={ref} className={cn("flex items-center justify-center", className)} {...rest} />;
}) as PolymorphicComponent<"div">;
