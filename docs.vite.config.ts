/* eslint-env node */

import { defineConfig } from "vite";
import IstanbulPlugin from "vite-plugin-istanbul";

export default defineConfig({
    plugins: [IstanbulPlugin({ include: "src/lib/**/*.ts" })],
    build: {
        outDir: "../docs",
        sourcemap: true,
    },
    root: "src",
    base: "./",
});
