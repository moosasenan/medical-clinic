// server/vite.ts
import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";

// حل بديل لـ __dirname في ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * دالة تسجيل موحّدة (تظهر الوقت والمصدر)
 */
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
 * إعداد Vite في بيئة التطوير فقط
 * لا تعمل هذه الدالة في بيئة الإنتاج (Vercel)
 */
export async function setupVite(app: Express, server: Server) {
  if (process.env.NODE_ENV !== "development") {
    log("Skipping Vite setup (production mode)");
    return;
  }

  // التحميل الديناميكي لتفادي أخطاء Vercel
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

  // استبدال index.html في أثناء التطوير
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(__dirname, "../client/index.html");

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
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
 * في بيئة الإنتاج: تقديم الملفات الثابتة من dist/public
 */
export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "../dist/public");

  if (!fs.existsSync(distPath)) {
    console.warn(`[warn] لم يتم العثور على مجلد البناء: ${distPath}`);
    return;
  }

  app.use(express.static(distPath));

  // fallback لأي مسار غير موجود
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
