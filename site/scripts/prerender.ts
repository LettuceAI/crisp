import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const site = path.resolve(import.meta.dir, "..");
const dist = path.join(site, "dist");
const { render, pages } = (await import(pathToFileURL(path.join(site, ".ssr/entry-server.js")).href)) as typeof import("../src/entry-server");

const template = await readFile(path.join(dist, "index.html"), "utf8");
if (!template.includes("<!--app-html-->")) throw new Error("dist/index.html has no <!--app-html--> marker");

for (const page of pages) {
  const { html, head } = render(page.route);
  const out = template.replace("<!--head-tags-->", head).replace("<!--app-html-->", html);
  const dir = path.join(dist, page.route);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), out);
}

console.log(`prerendered ${pages.length} routes`);
for (const page of pages) console.log(`  /crisp/${page.route ? page.route + "/" : ""}`);
