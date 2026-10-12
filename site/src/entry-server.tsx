import { renderToString } from "react-dom/server";
import { App } from "./App";
import { canonical } from "./router";
import { metaFor, NOT_FOUND, pages } from "./routes";

export { pages };

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export function render(route: string) {
  const meta = metaFor(route) ?? NOT_FOUND;
  const url = canonical(route);
  const head = [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Crisp" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:card" content="summary" />`,
  ].join("\n    ");
  return { html: renderToString(<App route={route} />), head };
}
