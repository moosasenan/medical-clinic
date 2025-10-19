import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertSpecialtySchema,
  insertDoctorProfileSchema,
  insertAppointmentSchema,
  insertPaymentSchema,
} from "@shared/schema";

// تعريف نوع الجلسة (Session) لتفادي أخطاء TypeScript
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    session: session.Session & Partial<session.SessionData>;
  }
}

const SALT_ROUNDS = 10;

export async function registerRoutes(app: Express): Promise<Server> {
  // ===== AUTHENTICATION =====

  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      req.session.userId = user.id;

      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Login failed" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId)
        return res.status(401).json({ message: "Not authenticated" });

      const user = await storage.getUser(req.session.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get user" });
    }
  });

  // ===== USERS =====
  app.get("/api/users", async (req, res) => {
    try {
      if (!req.session.userId)
        return res.status(401).json({ message: "Not authenticated" });

      const currentUser = await storage.getUser(req.session.userId);
      if (currentUser?.role !== "admin")
        return res.status(403).json({ message: "Forbidden" });

      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get users" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      if (!req.session.userId)
        return res.status(401).json({ message: "Not authenticated" });

      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser)
        return res.status(404).json({ message: "User not found" });

      if (currentUser.role !== "admin" && currentUser.id !== req.params.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updateData = req.body;
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, SALT_ROUNDS);
      }

      const user = await storage.updateUser(req.params.id, updateData);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update user" });
    }
  });

  // ===== SPECIALTIES =====
  app.post("/api/specialties", async (req, res) => {
    try {
      if (!req.session.userId)
        return res.status(401).json({ message: "Not authenticated" });

      const currentUser = await storage.getUser(req.session.userId);
      if (currentUser?.role !== "admin")
        return res.status(403).json({ message: "Forbidden" });

      const specialtyData = insertSpecialtySchema.parse(req.body);
      const specialty = await storage.createSpecialty(specialtyData);
      res.status(201).json(specialty);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create specialty" });
    }
  });

  // ===== APPOINTMENTS =====
  app.get("/api/appointments", async (req, res) => {
    try {
      if (!req.session.userId)
        return res.status(401).json({ message: "Not authenticated" });

      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser)
        return res.status(404).json({ message: "User not found" });

      let appointments;
      if (["admin", "accountant"].includes(currentUser.role)) {
        appointments = await storage.getAllAppointments();
      } else if (currentUser.role === "doctor") {
        appointments = await storage.getAppointmentsByDoctor(currentUser.id);
      } else {
        appointments = await storage.getAppointmentsByPatient(currentUser.id);
      }

      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get appointments" });
    }
  });

  // ===== PAYMENTS =====
  app.post("/api/payments", async (req, res) => {
    try {
      if (!req.session.userId)
        return res.status(401).json({ message: "Not authenticated" });

      const currentUser = await storage.getUser(req.session.userId);
      if (!["admin", "accountant"].includes(currentUser.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const paymentData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(paymentData);
      res.status(201).json(payment);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create payment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// 🛠️ الإصلاح: أضف هذا السطر في النهاية
export const routes = { registerRoutes };
