import { forwardRef, type ElementType, type ForwardedRef } from "react";
import { cn } from "../lib/cn";
import type { PolymorphicComponent, PolymorphicProps } from "../lib/polymorphic";
import { gapClass, type Gap } from "./Flex";

export type Columns = 1 | 2 | 3 | 4 | 5 | 6 | 12;
export type Breakpoint = "base" | "sm" | "md" | "lg" | "xl";
export type ResponsiveColumns = Columns | Partial<Record<Breakpoint, Columns>>;

const colsClass: Record<Breakpoint, Record<Columns, string>> = {
  base: { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6", 12: "grid-cols-12" },
  sm: { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5", 6: "sm:grid-cols-6", 12: "sm:grid-cols-12" },
  md: { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4", 5: "md:grid-cols-5", 6: "md:grid-cols-6", 12: "md:grid-cols-12" },
  lg: { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-6", 12: "lg:grid-cols-12" },
  xl: { 1: "xl:grid-cols-1", 2: "xl:grid-cols-2", 3: "xl:grid-cols-3", 4: "xl:grid-cols-4", 5: "xl:grid-cols-5", 6: "xl:grid-cols-6", 12: "xl:grid-cols-12" },
};

export interface GridOwnProps {
  /** A number, or per-breakpoint: `{ base: 1, sm: 2, lg: 3 }`. */
  columns?: ResponsiveColumns;
  gap?: Gap;
  /** Auto-fit columns with a minimum track width — for card grids that should just flow. */
  minChildWidth?: string;
}

export const Grid = forwardRef(function Grid<C extends ElementType = "div">(
  { as, columns, gap = 4, minChildWidth, className, style, ...rest }: PolymorphicProps<C, GridOwnProps>,
  ref: ForwardedRef<unknown>,
) {
  const Tag = (as ?? "div") as ElementType;
  const columnClasses =
    columns === undefined
      ? null
      : typeof columns === "number"
        ? colsClass.base[columns]
        : (Object.entries(columns) as [Breakpoint, Columns][]).map(([bp, n]) => colsClass[bp][n]);
  return (
    <Tag
      ref={ref}
      className={cn("grid", gapClass[gap], columnClasses, className)}
      style={minChildWidth ? { gridTemplateColumns: `repeat(auto-fit, minmax(min(${minChildWidth}, 100%), 1fr))`, ...style } : style}
      {...rest}
    />
  );
}) as PolymorphicComponent<"div", GridOwnProps>;
