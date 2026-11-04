import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Prose } from "./Prose";
import { safeInlineStyle } from "../lib/prose-style";

const html = (text: string) => renderToStaticMarkup(<Prose html size="inherit" quotes query="harbor">{text}</Prose>);

describe("restricted Prose HTML", () => {
  it("mixes inline HTML, Markdown, quotes and search matches", () => {
    const out = html('Before **bold** <span style="color: #9bd4ff; font-weight:700; font-style:italic">"At the harbor"</span> after.');
    expect(out).toContain('<strong class="font-semibold"><span>bold</span></strong>');
    expect(out).toContain('style="color:#9bd4ff;font-weight:700;font-style:italic"');
    expect(out).toMatch(/<span style=[^>]+><span data-quote=""/);
    expect(out).toContain('>harbor</mark>');
    expect(out).toContain(' after.');
    expect(out).not.toContain('&lt;span');
  });

  it("keeps code literal and accepts plain or nested HTML pre blocks", () => {
    expect(html('```html\n<span style="color:red">literal</span>\n```')).toContain('&lt;span style=&quot;color:red&quot;&gt;literal&lt;/span&gt;');
    expect(html('<pre>one\n<b>two</b>three</pre>')).toContain('one\ntwothree');
    expect(html('<pre></pre>')).toContain('aria-label="Copy"');
    expect(html('Keep `<script>alert(1)</script>` literal.')).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it("drops active content, handlers, identifiers and app classes", () => {
    const out = html('<div id="app" class="fixed inset-0" onclick="alert(1)"><span style="color:red">safe</span><script>alert(1)</script><style>body{display:none}</style><iframe srcdoc="bad"></iframe><form><input autofocus></form><svg><a href="javascript:alert(1)">bad</a></svg><math><mtext>bad</mtext></math></div>');
    expect(out).toContain('<span style="color:red"><span>safe</span></span>');
    expect(out).not.toMatch(/<(?:script|style|iframe|form|svg|math)[ >]/);
    expect(out).not.toMatch(/\s(?:id|onclick|autofocus|srcdoc)=/);
    expect(out).not.toContain('fixed inset-0');
    expect(out).not.toContain('body{display:none}');
  });

  it("rejects unsafe URLs while keeping existing image tiles and safe links", () => {
    for (const url of ['javascript:alert(1)', 'data:text/html,bad', 'file:///etc/passwd', 'asset://localhost/private', 'https://user:pass@example.com/a']) {
      const out = html(`<a href="${url}">link</a><img src="${url}" onerror="alert(1)">`);
      expect(out).not.toMatch(/\s(?:href|src)=/);
    }
    const out = renderToStaticMarkup(<Prose html onImageClick={() => {}}>{'<img src="https://example.com/harbor.png" alt="Harbor"><a href="https://example.com">site</a>'}</Prose>);
    expect(out).toContain('aria-label="Harbor"');
    expect(out).toContain('src="https://example.com/harbor.png"');
    expect(out).toContain('rel="noreferrer noopener"');
    expect(out).not.toContain('onerror=');
  });

  it("removes CSS layout, network loads and indirect values", () => {
    const out = html('<span style="color: red; position:fixed; inset:0; z-index:999999; width:100vw; height:100vh; margin:-999px; transform:scale(100); background:url(https://bad.example); --size:999em; font-size:var(--size); filter:blur(10px)">safe</span>');
    expect(out).toContain('<span style="color:red"><span>safe</span></span>');
    expect(out).not.toContain('bad.example');
    expect(out).toContain('[contain:layout_paint]');
    expect(out).toContain('overflow-clip');
    for (const value of ['url(https://bad.example)', 'var(--color)', 'expression(alert(1))', 'red!important', 'r\\65 d', 'attr(data-secret)', 'light-dark(red, blue)']) {
      expect(safeInlineStyle(`color:${value}`)).toBeUndefined();
    }
    expect(safeInlineStyle('COLOR:rgb(12 23 34 / 50%); background-color:#fff; text-decoration:underline dotted')).toBe('color:rgb(12 23 34 / 50%);background-color:#fff;text-decoration:underline dotted');
  });

  it("bounds nested relative font sizes and rejects extreme or indirect sizes", () => {
    const out = html('<span style="font-size:2em"><span style="font-size:200%">large</span></span>');
    expect(out).toContain('font-size:clamp(0.5rem, 2em, 2rem)');
    expect(out).toContain('font-size:clamp(0.5rem, 200%, 2rem)');
    for (const value of ['999999px', '-1em', '0', '100vh', 'calc(1em * 1000)', 'constructor']) {
      expect(safeInlineStyle(`font-size:${value}`)).toBeUndefined();
    }
  });

  it("handles incomplete streaming tags and malformed closing tags", () => {
    for (const source of ['Before <span style="color:', 'Before <span style="color:red">harbor', '</div><div style="position:fixed" popover="auto">harbor</div>', '<table><tr><td><span style="color:red">harbor']) {
      const out = html(source);
      expect(out).not.toContain('position:fixed');
      expect(out).not.toContain('popover=');
      expect(out).toContain('[contain:layout_paint]');
    }
  });

  it("preserves GFM lists and renders only disabled checkboxes", () => {
    const out = html('- [x] done\n- [ ] waiting\n\n<input type="password" autofocus name="secret" value="bad">');
    expect(out.match(/type="checkbox"/g)).toHaveLength(3);
    expect(out.match(/disabled=""/g)).toHaveLength(3);
    expect(out).toContain('checked=""');
    expect(out).not.toContain('type="password"');
    expect(out).not.toContain('name="secret"');
  });

  it("keeps HTML disabled when the option is absent", () => {
    const out = renderToStaticMarkup(<Prose>{'<span style="color:red">plain</span>'}</Prose>);
    expect(out).toContain('&lt;span');
    expect(out).not.toContain('style="color:red"');
  });

  it("supports semantic text, disclosures, figures and table spans", () => {
    const out = html('<figure><figcaption><abbr title="Role playing">RP</abbr> <ruby>港<rt>harbor</rt></ruby> <time datetime="2026-11-04">today</time></figcaption><details open><summary>More</summary><dl><dt>Name</dt><dd>Harbor</dd></dl></details></figure>\n\n<table><caption>Schedule</caption><tbody><tr><th colspan="2">Route</th></tr><tr><td>North</td><td>South</td></tr></tbody></table>');
    expect(out).toContain('<figure>');
    expect(out).toContain('<abbr title="Role playing">');
    expect(out).toContain('<ruby>');
    expect(out).toContain('<rt>');
    expect(out).toContain('dateTime="2026-11-04"');
    expect(out).toContain('<details open="">');
    expect(out).toContain('<dl>');
    expect(out).toContain('colSpan="2"');
    expect(out).toContain('<caption>');
  });

  it("allows bounded card decoration, gradients and internal flex/grid layouts", () => {
    const out = html('<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:16px;border:1px solid #555;border-radius:12px;background:linear-gradient(135deg,#123,#345);box-shadow:0 2px 8px #000"><div style="display:flex;flex-direction:column;align-items:center"><b>Card</b></div><div>Body</div></div>');
    expect(out).toContain('display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:12px;padding:16px;border:1px solid #555;border-radius:12px;background:linear-gradient(135deg,#123,#345);box-shadow:0 2px 8px #000');
    expect(out).toContain('display:flex;flex-direction:column;align-items:center');
    expect(safeInlineStyle('width:100%;max-height:20rem;overflow:auto')).toBe('width:100%;max-height:20rem;overflow:auto');
    for (const style of [
      'background:url(https://bad.example)', 'background-image:image-set(url(https://bad.example) 1x)',
      'background:var(--app-secret)', 'background:paint(worklet)', 'background:u\\72l(https://bad.example)',
      'padding:99999px', 'margin:-5px', 'width:100vw', 'height:99999rem', 'gap:99em',
      'border-image:url(https://bad.example)', 'animation:spin 1s infinite', 'grid-template-columns:repeat(999999,1fr)',
      'position:sticky', 'z-index:1', 'content:attr(data-secret)', 'border:1px solid red!important',
    ]) expect(safeInlineStyle(style)).toBeUndefined();
  });
});
