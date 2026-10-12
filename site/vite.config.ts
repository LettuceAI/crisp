import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { docsPlugin } from "./plugins/docs.ts";

const crisp = fileURLToPath(new URL("../src/index.ts", import.meta.url));

export default defineConfig({
  base: "/crisp/",
  plugins: [react(), tailwindcss(), docsPlugin()],
  resolve: { alias: { "@lettuceai/crisp": crisp } },
  server: { fs: { allow: [".."] } },
  build: { outDir: "dist", emptyOutDir: true },
});
