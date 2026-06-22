import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],

  // Required for GitHub Pages project sites:
  // https://abhijeet-oxide.github.io/antd-table-enhanced/
  base: process.env.GITHUB_PAGES === "true" ? "/antd-table-enhanced/" : "/",

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
