import { resolve } from "path";
import webpackStats from "rollup-plugin-webpack-stats";
import dts from "unplugin-dts/vite";
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
  plugins: [
    dts({
      bundleTypes: true,
      entryRoot: "src/lib",
      exclude: ["src/lib/imagelightbox.jquery.ts"],
      include: ["src/lib/**/*.ts"],
      outDirs: "dist",
      root: __dirname,
    }),
    webpackStats({ fileName: "webpack-stats.native.json" }),
  ],
  publicDir: false,
  root: "src",
});
