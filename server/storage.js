import { db } from './db.js';

export class DatabaseStorage {
    getUserByUsername(username) {
        return db.getUserByUsername(username);
    }
    
    async createUser(username, passwordHash, role) {
        return await db.createUser(username, passwordHash, role);
    }
    
    getAllPatients() {
        return db.getAllPatients();
    }
    
    async createPatient(patientData) {
        return await db.createPatient(patientData);
    }
    
    getAllAppointments() {
        return db.getAllAppointments();
    }
    
    async createAppointment(appointmentData) {
        return await db.createAppointment(appointmentData);
    }
}

export const storage = new DatabaseStorage();
