import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../lib/cn";
import { CodeBlock } from "./CodeBlock";

export interface ProseProps {
  children: string;
  /** Message body vs. a full document (README, changelog). */
  size?: "sm" | "md";
  className?: string;
}

/**
 * Markdown on our type scale. Replaces the app's MarkdownRenderer, HfReadmeRenderer and
 * the ~90 lines of `.hf-html-block` CSS in App.css — three renderers with three scales.
 *
 * Raw HTML is not enabled: character definitions and remote READMEs are untrusted text.
 */
export function Prose({ children, size = "md", className }: ProseProps) {
  const base = size === "sm" ? "text-sm" : "text-base";
  return (
    <div className={cn(base, "leading-relaxed text-fg", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children: c }) => <h1 className="mb-2 mt-5 text-xl font-bold tracking-tight text-fg first:mt-0">{c}</h1>,
          h2: ({ children: c }) => <h2 className="mb-2 mt-5 text-lg font-semibold tracking-tight text-fg first:mt-0">{c}</h2>,
          h3: ({ children: c }) => <h3 className="mb-1.5 mt-4 text-base font-semibold text-fg first:mt-0">{c}</h3>,
          p: ({ children: c }) => <p className="my-2 first:mt-0 last:mb-0">{c}</p>,
          em: ({ children: c }) => <em className="text-fg-2">{c}</em>,
          strong: ({ children: c }) => <strong className="font-semibold text-fg">{c}</strong>,
          a: ({ children: c, href }) => (
            <a href={href} target="_blank" rel="noreferrer noopener" className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">
              {c}
            </a>
          ),
          ul: ({ children: c }) => <ul className="my-2 list-disc space-y-1 pl-5 marker:text-fg-4">{c}</ul>,
          ol: ({ children: c }) => <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-fg-4">{c}</ol>,
          blockquote: ({ children: c }) => <blockquote className="my-3 border-l-2 border-line-2 pl-3 text-fg-2">{c}</blockquote>,
          hr: () => <hr className="my-4 border-line" />,
          code: ({ className: cls, children: c }) => {
            const text = String(c).replace(/\n$/, "");
            /* A fenced block gets a language class; inline code does not. */
            if (!cls && !text.includes("\n")) {
              return <code className="rounded-md border border-line bg-fill px-1 py-0.5 font-mono text-[0.9em] text-fg-2">{text}</code>;
            }
            return <CodeBlock code={text} label={cls?.replace("language-", "")} className="my-3" />;
          },
          pre: ({ children: c }) => <>{c}</>,
          table: ({ children: c }) => (
            <div className="scrollbar-thin my-3 overflow-x-auto rounded-xl border border-line">
              <table className="w-full border-collapse text-left text-sm">{c}</table>
            </div>
          ),
          thead: ({ children: c }) => <thead className="border-b border-line bg-fill">{c}</thead>,
          th: ({ children: c }) => <th className="px-3 py-2 font-medium text-fg-3">{c}</th>,
          td: ({ children: c }) => <td className="border-b border-line px-3 py-2 text-fg-2 last:border-0">{c}</td>,
          img: ({ src, alt }) => <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} className="my-3 max-w-full rounded-xl border border-line" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
