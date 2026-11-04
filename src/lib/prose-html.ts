import type { Element, Root, RootContent } from "hast";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import type { Options } from "react-markdown";
import { safeInlineStyle } from "./prose-style";

const schema: NonNullable<Parameters<typeof rehypeSanitize>[0]> = {
  tagNames: [
    "a", "abbr", "address", "b", "bdi", "bdo", "caption", "cite", "blockquote", "br", "code", "dd", "del", "details", "div", "dl", "dt",
    "em", "figure", "figcaption", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "input", "ins", "kbd", "li",
    "mark", "ol", "p", "pre", "q", "ruby", "rt", "rp", "s", "samp", "small", "span", "strong", "sub", "summary", "sup",
    "table", "tbody", "td", "th", "thead", "tfoot", "time", "tr", "u", "ul", "var",
  ],
  attributes: {
    "*": ["style", "title", ["dir", "ltr", "rtl", "auto"], ["lang", /^[a-z]{2,8}(?:-[a-z0-9]{1,8})*$/i]],
    a: ["href"],
    img: ["src", "alt"],
    input: ["checked"],
    code: [["className", /^language-[a-z0-9_+-]+$/i]],
    details: ["open"],
    time: ["dateTime"],
    ol: ["start"],
    td: [["align", "left", "center", "right"], "colSpan", "rowSpan"],
    th: [["align", "left", "center", "right"], "colSpan", "rowSpan"],
  },
  protocols: { href: ["http", "https", "mailto"], src: ["http", "https"] },
  required: { input: { disabled: true, type: "checkbox" } },
  strip: ["script", "style", "iframe", "object", "embed", "form", "svg", "math", "template", "noscript"],
};

function restrictElement(node: Element) {
  if (typeof node.properties.style === "string") {
    const style = safeInlineStyle(node.properties.style);
    if (style) node.properties.style = style;
    else delete node.properties.style;
  }
  const attribute = node.tagName === "a" ? "href" : node.tagName === "img" ? "src" : null;
  if (attribute && typeof node.properties[attribute] === "string") {
    try {
      const url = new URL(node.properties[attribute]);
      const protocols = attribute === "href" ? ["https:", "http:", "mailto:"] : ["https:", "http:"];
      if (!protocols.includes(url.protocol) || url.username || url.password) delete node.properties[attribute];
    } catch {
      delete node.properties[attribute];
    }
  }
}

function restrictStylesAndUrls() {
  return (tree: Root) => {
    const visit = (node: Root | RootContent) => {
      if (node.type === "element") restrictElement(node);
      if ("children" in node) for (const child of node.children) visit(child);
    };
    visit(tree);
  };
}

export const proseHtmlPlugins: Options["rehypePlugins"] = [rehypeRaw, [rehypeSanitize, schema], restrictStylesAndUrls];
