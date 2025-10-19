import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import {
  insertUserSchema,
  insertSpecialtySchema,
  insertDoctorProfileSchema,
  insertAppointmentSchema,
  insertPaymentSchema,
} from "@shared/schema";

const SALT_ROUNDS = 10;

export async function registerRoutes(app: Express): Promise<Server> {
  // ===== Authentication Routes =====

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

      const { password, ...userWithoutPassword } = user;
      req.session.userId = user.id;

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

  // ===== Users Routes =====

  app.get("/api/users", async (req, res) => {
    try {
      if (!req.session.userId)
        return res.status(401).json({ message: "Not authenticated" });

      const currentUser = await storage.getUser(req.session.userId);
      if (currentUser?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      if (!req.session.userId)
        return res.status(401).json({ message: "Not authenticated" });

      const user = await storage.getUser(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      if (!req.session.userId)
        return res.status(401).json({ message: "Not authenticated" });

      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser)
        return res.status(404).json({ message: "User not found" });

      if (currentUser?.role !== "admin" && currentUser?.id !== req.params.id) {
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

  app.delete("/api/users/:id", async (req, res) => {
    try {
      if (!req.session.userId)
        return res.status(401).json({ message: "Not authenticated" });

      const currentUser = await storage.getUser(req.session.userId);
      if (currentUser?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const success = await storage.deleteUser(req.params.id);
      if (!success) return res.status(404).json({ message: "User not found" });

      res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete user" });
    }
  });

  // ===== Specialties =====

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

  app.patch("/api/specialties/:id", async (req, res) => {
    try {
      if (!req.session.userId)
        return res.status(401).json({ message: "Not authenticated" });

      const currentUser = await storage.getUser(req.session.userId);
      if (currentUser?.role !== "admin")
        return res.status(403).json({ message: "Forbidden" });

      const specialty = await storage.updateSpecialty(req.params.id, req.body);
      if (!specialty) return res.status(404).json({ message: "Specialty not found" });
      res.json(specialty);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update specialty" });
    }
  });

  app.delete("/api/specialties/:id", async (req, res) => {
    try {
      if (!req.session.userId)
        return res.status(401).json({ message: "Not authenticated" });

      const currentUser = await storage.getUser(req.session.userId);
      if (currentUser?.role !== "admin")
        return res.status(403).json({ message: "Forbidden" });

      const success = await storage.deleteSpecialty(req.params.id);
      if (!success) return res.status(404).json({ message: "Specialty not found" });
      res.json({ message: "Specialty deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete specialty" });
    }
  });

  // ===== Doctor Profiles =====

  app.patch("/api/doctors/:id", async (req, res) => {
    try {
      if (!req.session.userId)
        return res.status(401).json({ message: "Not authenticated" });

      const currentUser = await storage.getUser(req.session.userId);
      const profile = await storage.getDoctorProfileById(req.params.id);

      if (!profile)
        return res.status(404).json({ message: "Doctor profile not found" });

      if (currentUser?.role !== "admin" && profile.userId !== currentUser?.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updatedProfile = await storage.updateDoctorProfile(req.params.id, req.body);
      res.json(updatedProfile);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update doctor profile" });
    }
  });

  // ===== Appointments =====

  app.get("/api/appointments", async (req, res) => {
    try {
      if (!req.session.userId)
        return res.status(401).json({ message: "Not authenticated" });

      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser)
        return res.status(404).json({ message: "User not found" });

      let appointments;
      if (["admin", "accountant"].includes(currentUser?.role)) {
        appointments = await storage.getAllAppointments();
      } else if (currentUser?.role === "doctor") {
        appointments = await storage.getAppointmentsByDoctor(currentUser?.id);
      } else {
        appointments = await storage.getAppointmentsByPatient(currentUser?.id);
      }

      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get appointments" });
    }
  });

  app.patch("/api/appointments/:id", async (req, res) => {
    try {
      if (!req.session.userId)
        return res.status(401).json({ message: "Not authenticated" });

      const currentUser = await storage.getUser(req.session.userId);
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment)
        return res.status(404).json({ message: "Appointment not found" });

      if (
        currentUser?.role !== "admin" &&
        appointment.patientId !== currentUser?.id &&
        appointment.doctorId !== currentUser?.id
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updatedAppointment = await storage.updateAppointment(req.params.id, req.body);
      res.json(updatedAppointment);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update appointment" });
    }
  });

  // ===== Payments =====

  app.post("/api/payments", async (req, res) => {
    try {
      if (!req.session.userId)
        return res.status(401).json({ message: "Not authenticated" });

      const currentUser = await storage.getUser(req.session.userId);
      if (!["admin", "accountant"].includes(currentUser?.role || "")) {
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
