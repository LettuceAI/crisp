import { Children, Fragment, isValidElement, type ReactNode } from "react";

const QUOTE = /"[^"\n]*"|“[^”\n]*”|«[^»\n]*»/g;

/**
 * Wraps dialogue in `data-quote` spans. Quotes are matched across the whole run of
 * children, so a quote that contains emphasis or a link (`"so *stupid* of me"`) stays
 * one quote instead of flipping which side of every later quote mark is dialogue.
 * A child element inside a quote is wrapped whole; a quote that sits entirely inside
 * one child element is left for that element to mark itself.
 */
export function markQuotes(children: ReactNode, render: (text: string) => ReactNode = (text) => text): ReactNode {
  const items = Children.toArray(children);
  const texts = items.map(textOf);
  const ranges = quoteRanges(texts.join(""));
  const out: ReactNode[] = [];
  let offset = 0;
  items.forEach((child, index) => {
    const start = offset;
    const end = start + texts[index]!.length;
    offset = end;
    if (typeof child === "string" || typeof child === "number") {
      const text = String(child);
      let cursor = 0;
      for (const [from, to] of ranges) {
        if (to <= start || from >= end) continue;
        const a = Math.max(from, start) - start;
        const b = Math.min(to, end) - start;
        if (a > cursor) out.push(<Fragment key={`${index}.${cursor}`}>{render(text.slice(cursor, a))}</Fragment>);
        out.push(<span key={`${index}.${a}q`} data-quote="">{render(text.slice(a, b))}</span>);
        cursor = b;
      }
      if (cursor < text.length) out.push(<Fragment key={`${index}.${cursor}`}>{render(text.slice(cursor))}</Fragment>);
      return;
    }
    const quoted = start < end && ranges.some(([from, to]) => from < end && to > start && (from < start || to > end));
    out.push(quoted ? <span key={`${index}q`} data-quote="">{child}</span> : child);
  });
  return out;
}

function quoteRanges(text: string): [number, number][] {
  return [...text.matchAll(QUOTE)].map((match) => [match.index, match.index + match[0].length]);
}

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (!isValidElement<{ children?: ReactNode }>(node)) return "";
  if (node.type === "br") return "\n";
  return Children.toArray(node.props.children).map(textOf).join("");
}
