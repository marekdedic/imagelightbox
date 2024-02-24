/* eslint-env node */

import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src/lib/imagelightbox.ts"),
            name: "imagelightbox",
        },
        outDir: "../dist",
        rollupOptions: {
            external: ["jquery"],
            output: {
                globals: {
                    jquery: "$",
                },
                assetFileNames: "imagelightbox.[ext]",
            },
        },
    },
    root: "src",
    publicDir: false,
});
