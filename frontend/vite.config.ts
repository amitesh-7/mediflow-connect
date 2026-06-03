import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "node:path";

// Base path: defaults to "/" so Vercel / Netlify / generic hosts work out of the box.
// Set VITE_BASE="/mediflow-connect/" (etc.) for sub-path deployments like GitHub Pages.
export default defineConfig(({ command }) => ({
  base: process.env.VITE_BASE || (command === "build" ? "/" : "/"),
  server: { host: "::", port: 3000 },
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
}));
