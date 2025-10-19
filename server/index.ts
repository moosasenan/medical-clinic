import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { createServer } from "http";
import { setupVite, serveStatic, log } from "./vite";
import "./types"; // لتوسيع تعريف session

// ============ إعداد تطبيق Express ============
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ============ إعداد الجلسات ============
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "clinic-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // أسبوع
    },
  })
);

// ============ تسجيل الطلبات (Logging) ============
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 100) logLine = logLine.slice(0, 99) + "…";
      log(logLine);
    }
  });

  next();
});

// ============ تشغيل السيرفر ============
(async () => {
  const httpServer = createServer(app);
  await registerRoutes(app);

  // معالجة الأخطاء العامة
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error("Server error:", err);
  });

  // في وضع التطوير استخدم vite
  if (app.get("env") === "development") {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  // المنفذ (port)
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(port, "0.0.0.0", () => {
    log(`✅ Server running on http://localhost:${port}`);
  });
})();
