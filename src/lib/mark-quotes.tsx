import { Children, Fragment, type ReactNode } from "react";

const QUOTE = /("[^"\n]*"|“[^”\n]*”|«[^»\n]*»)/g;

export function markQuotes(children: ReactNode, render: (text: string) => ReactNode = (text) => text): ReactNode {
  return Children.map(children, (child) =>
    typeof child === "string"
      ? child.split(QUOTE).map((part, i) => (i % 2 ? <span key={i} data-quote="">{render(part)}</span> : part ? <Fragment key={i}>{render(part)}</Fragment> : null))
      : child,
  );
}
