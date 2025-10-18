// Referenced from javascript_database blueprint - updated with complete IStorage interface
import {
  users,
  specialties,
  doctorProfiles,
  appointments,
  payments,
  type User,
  type InsertUser,
  type Specialty,
  type InsertSpecialty,
  type DoctorProfile,
  type InsertDoctorProfile,
  type Appointment,
  type InsertAppointment,
  type Payment,
  type InsertPayment,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;

  // Specialties
  getSpecialty(id: string): Promise<Specialty | undefined>;
  getAllSpecialties(): Promise<Specialty[]>;
  createSpecialty(specialty: InsertSpecialty): Promise<Specialty>;
  updateSpecialty(id: string, specialty: Partial<InsertSpecialty>): Promise<Specialty | undefined>;
  deleteSpecialty(id: string): Promise<boolean>;

  // Doctor Profiles
  getDoctorProfile(userId: string): Promise<DoctorProfile | undefined>;
  getDoctorProfileById(id: string): Promise<DoctorProfile | undefined>;
  getAllDoctorProfiles(): Promise<DoctorProfile[]>;
  getDoctorsBySpecialty(specialtyId: string): Promise<DoctorProfile[]>;
  createDoctorProfile(profile: InsertDoctorProfile): Promise<DoctorProfile>;
  updateDoctorProfile(id: string, profile: Partial<InsertDoctorProfile>): Promise<DoctorProfile | undefined>;
  deleteDoctorProfile(id: string): Promise<boolean>;

  // Appointments
  getAppointment(id: string): Promise<Appointment | undefined>;
  getAllAppointments(): Promise<Appointment[]>;
  getAppointmentsByPatient(patientId: string): Promise<Appointment[]>;
  getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: string): Promise<boolean>;

  // Payments
  getPayment(id: string): Promise<Payment | undefined>;
  getAllPayments(): Promise<Payment[]>;
  getPaymentByAppointment(appointmentId: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role as any));
  }

  // Specialties
  async getSpecialty(id: string): Promise<Specialty | undefined> {
    const [specialty] = await db.select().from(specialties).where(eq(specialties.id, id));
    return specialty || undefined;
  }

  async getAllSpecialties(): Promise<Specialty[]> {
    return await db.select().from(specialties).orderBy(specialties.nameAr);
  }

  async createSpecialty(insertSpecialty: InsertSpecialty): Promise<Specialty> {
    const [specialty] = await db
      .insert(specialties)
      .values(insertSpecialty)
      .returning();
    return specialty;
  }

  async updateSpecialty(id: string, specialtyData: Partial<InsertSpecialty>): Promise<Specialty | undefined> {
    const [specialty] = await db
      .update(specialties)
      .set(specialtyData)
      .where(eq(specialties.id, id))
      .returning();
    return specialty || undefined;
  }

  async deleteSpecialty(id: string): Promise<boolean> {
    const result = await db.delete(specialties).where(eq(specialties.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Doctor Profiles
  async getDoctorProfile(userId: string): Promise<DoctorProfile | undefined> {
    const [profile] = await db
      .select()
      .from(doctorProfiles)
      .where(eq(doctorProfiles.userId, userId));
    return profile || undefined;
  }

  async getDoctorProfileById(id: string): Promise<DoctorProfile | undefined> {
    const [profile] = await db
      .select()
      .from(doctorProfiles)
      .where(eq(doctorProfiles.id, id));
    return profile || undefined;
  }

  async getAllDoctorProfiles(): Promise<DoctorProfile[]> {
    return await db.select().from(doctorProfiles);
  }

  async getDoctorsBySpecialty(specialtyId: string): Promise<DoctorProfile[]> {
    return await db
      .select()
      .from(doctorProfiles)
      .where(eq(doctorProfiles.specialtyId, specialtyId));
  }

  async createDoctorProfile(insertProfile: InsertDoctorProfile): Promise<DoctorProfile> {
    const [profile] = await db
      .insert(doctorProfiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateDoctorProfile(id: string, profileData: Partial<InsertDoctorProfile>): Promise<DoctorProfile | undefined> {
    const [profile] = await db
      .update(doctorProfiles)
      .set(profileData)
      .where(eq(doctorProfiles.id, id))
      .returning();
    return profile || undefined;
  }

  async deleteDoctorProfile(id: string): Promise<boolean> {
    const result = await db.delete(doctorProfiles).where(eq(doctorProfiles.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Appointments
  async getAppointment(id: string): Promise<Appointment | undefined> {
    const [appointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .orderBy(desc(appointments.appointmentDate));
  }

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.patientId, patientId))
      .orderBy(desc(appointments.appointmentDate));
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.doctorId, doctorId))
      .orderBy(desc(appointments.appointmentDate));
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db
      .insert(appointments)
      .values(insertAppointment)
      .returning();
    return appointment;
  }

  async updateAppointment(id: string, appointmentData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [appointment] = await db
      .update(appointments)
      .set(appointmentData)
      .where(eq(appointments.id, id))
      .returning();
    return appointment || undefined;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const result = await db.delete(appointments).where(eq(appointments.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Payments
  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }

  async getAllPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.paidAt));
  }

  async getPaymentByAppointment(appointmentId: string): Promise<Payment | undefined> {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.appointmentId, appointmentId));
    return payment || undefined;
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values(insertPayment)
      .returning();
    return payment;
  }
}

export const storage = new DatabaseStorage();
