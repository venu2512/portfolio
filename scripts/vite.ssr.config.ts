import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * One-off config used only by `npm run check:ssr` to render the whole page to
 * static HTML in Node and assert content, structure and SEO tags.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    ssr: "scripts/ssr-check.tsx",
    outDir: "dist-ssr",
    emptyOutDir: true,
    rollupOptions: {
      output: { format: "cjs", entryFileNames: "ssr-check.cjs" },
    },
  },
});
