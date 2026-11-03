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

  it("does not execute HTML or unsafe image URLs", () => {
    const out = html('<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">\n\n![bad](javascript:alert%281%29)');
    expect(out).not.toMatch(/<script[ >]/);
    expect(out).not.toMatch(/<img[^>]*onerror=/);
    expect(out).not.toContain('src="javascript:');
  });
});
