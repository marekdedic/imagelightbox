/* eslint-env node */

import { resolve } from "path";
import { webpackStats } from "rollup-plugin-webpack-stats";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [webpackStats()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/lib/imagelightbox.ts"),
      name: "imagelightbox",
    },
    outDir: "../dist",
    sourcemap: true,
    rollupOptions: {
      external: ["jquery"],
      output: {
        globals: {
          jquery: "jQuery",
        },
        assetFileNames: "imagelightbox.[ext]",
      },
    },
  },
  root: "src",
  publicDir: false,
});
