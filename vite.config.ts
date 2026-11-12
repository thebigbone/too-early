import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The production build targets the project GitHub Pages URL:
// https://thebigbone.github.io/too-early/
// The dev server stays at the root so local development is unchanged.
export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? "/too-early/" : "/",
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        charts: fileURLToPath(new URL("./charts/index.html", import.meta.url)),
      },
    },
  },
}));
