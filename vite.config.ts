import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(async ({ mode }) => {
  // `mode` is the reliable way to detect production for Vite builds.
  const isProd = mode === "production" || process.env.NODE_ENV === "production";
  const isReplit = process.env.REPL_ID !== undefined;

  return {
    plugins: [
      react(),

      // Do not ship Replit's runtime error overlay to production (e.g. Netlify),
      // otherwise users may see a big red error modal in the deployed site.
      ...(!isProd ? [runtimeErrorOverlay()] : []),

      // Replit-only dev tooling.
      ...(!isProd && isReplit
        ? [
            await import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer(),
            ),
            await import("@replit/vite-plugin-dev-banner").then((m) =>
              m.devBanner(),
            ),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
