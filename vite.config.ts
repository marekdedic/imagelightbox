/* eslint-env node */

import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src/imagelightbox.ts"),
            name: "imagelightbox",
        },
        outDir: "../dist",
        rollupOptions: {
            external: ["jquery"],
            output: {
                globals: {
                    jquery: "$",
                },
            },
        },
    },
    root: "src",
});
