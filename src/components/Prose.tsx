import { Children, createElement, isValidElement, useMemo, type HTMLAttributes, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../lib/cn";
import { markQuotes } from "../lib/mark-quotes";
import { CodeBlock } from "./CodeBlock";
import { Highlight } from "./Highlight";
import { MediaTile } from "./MediaTile";
import { proseHtmlPlugins } from "../lib/prose-html";

export interface ProseProps {
  children: string;
  /** Message body vs. a full document (README, changelog). */
  size?: "sm" | "md" | "inherit";
  quotes?: boolean;
  query?: string;
  onImageClick?: (image: { src: string; alt: string }) => void;
  /** Allow sanitized HTML with restricted text and in-flow box styles. Off by default. */
  html?: boolean;
  /** How fenced code looks. `chat` is the plain block for message text; see CodeBlock. */
  codeVariant?: "panel" | "chat";
  className?: string;
}

/**
 * Markdown on our type scale. Replaces the app's MarkdownRenderer, HfReadmeRenderer and
 * the ~90 lines of `.hf-html-block` CSS in App.css — three renderers with three scales.
 *
 * HTML is opt-in and always passes through the restricted tag, attribute and style policy.
 */
export function Prose({ children, size = "md", quotes = false, query, onImageClick, html = false, codeVariant = "panel", className }: ProseProps) {
  const inherited = size === "inherit";
  const components = useMemo<Components>(() => {
    const highlight = (text: string) => query ? <Highlight query={query}>{text}</Highlight> : text;
    const text = (content: ReactNode) => quotes
      ? markQuotes(content, highlight)
      : Children.map(content, (child) => typeof child === "string" ? highlight(child) : child);
    const formatted = (tag: string, className?: string) => ({ children: c, style, title, dir, lang }: HTMLAttributes<HTMLElement>) => createElement(tag, { style, title, dir, lang, className }, text(c));
    return {
      h1: ({ children: c, style }) => <h1 style={style} className="mb-2 mt-5 text-xl font-bold tracking-tight text-fg first:mt-0">{text(c)}</h1>,
      h2: ({ children: c, style }) => <h2 style={style} className="mb-2 mt-5 text-lg font-semibold tracking-tight text-fg first:mt-0">{text(c)}</h2>,
      h3: ({ children: c, style }) => <h3 style={style} className="mb-1.5 mt-4 text-base font-semibold tracking-tight text-fg first:mt-0">{text(c)}</h3>,
      h4: formatted("h4", "mb-1 mt-3 text-base font-semibold text-fg first:mt-0"),
      h5: formatted("h5", "mb-1 mt-3 text-sm font-semibold text-fg first:mt-0"),
      h6: formatted("h6", "mb-1 mt-3 text-sm font-medium text-fg-2 first:mt-0"),
      p: ({ children: c, style }) => <p style={style} className={cn("my-2 first:mt-0 last:mb-0", inherited && "whitespace-pre-wrap break-words")}>{text(c)}</p>,
      abbr: formatted("abbr"),
      address: formatted("address"),
      bdi: formatted("bdi"),
      bdo: formatted("bdo"),
      caption: formatted("caption"),
      cite: formatted("cite"),
      dd: formatted("dd"),
      dt: formatted("dt"),
      figure: formatted("figure"),
      figcaption: formatted("figcaption"),
      ins: formatted("ins"),
      kbd: formatted("kbd"),
      q: formatted("q"),
      ruby: formatted("ruby"),
      rt: formatted("rt"),
      rp: formatted("rp"),
      samp: formatted("samp"),
      var: formatted("var"),
      time: ({ children: c, style, dateTime, title }) => <time style={style} dateTime={dateTime} title={title}>{text(c)}</time>,
      span: ({ children: c, style, dir, lang }) => <span style={style} dir={dir} lang={lang}>{text(c)}</span>,
      b: ({ children: c, style }) => <b style={style}>{text(c)}</b>,
      i: ({ children: c, style }) => <i style={style}>{text(c)}</i>,
      u: ({ children: c, style }) => <u style={style}>{text(c)}</u>,
      s: ({ children: c, style }) => <s style={style}>{text(c)}</s>,
      small: ({ children: c, style }) => <small style={style}>{text(c)}</small>,
      mark: ({ children: c, style }) => <mark style={style}>{text(c)}</mark>,
      sub: ({ children: c, style }) => <sub style={style}>{text(c)}</sub>,
      sup: ({ children: c, style }) => <sup style={style}>{text(c)}</sup>,
      div: ({ children: c, style, dir, lang }) => <div style={style} dir={dir} lang={lang} className="box-border min-w-0 max-w-full">{text(c)}</div>,
      summary: ({ children: c, style }) => <summary style={style}>{text(c)}</summary>,
      em: ({ children: c, style }) => <em style={style} className={inherited ? undefined : "text-fg-2"}>{text(c)}</em>,
      strong: ({ children: c, style }) => <strong style={style} className={cn("font-semibold", !inherited && "text-fg")}>{text(c)}</strong>,
      del: ({ children: c, style }) => <del style={style}>{text(c)}</del>,
      a: ({ children: c, href, style, title }) => (
        <a href={href} style={style} title={title} target="_blank" rel="noreferrer noopener" className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">
          {text(c)}
        </a>
      ),
      ul: ({ children: c, style }) => <ul style={style} className="my-2 list-disc space-y-1 pl-5 marker:text-fg-4">{c}</ul>,
      ol: ({ children: c, style, start }) => <ol style={style} start={start} className="my-2 list-decimal space-y-1 pl-5 marker:text-fg-4">{c}</ol>,
      li: ({ children: c, style }) => <li style={style}>{text(c)}</li>,
      blockquote: ({ children: c, style }) => <blockquote style={style} className="my-3 border-l-2 border-line-2 pl-3 text-fg-2">{c}</blockquote>,
      hr: ({ style }) => <hr style={style} className="my-4 border-line" />,
      code: ({ children: c, style }) => <code style={style} className="rounded-md border border-line bg-fill px-1 py-0.5 font-mono text-[0.9em] text-fg-2">{Children.map(c, (child) => typeof child === "string" ? highlight(child) : child)}</code>,
      pre: ({ children: c }) => {
        const blocks = Children.toArray(c);
        const block = blocks.length === 1 && isValidElement<{ children?: ReactNode; className?: string }>(blocks[0]) ? blocks[0] : null;
        return <CodeBlock code={plainText(block ? block.props.children : c).replace(/\n$/, "")} label={block?.props.className?.replace("language-", "")} query={query} variant={codeVariant} className={codeVariant === "chat" ? "my-2" : "my-3"} />;
      },
      table: ({ children: c, style }) => (
        <div className="scrollbar-thin my-3 max-w-full overflow-x-auto rounded-xl border border-line">
          <table style={style} className="w-full border-collapse text-left text-sm">{c}</table>
        </div>
      ),
      thead: ({ children: c, style }) => <thead style={style} className="border-b border-line bg-fill">{c}</thead>,
      th: ({ children: c, style, colSpan, rowSpan, align }) => <th style={style} colSpan={colSpan} rowSpan={rowSpan} align={align} className="px-3 py-2 font-medium text-fg-3">{text(c)}</th>,
      td: ({ children: c, style, colSpan, rowSpan, align }) => <td style={style} colSpan={colSpan} rowSpan={rowSpan} align={align} className="border-b border-line px-3 py-2 text-fg-2 last:border-0">{text(c)}</td>,
      img: ({ src, alt, style }) => typeof src === "string" && src
        ? onImageClick
          ? <MediaTile src={src} style={style} alt={alt || src} aspect="auto" className="my-3" onClick={() => onImageClick({ src, alt: alt || src })} />
          : <img src={src} style={style} alt={alt ?? ""} className="my-3 max-w-full rounded-xl border border-line" />
        : null,
    };
  }, [inherited, quotes, query, onImageClick, codeVariant]);
  return (
    <div className={cn(!inherited && [size === "sm" ? "text-sm" : "text-base", "leading-relaxed text-fg"], "min-w-0", html && "max-w-full overflow-clip wrap-anywhere [contain:layout_paint]", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={html ? proseHtmlPlugins : undefined}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

function plainText(content: ReactNode): string {
  return Children.toArray(content).map((child) => typeof child === "string" || typeof child === "number"
    ? String(child)
    : isValidElement<{ children?: ReactNode }>(child) ? plainText(child.props.children) : "").join("");
}
