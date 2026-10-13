import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../lib/cn";

export interface InlineMarkdownProps {
  children: string;
  className?: string;
}

const allowed = ["p", "strong", "em", "del", "code", "a", "br", "ul", "ol", "li", "blockquote"];

/** ATX headings kept as text: the first `#` of a heading line is escaped. */
export function escapeHeadings(text: string): string {
  return text.replace(/^( {0,3})#(?=#{0,5}(?:\s|$))/gm, "$1\\#");
}

const run = ({ children }: { children?: ReactNode }) => <span>{children} </span>;

/**
 * Markdown inside a line of text — a card's description, a list row's preview. Bold,
 * italic, strikethrough and inline code keep their emphasis; paragraphs, lists and quotes
 * run on as one line so a line clamp still works; headings stay as the text they were
 * typed as, and links are plain text, since the line usually sits inside a button.
 *
 * Raw HTML is not enabled: descriptions and messages are untrusted text.
 */
export function InlineMarkdown({ children, className }: InlineMarkdownProps) {
  return (
    <span className={cn(className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        allowedElements={allowed}
        unwrapDisallowed
        components={{
          p: run,
          ul: run,
          ol: run,
          li: run,
          blockquote: run,
          a: ({ children: c }) => <span>{c}</span>,
          strong: ({ children: c }) => <strong className="font-semibold">{c}</strong>,
          em: ({ children: c }) => <em>{c}</em>,
          del: ({ children: c }) => <del>{c}</del>,
          code: ({ children: c }) => <code className="rounded bg-fill px-1 font-mono text-[0.9em]">{c}</code>,
          br: () => <> </>,
        }}
      >
        {escapeHeadings(children)}
      </ReactMarkdown>
    </span>
  );
}
