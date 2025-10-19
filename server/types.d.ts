// server/types.d.ts
import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    // إذا تحتاج حقول أخرى في الجلسة أضفها هنا
  }
}

// في حال بعض الحزم ليس لها types، نعلنها كـ any لتخطي أخطاء tsc
declare module "bcrypt";
declare module "ws";
declare module "vite";
declare module "@replit/vite-plugin-cartographer";
declare module "@replit/vite-plugin-dev-banner";
declare module "@replit/vite-plugin-runtime-error-modal";
