import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Prose } from "./Prose";

const html = (text: string) => renderToStaticMarkup(<Prose size="inherit" quotes query="harbor">{text}</Prose>);

describe("Prose message content", () => {
  it("preserves blockquotes, paragraphs and fenced code across blank lines", () => {
    const out = html('First paragraph.\n\n> At the harbor.\n> "Wait here."\n\n```rust\nlet harbor = true;\n\nprintln!("ready");\n```');
    expect(out).toContain('<blockquote');
    expect(out).toContain('data-quote');
    expect(out).toContain('>rust</span>');
    expect(out).toContain('<pre');
    expect(out).toContain('println!(&quot;ready&quot;);');
    expect(out).toContain('<mark');
    expect(out).not.toContain('```');
    expect(out).not.toContain('<p><div');
  });

  it("renders unlabelled and indented single-line blocks as code blocks", () => {
    for (const text of ['```\nhello\n```', '    hello']) {
      const out = html(text);
      expect(out).toContain('<pre');
      expect(out).toContain('>hello<');
      expect(out).toContain('aria-label="Copy"');
    }
    expect(html('Keep `hello` inline.')).not.toContain('<pre');
  });

  it("renders inline and reference images without treating them as HTML", () => {
    const out = html('![Harbor](https://example.com/harbor.png)\n\n![View][photo]\n\n[photo]: https://example.com/view.png');
    expect(out).toContain('src="https://example.com/harbor.png"');
    expect(out).toContain('alt="Harbor"');
    expect(out).toContain('src="https://example.com/view.png"');
    const interactive = renderToStaticMarkup(<Prose onImageClick={() => {}}>{'![Harbor](https://example.com/harbor.png)'}</Prose>);
    expect(interactive).toContain('aria-label="Harbor"');
    expect(interactive).toContain('<button');
    expect(interactive).not.toContain('aspect-square');
  });

  it("keeps dialogue colouring and search highlights together", () => {
    const out = html('"Meet at the harbor." *“The harbor,”* she said.');
    expect(out).toMatch(/data-quote=""[^>]*>.*<mark/);
    expect(out).toContain('<em><span data-quote');
    expect(out).not.toContain('leading-relaxed');
  });

  it("keeps a quote whole when emphasis sits inside it", () => {
    const text = '"Fucking—*stupid*—get off me—" She tears the stockings down her calves. "Laundry! All of it! Sweatpants, where—right, your room, I\'m going, I\'m *going*—"';
    const out = renderToStaticMarkup(<Prose size="inherit" quotes>{text}</Prose>);
    const quoted = [...out.matchAll(/<span data-quote="">([\s\S]*?)<\/span>/g)].map((match) => match[1]!.replace(/<[^>]+>/g, "")).join("|");
    expect(quoted).not.toContain("She tears");
    expect(quoted).toContain("&quot;Fucking—");
    expect(quoted).toContain("stupid");
    expect(quoted).toContain("—get off me—&quot;");
    expect(quoted).toContain("&quot;Laundry!");
    expect(quoted).toContain("going");
    expect(out).toContain('<span data-quote=""><em');
  });

  it("draws chat code as a plain block with a hidden copy icon", () => {
    const out = renderToStaticMarkup(<Prose size="inherit" codeVariant="chat">{"```rust\nhello\n```"}</Prose>);
    expect(out).toContain(">hello<");
    expect(out).not.toContain(">rust</span>");
    expect(out).not.toContain("border-b");
    expect(out).toMatch(/aria-label="Copy"[^>]*opacity-0|opacity-0[^>]*aria-label="Copy"/);
    expect(out).toContain("group-focus-within:opacity-100");
    expect(renderToStaticMarkup(<Prose size="inherit">{"```rust\nhello\n```"}</Prose>)).toContain(">rust</span>");
  });

  it("does not execute HTML or unsafe image URLs", () => {
    const out = html('<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">\n\n![bad](javascript:alert%281%29)');
    expect(out).not.toMatch(/<script[ >]/);
    expect(out).not.toMatch(/<img[^>]*onerror=/);
    expect(out).not.toContain('src="javascript:');
  });
});
