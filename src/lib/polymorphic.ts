import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, PropsWithChildren } from "react";

type AsProp<C extends ElementType> = { as?: C };

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

/** Props for a component that can render as any element via `as`, keeping that element's own props. */
export type PolymorphicProps<C extends ElementType, Props = object> = PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

export type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>["ref"];

export type PolymorphicComponent<DefaultTag extends ElementType, Props = object> = <C extends ElementType = DefaultTag>(
  props: PolymorphicProps<C, Props> & { ref?: PolymorphicRef<C> },
) => React.ReactElement | null;
