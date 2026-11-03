import { Children, type ReactElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../lib/cn";
import { markQuotes } from "../lib/mark-quotes";
import { CodeBlock } from "./CodeBlock";
import { Highlight } from "./Highlight";
import { MediaTile } from "./MediaTile";

export interface ProseProps {
  children: string;
  /** Message body vs. a full document (README, changelog). */
  size?: "sm" | "md" | "inherit";
  quotes?: boolean;
  query?: string;
  onImageClick?: (image: { src: string; alt: string }) => void;
  className?: string;
}

/**
 * Markdown on our type scale. Replaces the app's MarkdownRenderer, HfReadmeRenderer and
 * the ~90 lines of `.hf-html-block` CSS in App.css — three renderers with three scales.
 *
 * Raw HTML is not enabled: character definitions and remote READMEs are untrusted text.
 */
export function Prose({ children, size = "md", quotes = false, query, onImageClick, className }: ProseProps) {
  const inherited = size === "inherit";
  const highlight = (text: string) => query ? <Highlight query={query}>{text}</Highlight> : text;
  const text = (content: ReactNode) => quotes
    ? markQuotes(content, highlight)
    : Children.map(content, (child) => typeof child === "string" ? highlight(child) : child);
  return (
    <div className={cn(!inherited && [size === "sm" ? "text-sm" : "text-base", "leading-relaxed text-fg"], "min-w-0", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children: c }) => <h1 className="mb-2 mt-5 text-xl font-bold tracking-tight text-fg first:mt-0">{text(c)}</h1>,
          h2: ({ children: c }) => <h2 className="mb-2 mt-5 text-lg font-semibold tracking-tight text-fg first:mt-0">{text(c)}</h2>,
          h3: ({ children: c }) => <h3 className="mb-1.5 mt-4 text-base font-semibold text-fg first:mt-0">{text(c)}</h3>,
          p: ({ children: c }) => <p className={cn("my-2 first:mt-0 last:mb-0", inherited && "whitespace-pre-wrap break-words")}>{text(c)}</p>,
          em: ({ children: c }) => <em className={inherited ? undefined : "text-fg-2"}>{text(c)}</em>,
          strong: ({ children: c }) => <strong className={cn("font-semibold", !inherited && "text-fg")}>{text(c)}</strong>,
          del: ({ children: c }) => <del>{text(c)}</del>,
          a: ({ children: c, href }) => (
            <a href={href} target="_blank" rel="noreferrer noopener" className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">
              {text(c)}
            </a>
          ),
          ul: ({ children: c }) => <ul className="my-2 list-disc space-y-1 pl-5 marker:text-fg-4">{c}</ul>,
          ol: ({ children: c }) => <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-fg-4">{c}</ol>,
          li: ({ children: c }) => <li>{text(c)}</li>,
          blockquote: ({ children: c }) => <blockquote className="my-3 border-l-2 border-line-2 pl-3 text-fg-2">{c}</blockquote>,
          hr: () => <hr className="my-4 border-line" />,
          code: ({ children: c }) => <code className="rounded-md border border-line bg-fill px-1 py-0.5 font-mono text-[0.9em] text-fg-2">{Children.map(c, (child) => typeof child === "string" ? highlight(child) : child)}</code>,
          pre: ({ children: c }) => {
            const block = Children.only(c) as ReactElement<{ children?: ReactNode; className?: string }>;
            return <CodeBlock code={String(block.props.children ?? "").replace(/\n$/, "")} label={block.props.className?.replace("language-", "")} query={query} className="my-3" />;
          },
          table: ({ children: c }) => (
            <div className="scrollbar-thin my-3 overflow-x-auto rounded-xl border border-line">
              <table className="w-full border-collapse text-left text-sm">{c}</table>
            </div>
          ),
          thead: ({ children: c }) => <thead className="border-b border-line bg-fill">{c}</thead>,
          th: ({ children: c }) => <th className="px-3 py-2 font-medium text-fg-3">{text(c)}</th>,
          td: ({ children: c }) => <td className="border-b border-line px-3 py-2 text-fg-2 last:border-0">{text(c)}</td>,
          img: ({ src, alt }) => typeof src === "string" && src
            ? onImageClick
              ? <MediaTile src={src} alt={alt || src} aspect="auto" className="my-3" onClick={() => onImageClick({ src, alt: alt || src })} />
              : <img src={src} alt={alt ?? ""} className="my-3 max-w-full rounded-xl border border-line" />
            : null,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
