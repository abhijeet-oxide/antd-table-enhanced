import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";

export default defineConfig({
  plugins: [
    react(),

    /**
     * Automatically injects the generated CSS into the library entry.
     *
     * Consumers only need:
     *
     * import { Table } from "antd-table-enhanced";
     */
    libInjectCss(),

    dts({
      insertTypesEntry: true,
      exclude: ["**/*.test.ts", "**/*.test.tsx"],
    }),
  ],

  build: {
    lib: {
      entry: "src/index.ts",
      name: "AntdTableEnhanced",
      fileName: (format) =>
        format === "es" ? "antd-table-enhanced.js" : "antd-table-enhanced.cjs",
      formats: ["es", "cjs"],
    },

    rollupOptions: {
      external: ["react", "react-dom", "antd", "@ant-design/icons"],
      output: {
        exports: "named",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "style.css";
          }

          return "assets/[name][extname]";
        },
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          antd: "antd",
          "@ant-design/icons": "icons",
        },
      },
    },

    cssCodeSplit: true,
    sourcemap: true,
    emptyOutDir: true,
  },
});
