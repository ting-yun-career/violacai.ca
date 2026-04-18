import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
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
