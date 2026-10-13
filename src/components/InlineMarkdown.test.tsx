import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { escapeHeadings, InlineMarkdown } from "./InlineMarkdown";

const html = (text: string) => renderToStaticMarkup(<InlineMarkdown>{text}</InlineMarkdown>);

describe("InlineMarkdown", () => {
  it("keeps emphasis and inline code", () => {
    const out = html("**Age:** 34 · *quiet* ~~old~~ `id`");
    expect(out).toContain('<strong class="font-semibold">Age:</strong>');
    expect(out).toContain("<em>quiet</em>");
    expect(out).toContain("<del>old</del>");
    expect(out).toContain(">id</code>");
  });

  it("leaves headings as the text they were typed as", () => {
    expect(escapeHeadings("# Title\n  ## Sub\nnot # one\n#tag")).toBe("\\# Title\n  \\## Sub\nnot # one\n#tag");
    const out = html("# Title\n\nBody");
    expect(out).not.toContain("<h1");
    expect(out).toContain("# Title");
  });

  it("runs blocks on as one line and drops links and raw HTML", () => {
    const out = html("First paragraph.\n\n- one\n- two\n\n[site](https://example.com) <b>raw</b>");
    expect(out).not.toMatch(/<(p|ul|li|a|b)[ >]/);
    expect(out).toContain("one");
    expect(out).toContain("site");
  });
});
