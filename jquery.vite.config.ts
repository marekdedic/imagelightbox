/* eslint-env node */

import { resolve } from "path";
import webpackStats from "rollup-plugin-webpack-stats";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [webpackStats({ fileName: "webpack-stats.jquery.json" })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/lib/imagelightbox.jquery.ts"),
      name: "imagelightbox",
      fileName: "imagelightbox.jquery",
    },
    outDir: "../dist",
    sourcemap: true,
    rollupOptions: {
      external: ["jquery", "./imagelightbox"],
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
