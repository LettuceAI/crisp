import { cn } from "../lib/cn";
import { CopyButton } from "./CopyButton";
import { ScrollArea } from "./ScrollArea";

export interface CodeBlockProps {
  code: string;
  /** Shown in the header — a filename, a language, "Response". */
  label?: string;
  /** Wrap long lines instead of scrolling. Good for prompts, bad for JSON. */
  wrap?: boolean;
  /** Adds a gutter of line numbers. */
  lineNumbers?: boolean;
  maxHeight?: number | string;
  className?: string;
}

/**
 * Monospace content with a copy button: prompt templates, raw payloads, error bodies.
 * Long lines scroll inside the block, so the page never scrolls sideways because of it.
 */
export function CodeBlock({ code, label, wrap, lineNumbers, maxHeight = 320, className }: CodeBlockProps) {
  const lines = code.split("\n");
  return (
    <div className={cn("overflow-hidden rounded-xl border border-line bg-surface-1", className)}>
      {(label || true) && (
        <div className="flex items-center gap-2 border-b border-line bg-surface-1 px-3 py-1.5">
          <span className="min-w-0 flex-1 truncate font-mono text-2xs text-fg-3">{label}</span>
          <CopyButton value={code} />
        </div>
      )}
      <ScrollArea axis={wrap ? "y" : "x"} bar className="max-w-full" >
        <pre
          className={cn("px-3 py-2.5 font-mono text-xs leading-relaxed text-fg-2", wrap && "whitespace-pre-wrap break-words")}
          style={{ maxHeight }}
        >
          {lineNumbers ? (
            <code className="grid grid-cols-[auto_1fr] gap-x-3">
              {lines.map((line, i) => (
                <span key={i} className="contents">
                  <span className="select-none text-right tabular-nums text-fg-3">{i + 1}</span>
                  <span>{line || " "}</span>
                </span>
              ))}
            </code>
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </ScrollArea>
    </div>
  );
}
