import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    watch: {
      ignored: [
        "**/blessed-sacrament-church/**",
        "**/skills/**",
        "**/dist/**",
        "**/scripts/**",
        "**/tool-results/**",
        "**/upload/**",
        "**/download/**",
      ],
    },
  },
  optimizeDeps: {
    // Scope the dep scanner to the app entry only — the vendored
    // blessed-sacrament-church reference repo otherwise gets scanned.
    entries: ["index.html"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules/**", "dist/**", "blessed-sacrament-church/**"],
  },
});
