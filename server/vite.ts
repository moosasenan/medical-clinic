// server/vite.ts
import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";

// دعم dirname في ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** سجل موحّد */
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

/**
 * تشغيل Vite فقط في وضع التطوير (محلياً)
 * لا يتم استدعاؤه في Vercel (بيئة الإنتاج)
 */
export async function setupVite(app: Express, server: Server) {
  if (process.env.NODE_ENV !== "development") return;

  const { createServer: createViteServer, createLogger } = await import("vite");
  const viteLogger = createLogger();

  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: { server } },
    appType: "custom",
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(__dirname, "../client/index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");

      // إعادة تحميل تلقائي أثناء التطوير
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

/**
 * في الإنتاج: تقديم الملفات المبنية
 */
export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "../dist/public");

  if (!fs.existsSync(distPath)) {
    console.warn(`[warn] لم يتم العثور على مجلد البناء: ${distPath}`);
    return;
  }

  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
