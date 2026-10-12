import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { metaFor, NOT_FOUND } from "./routes";

export const SITE = "https://www.lettuceai.app";
export const BASE = import.meta.env.BASE_URL;

/** `/crisp/components/button/` becomes `components/button`; the landing page is the empty string. */
export function toRoute(pathname: string) {
  const rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, "");
  return rest.replace(/\/+$/, "").replace(/\/index\.html$/, "");
}

export function toHref(route: string) {
  return route ? `${BASE}${route}/` : BASE;
}

export function canonical(route: string) {
  return `${SITE}${toHref(route)}`;
}

const RouteContext = createContext<string>("");

export function useRoute() {
  return useContext(RouteContext);
}

function setMeta(selector: string, create: () => HTMLElement, attr: string, value: string) {
  const el = document.head.querySelector<HTMLElement>(selector) ?? document.head.appendChild(create());
  el.setAttribute(attr, value);
}

function applyHead(route: string) {
  const meta = metaFor(route) ?? NOT_FOUND;
  document.title = meta.title;
  const tag = (name: string, attrs: Record<string, string>) => () => {
    const el = document.createElement(name);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  };
  setMeta('meta[name="description"]', tag("meta", { name: "description" }), "content", meta.description);
  setMeta('link[rel="canonical"]', tag("link", { rel: "canonical" }), "href", canonical(route));
  setMeta('meta[property="og:title"]', tag("meta", { property: "og:title" }), "content", meta.title);
  setMeta('meta[property="og:description"]', tag("meta", { property: "og:description" }), "content", meta.description);
  setMeta('meta[property="og:url"]', tag("meta", { property: "og:url" }), "content", canonical(route));
}

/**
 * Client routing for a site whose every page is already static HTML. Links stay plain
 * anchors, so they work without scripts and crawlers follow them; this only takes over
 * a same-site click to swap the page without a reload.
 */
export function Router({ initial, children }: { initial: string; children: ReactNode }) {
  const [route, setRoute] = useState(initial);

  useEffect(() => {
    const onPop = () => setRoute(toRoute(location.pathname));
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest("a[href]");
      if (!anchor || anchor.hasAttribute("download") || (anchor.getAttribute("target") ?? "_self") !== "_self") return;
      const url = new URL((anchor as HTMLAnchorElement).href, location.href);
      if (url.origin !== location.origin || !url.pathname.startsWith(BASE)) return;
      if (url.pathname === location.pathname && url.hash) return;
      event.preventDefault();
      if (url.pathname + url.hash !== location.pathname + location.hash) history.pushState(null, "", url.pathname + url.hash);
      const next = toRoute(url.pathname);
      setRoute(next);
      if (url.hash) {
        requestAnimationFrame(() => document.getElementById(url.hash.slice(1))?.scrollIntoView());
      } else {
        window.scrollTo(0, 0);
        document.getElementById("content")?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("popstate", onPop);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    applyHead(route);
  }, [route]);

  const value = useMemo(() => route, [route]);
  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
}
