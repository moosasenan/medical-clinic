import { db } from './db.js';

export interface User {
  id: number;
  username: string;
  password_hash: string;
  role: string;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone?: string;
  address?: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_name: string;
  appointment_date: string;
  status: string;
  notes?: string;
}

export class DatabaseStorage {
  // إدارة المستخدمين
  getUserByUsername(username: string): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as User | undefined;
  }

  createUser(username: string, passwordHash: string, role: string = 'user'): User {
    const stmt = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)');
    const result = stmt.run(username, passwordHash, role);
    return { id: result.lastInsertRowid as number, username, password_hash: passwordHash, role };
  }

  // إدارة المرضى
  getAllPatients(): Patient[] {
    const stmt = db.prepare('SELECT * FROM patients ORDER BY created_at DESC');
    return stmt.all() as Patient[];
  }

  createPatient(patient: Omit<Patient, 'id'>): Patient {
    const stmt = db.prepare('INSERT INTO patients (name, age, gender, phone, address) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(patient.name, patient.age, patient.gender, patient.phone, patient.address);
    return { id: result.lastInsertRowid as number, ...patient };
  }

  // إدارة المواعيد
  getAllAppointments(): Appointment[] {
    const stmt = db.prepare(`
      SELECT a.*, p.name as patient_name 
      FROM appointments a 
      LEFT JOIN patients p ON a.patient_id = p.id 
      ORDER BY a.appointment_date DESC
    `);
    return stmt.all() as Appointment[];
  }

  createAppointment(appointment: Omit<Appointment, 'id'>): Appointment {
    const stmt = db.prepare(`
      INSERT INTO appointments (patient_id, doctor_name, appointment_date, status, notes) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      appointment.patient_id,
      appointment.doctor_name,
      appointment.appointment_date,
      appointment.status,
      appointment.notes
    );
    return { id: result.lastInsertRowid as number, ...appointment };
  }
}

export const storage = new DatabaseStorage();
