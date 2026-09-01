import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { defineConfig } from "vite";
import istanbulPlugin from "vite-plugin-istanbul";

export default defineConfig({
  base: "./",
  build: {
    outDir: "../docs",
    sourcemap: true,
    target: "es2017",
  },
  css: {
    lightningcss: { targets: browserslistToTargets(browserslist()) },
    transformer: "lightningcss",
  },
  plugins: [istanbulPlugin({ include: "src/lib/**/*.ts" })],
  root: "src",
});
