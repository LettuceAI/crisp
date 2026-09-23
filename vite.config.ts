import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* Library build: one ES module (types come from tsc, see package.json), every runtime dependency left to the
   consumer. Tailwind is not run here — the consumer's build generates the utilities
   from our source (see README). */
export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: "src/index.ts", formats: ["es"], fileName: "index" },
    sourcemap: true,
    rollupOptions: {
      external: (id) => !id.startsWith(".") && !id.startsWith("/") && !id.includes("\0"),
    },
  },
});
