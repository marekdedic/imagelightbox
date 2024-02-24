/* eslint-env node */

import { defineConfig } from "vite";

export default defineConfig({
    build: {
        outDir: "../docs",
    },
    root: "src",
    base: "./",
});
