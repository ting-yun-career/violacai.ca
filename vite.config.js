import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "build",
  },
  server: {
    port: 3000,
    open: true,
  },
  css: {
    postcss: './postcss.config.js',
  },
});
