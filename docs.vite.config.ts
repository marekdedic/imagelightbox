/* eslint-env node */

import { defineConfig } from "vite";

export default defineConfig({
    build: {
        outDir: "../docs",
        sourcemap: true,
    },
    root: "src",
    base: "./",
});
