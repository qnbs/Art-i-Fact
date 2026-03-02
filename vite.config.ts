import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    // GitHub Pages deploys to /Art-i-Fact/
    base: "/Art-i-Fact/",

    server: {
      port: 3000,
      host: "0.0.0.0",
    },

    plugins: [react()],

    // Only inject API_KEY during local development (empty in production)
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY || ""),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY || ""),
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },

    build: {
      target: "es2020",
      minify: "terser",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom/client"],
            "redux-vendor": ["@reduxjs/toolkit", "react-redux"],
            "ai-vendor": ["@google/genai"],
          },
          assetFileNames: "assets/[name]-[hash][extname]",
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
        },
      },
      chunkSizeWarningLimit: 600,
    },
  };
});
