import { Fragment, type ReactNode } from "react";
import { Box, CopyButton, ScrollArea, cn } from "@lettuceai/crisp";

export type Lang = "tsx" | "css" | "sh" | "json" | "text";

const keywords =
  "import|export|from|const|let|var|function|return|default|type|interface|as|if|else|await|async|new|typeof|extends|for|of|in|true|false|null|undefined";

const grammars: Record<Exclude<Lang, "text">, RegExp> = {
  tsx: new RegExp(
    [
      String.raw`(?<comment>\/\/[^\n]*|\/\*[\s\S]*?\*\/)`,
      String.raw`(?<string>"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|` + "`(?:[^`\\\\]|\\\\.)*`)",
      String.raw`(?<number>\b\d[\d_.]*\b)`,
      String.raw`(?<keyword>\b(?:${keywords})\b)`,
      String.raw`(?<component><\/?[A-Z][\w.]*|\b[A-Z][\w]*\b)`,
      String.raw`(?<tag><\/?[a-z][\w-]*)`,
      String.raw`(?<attr>\b[a-zA-Z][\w-]*(?==))`,
      String.raw`(?<fn>\b[a-z_$][\w$]*(?=\())`,
    ].join("|"),
    "g",
  ),
  css: new RegExp(
    [
      String.raw`(?<comment>\/\*[\s\S]*?\*\/)`,
      String.raw`(?<string>"[^"\n]*"|'[^'\n]*')`,
      String.raw`(?<keyword>@[\w-]+)`,
      String.raw`(?<attr>--?[a-z][\w-]*(?=\s*:))`,
      String.raw`(?<number>#[0-9a-fA-F]{3,8}\b|\b\d[\d.]*(?:px|rem|em|%|ms|s)?\b)`,
    ].join("|"),
    "g",
  ),
  sh: new RegExp(
    [
      String.raw`(?<comment>#[^\n]*)`,
      String.raw`(?<string>"[^"\n]*"|'[^'\n]*')`,
      String.raw`(?<keyword>^(?:bun|npm|npx|pnpm|yarn)\b|(?<=\n)(?:bun|npm|npx|pnpm|yarn)\b)`,
      String.raw`(?<attr>\s--?[a-z][\w-]*)`,
    ].join("|"),
    "g",
  ),
  json: new RegExp(
    [
      String.raw`(?<attr>"(?:[^"\\\n]|\\.)*"(?=\s*:))`,
      String.raw`(?<string>"(?:[^"\\\n]|\\.)*")`,
      String.raw`(?<number>-?\b\d[\d.eE+-]*\b)`,
      String.raw`(?<keyword>\b(?:true|false|null)\b)`,
    ].join("|"),
    "g",
  ),
};

const tone: Record<string, string> = {
  comment: "italic text-fg-3",
  string: "text-accent",
  number: "text-warning",
  keyword: "text-secondary",
  component: "text-info",
  tag: "text-info",
  attr: "text-fg",
  fn: "text-fg",
};

function highlight(code: string, lang: Lang): ReactNode[] {
  if (lang === "text") return [code];
  const out: ReactNode[] = [];
  const re = new RegExp(grammars[lang]);
  let last = 0;
  let key = 0;
  for (const match of code.matchAll(re)) {
    const kind = Object.entries(match.groups ?? {}).find(([, value]) => value !== undefined)?.[0];
    if (!kind || match[0] === "") continue;
    if (match.index > last) out.push(code.slice(last, match.index));
    out.push(
      <span key={key++} className={tone[kind]}>
        {match[0]}
      </span>,
    );
    last = match.index + match[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out.map((part, i) => <Fragment key={i}>{part}</Fragment>);
}

/** A CodeBlock with syntax colors. Same frame and copy button; the colors come from the theme tokens. */
export function Code({ code, lang = "tsx", label, wrap, maxHeight = 320, className }: { code: string; lang?: Lang; label?: string; wrap?: boolean; maxHeight?: number | string; className?: string }) {
  return (
    <Box className={cn("overflow-hidden rounded-xl border border-line bg-surface-1", className)}>
      <Box className="flex items-center gap-2 border-b border-line bg-surface-1 px-3 py-1.5">
        <span className="min-w-0 flex-1 truncate font-mono text-2xs text-fg-3">{label}</span>
        <CopyButton value={code} />
      </Box>
      <ScrollArea axis={wrap ? "y" : "x"} bar className="max-w-full">
        <pre className={cn("px-3 py-2.5 font-mono text-xs leading-relaxed text-fg-2", wrap && "whitespace-pre-wrap wrap-break-word")} style={{ maxHeight }}>
          <code>{highlight(code, lang)}</code>
        </pre>
      </ScrollArea>
    </Box>
  );
}
