import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// =============================================================================
// Vite Configuration - GitHub Pages
// =============================================================================

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    jsxLocPlugin(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },

  // Environment variables
  envDir: path.resolve(import.meta.dirname),

  // React application root
  root: path.resolve(import.meta.dirname, "client"),

  // GitHub Pages repository path
  base: "/HusamProfile/",

  build: {
    // GitHub Pages deployment folder
    outDir: path.resolve(import.meta.dirname, "dist"),

    emptyOutDir: true,
  },

  server: {
    port: 3000,
    strictPort: false,
    host: true,
  },
});
