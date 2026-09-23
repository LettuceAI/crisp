import { forwardRef, type ElementType, type ForwardedRef } from "react";
import { cn } from "../lib/cn";
import type { PolymorphicComponent, PolymorphicProps } from "../lib/polymorphic";
import { alignClass, gapClass, justifyClass, type Align, type Gap, type Justify } from "./Flex";

export interface StackOwnProps {
  gap?: Gap;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
}

function makeStack(name: string, direction: "row" | "column", defaults: Required<Pick<StackOwnProps, "gap">> & Partial<StackOwnProps>) {
  const Component = forwardRef(function Stack<C extends ElementType = "div">(
    { as, gap = defaults.gap, align = defaults.align, justify, wrap, className, ...rest }: PolymorphicProps<C, StackOwnProps>,
    ref: ForwardedRef<unknown>,
  ) {
    const Tag = (as ?? "div") as ElementType;
    return (
      <Tag
        ref={ref}
        className={cn(
          "flex",
          direction === "column" ? "flex-col" : "flex-row",
          gapClass[gap],
          align && alignClass[align],
          justify && justifyClass[justify],
          wrap && "flex-wrap",
          className,
        )}
        {...rest}
      />
    );
  }) as PolymorphicComponent<"div", StackOwnProps>;
  (Component as unknown as { displayName: string }).displayName = name;
  return Component;
}

/** Vertical rhythm. Children stretch to full width. */
export const Stack = makeStack("Stack", "column", { gap: 4 });
export const VStack = Stack;
/** Horizontal row with vertically centred children. */
export const HStack = makeStack("HStack", "row", { gap: 3, align: "center" });
