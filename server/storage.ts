import { db } from './db.js';

export interface User {
  id: number;
  username: string;
  password_hash: string;
  role: string;
  created_at?: string;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone?: string;
  address?: string;
  created_at?: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_name: string;
  appointment_date: string;
  status: string;
  notes?: string;
  created_at?: string;
  patient_name?: string;
}

export class DatabaseStorage {
  // إدارة المستخدمين
  getUserByUsername(username: string): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as User | undefined;
  }

  getUserById(id: number): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | undefined;
  }

  createUser(username: string, passwordHash: string, role: string = 'user'): User {
    const stmt = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)');
    const result = stmt.run(username, passwordHash, role);
    return this.getUserById(result.lastInsertRowid as number)!;
  }

  // إدارة المرضى
  getAllPatients(): Patient[] {
    const stmt = db.prepare('SELECT * FROM patients ORDER BY created_at DESC');
    return stmt.all() as Patient[];
  }

  getPatientById(id: number): Patient | undefined {
    const stmt = db.prepare('SELECT * FROM patients WHERE id = ?');
    return stmt.get(id) as Patient | undefined;
  }

  createPatient(patient: Omit<Patient, 'id'>): Patient {
    const stmt = db.prepare('INSERT INTO patients (name, age, gender, phone, address) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(
      patient.name,
      patient.age,
      patient.gender,
      patient.phone,
      patient.address
    );
    return this.getPatientById(result.lastInsertRowid as number)!;
  }

  updatePatient(id: number, patient: Partial<Patient>): Patient | undefined {
    const updates: string[] = [];
    const values: any[] = [];

    if (patient.name) { updates.push('name = ?'); values.push(patient.name); }
    if (patient.age) { updates.push('age = ?'); values.push(patient.age); }
    if (patient.gender) { updates.push('gender = ?'); values.push(patient.gender); }
    if (patient.phone !== undefined) { updates.push('phone = ?'); values.push(patient.phone); }
    if (patient.address !== undefined) { updates.push('address = ?'); values.push(patient.address); }

    if (updates.length === 0) return this.getPatientById(id);

    values.push(id);
    const stmt = db.prepare(`UPDATE patients SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return this.getPatientById(id);
  }

  deletePatient(id: number): boolean {
    const stmt = db.prepare('DELETE FROM patients WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
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

  getAppointmentById(id: number): Appointment | undefined {
    const stmt = db.prepare(`
      SELECT a.*, p.name as patient_name 
      FROM appointments a 
      LEFT JOIN patients p ON a.patient_id = p.id 
      WHERE a.id = ?
    `);
    return stmt.get(id) as Appointment | undefined;
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
    return this.getAppointmentById(result.lastInsertRowid as number)!;
  }

  updateAppointment(id: number, appointment: Partial<Appointment>): Appointment | undefined {
    const updates: string[] = [];
    const values: any[] = [];

    if (appointment.patient_id) { updates.push('patient_id = ?'); values.push(appointment.patient_id); }
    if (appointment.doctor_name) { updates.push('doctor_name = ?'); values.push(appointment.doctor_name); }
    if (appointment.appointment_date) { updates.push('appointment_date = ?'); values.push(appointment.appointment_date); }
    if (appointment.status) { updates.push('status = ?'); values.push(appointment.status); }
    if (appointment.notes !== undefined) { updates.push('notes = ?'); values.push(appointment.notes); }

    if (updates.length === 0) return this.getAppointmentById(id);

    values.push(id);
    const stmt = db.prepare(`UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return this.getAppointmentById(id);
  }

  deleteAppointment(id: number): boolean {
    const stmt = db.prepare('DELETE FROM appointments WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

export const storage = new DatabaseStorage();
