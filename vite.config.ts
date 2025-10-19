// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function loadReplitPlugins() {
  if (
    process.env.NODE_ENV !== "production" &&
    typeof process.env.REPL_ID !== "undefined"
  ) {
    const [{ cartographer }, { devBanner }] = await Promise.all([
      import("@replit/vite-plugin-cartographer"),
      import("@replit/vite-plugin-dev-banner")
    ]);

    return [cartographer(), devBanner()];
  }
  return [];
}

export default defineConfig(async () => {
  const replitPlugins = await loadReplitPlugins();
  const runtimeErrorOverlay = (await import("@replit/vite-plugin-runtime-error-modal")).default;

  return {
    plugins: [react(), runtimeErrorOverlay(), ...replitPlugins],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets")
      }
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true
    },
    server: {
      fs: { strict: true, deny: ["**/.*"] }
    }
  };
});
