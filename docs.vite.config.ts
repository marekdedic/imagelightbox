import { defineConfig } from "vite";
import istanbulPlugin from "vite-plugin-istanbul";

export default defineConfig({
  plugins: [istanbulPlugin({ include: "src/lib/**/*.ts" })],
  build: {
    outDir: "../docs",
    sourcemap: true,
  },
  root: "src",
  base: "./",
});
