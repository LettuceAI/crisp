import docs from "virtual:crisp-docs";
import type { DocComponent, DocSymbol } from "../plugins/docs.ts";
import { docsOf, documentedNames, entries, type Entry } from "./registry";

export interface ApiBlock {
  name: string;
  description: string;
  component?: DocComponent;
  symbol?: DocSymbol;
}

function descriptionFor(name: string) {
  return docs.symbols[name]?.description || docs.components[name]?.description || "";
}

/** The lead paragraph of a page: the first exported name's doc comment, else the registry summary. */
export function summaryOf(item: Entry) {
  const own = descriptionFor(item.name) || docsOf(item).map(descriptionFor).find(Boolean) || "";
  return own || item.summary || "";
}

export function apiOf(item: Entry): ApiBlock[] {
  return docsOf(item)
    .filter((name) => docs.symbols[name] && docs.symbols[name].kind !== "type")
    .map((name) => ({
      name,
      description: descriptionFor(name),
      component: docs.components[name],
      symbol: docs.symbols[name],
    }));
}

/** Exports that no page documents. The build fails on any. */
export function undocumentedExports() {
  const covered = documentedNames();
  return Object.entries<DocSymbol>(docs.symbols)
    .filter(([name, symbol]) => symbol.kind !== "type" && !covered.has(name))
    .map(([name]) => name);
}

export function importLine(item: Entry) {
  const names = apiOf(item)
    .map((block) => block.name)
    .sort((a, b) => a.localeCompare(b));
  return `import { ${names.join(", ")} } from "@lettuceai/crisp";`;
}

export { entries };
