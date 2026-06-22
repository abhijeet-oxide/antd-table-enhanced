import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],

  base: process.env.GITHUB_PAGES === "true" ? "/antd-table-enhanced/" : "/",

  resolve: {
    alias: {
      "antd-table-enhanced": path.resolve(__dirname, "../../src/index.ts"),
    },
  },

  server: {
    fs: {
      allow: [path.resolve(__dirname, "../..")],
    },
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
