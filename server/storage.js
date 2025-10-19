import { db } from './db.js';

export class DatabaseStorage {
    // المستخدمين
    getUserByUsername(username) {
        return db.getUserByUsername(username);
    }

    getUserById(id) {
        return db.getUserById(id);
    }

    async createUser(username, passwordHash, role = 'user') {
        return await db.createUser(username, passwordHash, role);
    }

    // المرضى
    getAllPatients() {
        return db.getAllPatients();
    }

    getPatientById(id) {
        return db.getPatientById(id);
    }

    async createPatient(patientData) {
        return await db.createPatient(patientData);
    }

    async updatePatient(id, updates) {
        return await db.updatePatient(id, updates);
    }

    async deletePatient(id) {
        return await db.deletePatient(id);
    }

    // المواعيد
    getAllAppointments() {
        return db.getAllAppointments();
    }

    getAppointmentById(id) {
        return db.getAppointmentById(id);
    }

    async createAppointment(appointmentData) {
        return await db.createAppointment(appointmentData);
    }

    async updateAppointment(id, updates) {
        return await db.updateAppointment(id, updates);
    }

    async deleteAppointment(id) {
        return await db.deleteAppointment(id);
    }

    // الإحصائيات
    getStats() {
        return {
            patients: db.data.patients.length,
            appointments: db.data.appointments.length,
            users: db.data.users.length
        };
    }
}

export const storage = new DatabaseStorage();
