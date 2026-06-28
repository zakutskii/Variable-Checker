import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "path";

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  root: ".",
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    rollupOptions: {
      input: {
        ui: path.resolve(__dirname, "index.html"),
      },
      output: {
        inlineDynamicImports: true,
      },
    },
    target: "es2017",
    minify: true,
    sourcemap: false,
  },
});
