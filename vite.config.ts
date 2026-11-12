import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The production build targets the project GitHub Pages URL:
// https://thebigbone.github.io/too-early/
// The dev server stays at the root so local development is unchanged.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/too-early/" : "/",
  plugins: [react(), tailwindcss()],
}));
