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
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      // Set session
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

      // Set session
      req.session.userId = user.id;

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Login failed" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get user" });
    }
  });

  // ===== Users Routes =====
  
  // Get all users (admin only)
  app.get("/api/users", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const users = await storage.getAllUsers();
      // Remove passwords from response
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get users" });
    }
  });

  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get user" });
    }
  });

  // Update user (admin or self)
  app.patch("/api/users/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check authorization
      if (currentUser.role !== "admin" && currentUser.id !== req.params.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updateData = req.body;
      
      // Hash password if updating
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, SALT_ROUNDS);
      }

      const user = await storage.updateUser(req.params.id, updateData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update user" });
    }
  });

  // Delete user (admin only)
  app.delete("/api/users/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete user" });
    }
  });

  // ===== Specialties Routes =====
  
  // Get all specialties
  app.get("/api/specialties", async (req, res) => {
    try {
      const specialties = await storage.getAllSpecialties();
      res.json(specialties);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get specialties" });
    }
  });

  // Get specialty by ID
  app.get("/api/specialties/:id", async (req, res) => {
    try {
      const specialty = await storage.getSpecialty(req.params.id);
      if (!specialty) {
        return res.status(404).json({ message: "Specialty not found" });
      }
      res.json(specialty);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get specialty" });
    }
  });

  // Create specialty (admin only)
  app.post("/api/specialties", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const specialtyData = insertSpecialtySchema.parse(req.body);
      const specialty = await storage.createSpecialty(specialtyData);
      res.status(201).json(specialty);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create specialty" });
    }
  });

  // Update specialty (admin only)
  app.patch("/api/specialties/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const specialty = await storage.updateSpecialty(req.params.id, req.body);
      if (!specialty) {
        return res.status(404).json({ message: "Specialty not found" });
      }
      res.json(specialty);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update specialty" });
    }
  });

  // Delete specialty (admin only)
  app.delete("/api/specialties/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const success = await storage.deleteSpecialty(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Specialty not found" });
      }
      res.json({ message: "Specialty deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete specialty" });
    }
  });

  // ===== Doctor Profiles Routes =====
  
  // Get all doctors
  app.get("/api/doctors", async (req, res) => {
    try {
      const doctors = await storage.getAllDoctorProfiles();
      res.json(doctors);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get doctors" });
    }
  });

  // Get doctors by specialty
  app.get("/api/doctors/specialty/:specialtyId", async (req, res) => {
    try {
      const doctors = await storage.getDoctorsBySpecialty(req.params.specialtyId);
      res.json(doctors);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get doctors" });
    }
  });

  // Get doctor profile by user ID
  app.get("/api/doctors/user/:userId", async (req, res) => {
    try {
      const profile = await storage.getDoctorProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get doctor profile" });
    }
  });

  // Create doctor profile (admin only)
  app.post("/api/doctors", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const profileData = insertDoctorProfileSchema.parse(req.body);
      const profile = await storage.createDoctorProfile(profileData);
      res.status(201).json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create doctor profile" });
    }
  });

  // Update doctor profile
  app.patch("/api/doctors/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const currentUser = await storage.getUser(req.session.userId);
      const profile = await storage.getDoctorProfileById(req.params.id);
      
      if (!profile) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      // Check authorization: admin or doctor owner
      if (currentUser.role !== "admin" && profile.userId !== currentUser.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updatedProfile = await storage.updateDoctorProfile(req.params.id, req.body);
      res.json(updatedProfile);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update doctor profile" });
    }
  });

  // ===== Appointments Routes =====
  
  // Get all appointments with enriched data
  app.get("/api/appointments", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      let appointments;
      
      if (currentUser.role === "admin" || currentUser.role === "accountant") {
        appointments = await storage.getAllAppointments();
      } else if (currentUser.role === "doctor") {
        appointments = await storage.getAppointmentsByDoctor(currentUser.id);
      } else {
        appointments = await storage.getAppointmentsByPatient(currentUser.id);
      }

      // Enrich appointments with doctor, patient, and specialty names
      const enrichedAppointments = await Promise.all(
        appointments.map(async (apt) => {
          const [doctor, patient, specialty] = await Promise.all([
            storage.getUser(apt.doctorId),
            storage.getUser(apt.patientId),
            storage.getSpecialty(apt.specialtyId),
          ]);
          
          return {
            ...apt,
            doctorName: doctor?.name || "Unknown",
            patientName: patient?.name || "Unknown",
            specialtyName: specialty?.nameAr || "Unknown",
          };
        })
      );

      res.json(enrichedAppointments);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get appointments" });
    }
  });

  // Get appointment by ID
  app.get("/api/appointments/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      const currentUser = await storage.getUser(req.session.userId);
      
      // Check authorization
      if (
        currentUser.role !== "admin" &&
        currentUser.role !== "accountant" &&
        appointment.patientId !== currentUser.id &&
        appointment.doctorId !== currentUser.id
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      res.json(appointment);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get appointment" });
    }
  });

  // Create appointment
  app.post("/api/appointments", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create appointment" });
    }
  });

  // Update appointment
  app.patch("/api/appointments/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const currentUser = await storage.getUser(req.session.userId);
      const appointment = await storage.getAppointment(req.params.id);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      // Check authorization
      if (
        currentUser.role !== "admin" &&
        appointment.patientId !== currentUser.id &&
        appointment.doctorId !== currentUser.id
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updatedAppointment = await storage.updateAppointment(req.params.id, req.body);
      res.json(updatedAppointment);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update appointment" });
    }
  });

  // Delete appointment
  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const currentUser = await storage.getUser(req.session.userId);
      const appointment = await storage.getAppointment(req.params.id);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      // Check authorization
      if (
        currentUser.role !== "admin" &&
        appointment.patientId !== currentUser.id
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const success = await storage.deleteAppointment(req.params.id);
      res.json({ message: "Appointment deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete appointment" });
    }
  });

  // ===== Payments Routes =====
  
  // Get all payments (admin/accountant only)
  app.get("/api/payments", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "accountant")) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get payments" });
    }
  });

  // Get payment by appointment
  app.get("/api/payments/appointment/:appointmentId", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const payment = await storage.getPaymentByAppointment(req.params.appointmentId);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get payment" });
    }
  });

  // Create payment (admin/accountant only)
  app.post("/api/payments", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const currentUser = await storage.getUser(req.session.userId);
      if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "accountant")) {
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
