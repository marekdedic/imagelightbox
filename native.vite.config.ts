/* eslint-env node */

import { resolve } from "path";
import { webpackStats } from "rollup-plugin-webpack-stats";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [webpackStats({ fileName: "webpack-stats.native.json" })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/lib/imagelightbox.ts"),
      name: "imagelightbox",
      fileName: "imagelightbox",
    },
    outDir: "../dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        assetFileNames: "imagelightbox.[ext]",
      },
    },
  },
  root: "src",
  publicDir: false,
});
