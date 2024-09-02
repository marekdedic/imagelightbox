import { resolve } from "path";
import webpackStats from "rollup-plugin-webpack-stats";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/lib/imagelightbox.ts"),
      fileName: "imagelightbox",
      name: "imagelightbox",
    },
    outDir: "../dist",
    rollupOptions: {
      output: {
        assetFileNames: "imagelightbox.[ext]",
      },
    },
    sourcemap: true,
  },
  plugins: [webpackStats({ fileName: "webpack-stats.native.json" })],
  publicDir: false,
  root: "src",
});
