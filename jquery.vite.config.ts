import { resolve } from "path";
import webpackStats from "rollup-plugin-webpack-stats";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/lib/imagelightbox.jquery.ts"),
      fileName: "imagelightbox.jquery",
      name: "imagelightbox",
    },
    outDir: "../dist",
    rollupOptions: {
      external: ["jquery"],
      output: {
        assetFileNames: "imagelightbox.[ext]",
        globals: {
          jquery: "jQuery",
        },
      },
    },
    sourcemap: true,
  },
  plugins: [webpackStats({ fileName: "webpack-stats.jquery.json" })],
  publicDir: false,
  root: "src",
});
