import { forwardRef, type ElementType, type ForwardedRef } from "react";
import { cn } from "../lib/cn";
import type { PolymorphicComponent, PolymorphicProps } from "../lib/polymorphic";

export type Gap = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
export type Align = "start" | "center" | "end" | "stretch" | "baseline";
export type Justify = "start" | "center" | "end" | "between" | "around" | "evenly";

/* Static maps: Tailwind only ships classes it can see in source. */
export const gapClass: Record<Gap, string> = {
  0: "gap-0", 0.5: "gap-0.5", 1: "gap-1", 1.5: "gap-1.5", 2: "gap-2", 2.5: "gap-2.5", 3: "gap-3",
  4: "gap-4", 5: "gap-5", 6: "gap-6", 8: "gap-8", 10: "gap-10", 12: "gap-12", 16: "gap-16",
};
export const alignClass: Record<Align, string> = {
  start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch", baseline: "items-baseline",
};
export const justifyClass: Record<Justify, string> = {
  start: "justify-start", center: "justify-center", end: "justify-end",
  between: "justify-between", around: "justify-around", evenly: "justify-evenly",
};

export interface FlexOwnProps {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  gap?: Gap;
  inline?: boolean;
}

const directionClass = {
  row: "flex-row", column: "flex-col", "row-reverse": "flex-row-reverse", "column-reverse": "flex-col-reverse",
};

export const Flex = forwardRef(function Flex<C extends ElementType = "div">(
  { as, direction = "row", align, justify, wrap, gap, inline, className, ...rest }: PolymorphicProps<C, FlexOwnProps>,
  ref: ForwardedRef<unknown>,
) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag
      ref={ref}
      className={cn(
        inline ? "inline-flex" : "flex",
        directionClass[direction],
        align && alignClass[align],
        justify && justifyClass[justify],
        wrap && "flex-wrap",
        gap !== undefined && gapClass[gap],
        className,
      )}
      {...rest}
    />
  );
}) as PolymorphicComponent<"div", FlexOwnProps>;
