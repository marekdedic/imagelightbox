/* eslint-env node */

import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
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
