import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@rzxiui/react/styles.css": path.resolve(__dirname, "../../packages/react/src/styles.css"),
      "@rzxiui/react/three": path.resolve(__dirname, "../../packages/react/src/three-entry.ts"),
      "@rzxiui/react": path.resolve(__dirname, "../../packages/react/src/index.ts"),
      "@rzxiui/tokens": path.resolve(__dirname, "../../packages/tokens/src/index.ts"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});

