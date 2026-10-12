import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

process.env.NODE_ENV = "production";

const site = path.resolve(import.meta.dir, "..");
const dist = path.join(site, "dist");
const { render, pages, problems } = (await import(pathToFileURL(path.join(site, ".ssr/entry-server.js")).href)) as typeof import("../src/entry-server");

const issues = problems();
if (issues.length) throw new Error(`documentation is incomplete:\n  ${issues.join("\n  ")}`);

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

const origin = "https://www.lettuceai.app";
const urls = pages.map((page) => `${origin}/crisp/${page.route ? page.route + "/" : ""}`);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile(path.join(dist, "sitemap.xml"), sitemap);
await writeFile(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/crisp/sitemap.xml\n`);
console.log("wrote sitemap.xml and robots.txt");
