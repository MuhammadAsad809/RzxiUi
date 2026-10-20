import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ entryRoot: "src", outDir: "dist", insertTypesEntry: true })],
  build: {
    lib: {
      entry: { index: "src/index.ts", "three-entry": "src/three-entry.ts" },
      formats: ["es"],
      fileName: (_format, entryName) => entryName === "three-entry" ? "three.js" : "index.js",
      cssFileName: "styles",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "framer-motion", "gsap", "three", "@react-three/fiber", "@react-three/drei"],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
