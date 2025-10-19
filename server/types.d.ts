// server/types.d.ts
import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

// تجاوزات لأنواع ناقصة
declare module "bcrypt";
declare module "ws";
declare module "vite";
declare module "@replit/vite-plugin-cartographer";
declare module "@replit/vite-plugin-dev-banner";
declare module "@replit/vite-plugin-runtime-error-modal";
