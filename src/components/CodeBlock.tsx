import { cn } from "../lib/cn";
import { CopyButton } from "./CopyButton";
import { Highlight } from "./Highlight";
import { ScrollArea } from "./ScrollArea";

export interface CodeBlockProps {
  code: string;
  query?: string;
  /** Shown in the header — a filename, a language, "Response". Not shown by the chat variant. */
  label?: string;
  /** Wrap long lines instead of scrolling. Good for prompts, bad for JSON. */
  wrap?: boolean;
  /** Adds a gutter of line numbers. */
  lineNumbers?: boolean;
  maxHeight?: number | string;
  /**
   * `panel` has a header with the label and a copy button. `chat` is a plain block for
   * message text: the copy icon shows on hover, or after a tap on touch screens.
   */
  variant?: "panel" | "chat";
  className?: string;
}

/**
 * Monospace content with a copy button: prompt templates, raw payloads, error bodies.
 * Long lines scroll inside the block, so the page never scrolls sideways because of it.
 */
export function CodeBlock({ code, query, label, wrap, lineNumbers, maxHeight = 320, variant = "panel", className }: CodeBlockProps) {
  const lines = code.split("\n");
  const body = lineNumbers ? (
    <code className="grid grid-cols-[auto_1fr] gap-x-3">
      {lines.map((line, i) => (
        <span key={i} className="contents">
          <span className="select-none text-right tabular-nums text-fg-3">{i + 1}</span>
          <span>{query ? <Highlight query={query}>{line || " "}</Highlight> : line || " "}</span>
        </span>
      ))}
    </code>
  ) : (
    <code>{query ? <Highlight query={query}>{code}</Highlight> : code}</code>
  );
  if (variant === "chat") {
    return (
      <div className={cn("group relative max-w-full", className)}>
        <ScrollArea axis={wrap ? "y" : "x"} bar className="max-w-full rounded-md border border-line bg-fill">
          <pre
            tabIndex={0}
            className={cn("px-2.5 py-2 font-mono text-[0.875em] leading-snug text-fg-2 focus:outline-none", wrap && "whitespace-pre-wrap break-words")}
            style={{ maxHeight }}
          >
            {body}
          </pre>
        </ScrollArea>
        <CopyButton
          value={code}
          size="sm"
          className="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
        />
      </div>
    );
  }
  return (
    <div className={cn("overflow-hidden rounded-xl border border-line bg-surface-1", className)}>
      <div className="flex items-center gap-2 border-b border-line bg-surface-1 px-3 py-1.5">
        <span className="min-w-0 flex-1 truncate font-mono text-2xs text-fg-3">{label}</span>
        <CopyButton value={code} />
      </div>
      <ScrollArea axis={wrap ? "y" : "x"} bar className="max-w-full" >
        <pre
          className={cn("px-3 py-2.5 font-mono text-xs leading-relaxed text-fg-2", wrap && "whitespace-pre-wrap break-words")}
          style={{ maxHeight }}
        >
          {body}
        </pre>
      </ScrollArea>
    </div>
  );
}
