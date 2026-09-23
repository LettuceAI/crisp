import { forwardRef, type ElementType, type ForwardedRef } from "react";
import { cn } from "../lib/cn";
import type { PolymorphicComponent, PolymorphicProps } from "../lib/polymorphic";

export interface ContainerOwnProps {
  /** sm 640 · md 768 · lg 1024 · xl 1280 · prose 65ch (reading column) */
  size?: "sm" | "md" | "lg" | "xl" | "prose";
  /** Drop the horizontal padding — for containers nested in something already padded. */
  flush?: boolean;
}

const sizeClass = { sm: "max-w-screen-sm", md: "max-w-screen-md", lg: "max-w-screen-lg", xl: "max-w-screen-xl", prose: "max-w-prose" };

export const Container = forwardRef(function Container<C extends ElementType = "div">(
  { as, size = "lg", flush, className, ...rest }: PolymorphicProps<C, ContainerOwnProps>,
  ref: ForwardedRef<unknown>,
) {
  const Tag = (as ?? "div") as ElementType;
  return <Tag ref={ref} className={cn("mx-auto w-full", sizeClass[size], !flush && "px-4 sm:px-6", className)} {...rest} />;
}) as PolymorphicComponent<"div", ContainerOwnProps>;
