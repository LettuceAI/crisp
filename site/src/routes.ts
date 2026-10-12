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

export const pages: PageMeta[] = [
  {
    route: "",
    title: "Crisp · React components for LettuceAI",
    description: "Crisp is a React 19 and Tailwind 4 component library with shared design tokens, motion presets and light and dark themes.",
  },
];

const byRoute = new Map(pages.map((page) => [page.route, page]));

export function metaFor(route: string) {
  return byRoute.get(route);
}
