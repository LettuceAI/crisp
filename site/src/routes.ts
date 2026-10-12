import { summaryOf } from "./docs";
import { entries, groupOf } from "./registry";

export interface PageMeta {
  route: string;
  title: string;
  description: string;
}

export const NOT_FOUND: PageMeta = {
  route: "404",
  title: "Page not found · Crisp",
  description: "This page of the Crisp documentation does not exist.",
};

function shorten(text: string, max = 158) {
  const flat = text.replace(/\s+/g, " ").replace(/`/g, "").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "));
  return stop > 60 ? cut.slice(0, stop + 1) : `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

const guides: PageMeta[] = [
  {
    route: "",
    title: "Crisp · React components for LettuceAI",
    description: "Crisp is a React 19 and Tailwind 4 component library with shared design tokens, motion presets and light and dark themes.",
  },
  {
    route: "getting-started",
    title: "Getting started · Crisp",
    description: "Install Crisp, set up the Tailwind CSS v4 source scan, wrap the app in ThemeProvider and translate every string Crisp renders.",
  },
  {
    route: "foundations",
    title: "Foundations · Crisp",
    description: "The design tokens behind Crisp: surfaces, text tiers, semantic colors, radius by role, control heights, the icon ladder and motion presets.",
  },
  {
    route: "components",
    title: "Components · Crisp",
    description: "Every Crisp component and hook, grouped by what it is for, each with live examples, source and a generated props table.",
  },
];

const components: PageMeta[] = entries.map((item) => {
  const group = groupOf(item.slug)!;
  const summary = summaryOf(item);
  return {
    route: `components/${item.slug}`,
    title: `${item.name} · Crisp ${group.title}`,
    description: shorten(summary ? `${item.name}: ${summary}` : `${item.name} in Crisp: live example, source and props.`),
  };
});

export const pages: PageMeta[] = [...guides, ...components];

const byRoute = new Map(pages.map((page) => [page.route, page]));

export function metaFor(route: string) {
  return byRoute.get(route);
}
