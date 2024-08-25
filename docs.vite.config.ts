import { defineConfig } from "vite";
import istanbulPlugin from "vite-plugin-istanbul";

export default defineConfig({
  base: "./",
  build: {
    outDir: "../docs",
    sourcemap: true,
  },
  plugins: [istanbulPlugin({ include: "src/lib/**/*.ts" })],
  root: "src",
});
