import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'database.json');

class JSONDatabase {
    constructor() {
        this.data = {
            users: [],
            patients: [],
            appointments: [],
            nextIds: { users: 1, patients: 1, appointments: 1 }
        };
    }

    async load() {
        try {
            const content = await fs.readFile(dbPath, 'utf-8');
            this.data = JSON.parse(content);
        } catch (error) {
            await this.save();
        }
    }

    async save() {
        await fs.writeFile(dbPath, JSON.stringify(this.data, null, 2));
    }

    getUserByUsername(username) {
        return this.data.users.find(user => user.username === username);
    }

    async createUser(username, passwordHash, role = 'user') {
        const user = {
            id: this.data.nextIds.users++,
            username,
            password_hash: passwordHash,
            role,
            created_at: new Date().toISOString()
        };
        this.data.users.push(user);
        await this.save();
        return user;
    }

    getAllPatients() {
        return this.data.patients;
    }

    async createPatient(patientData) {
        const patient = {
            id: this.data.nextIds.patients++,
            ...patientData,
            created_at: new Date().toISOString()
        };
        this.data.patients.push(patient);
        await this.save();
        return patient;
    }

    getAllAppointments() {
        return this.data.appointments.map(apt => {
            const patient = this.data.patients.find(p => p.id === apt.patient_id);
            return { ...apt, patient_name: patient ? patient.name : 'غير معروف' };
        });
    }

    async createAppointment(appointmentData) {
        const appointment = {
            id: this.data.nextIds.appointments++,
            ...appointmentData,
            created_at: new Date().toISOString()
        };
        this.data.appointments.push(appointment);
        await this.save();
        return this.getAllAppointments().find(apt => apt.id === appointment.id);
    }
}

export const db = new JSONDatabase();

export async function initDatabase() {
    await db.load();
    
    if (db.data.users.length === 0) {
        const passwordHash = await bcrypt.hash('admin123', 10);
        await db.createUser('admin', passwordHash, 'admin');
    }

    if (db.data.patients.length === 0) {
        const patients = [
            { name: 'أحمد محمد', age: 35, gender: 'ذكر', phone: '0123456789', address: 'القاهرة' },
            { name: 'فاطمة علي', age: 28, gender: 'أنثى', phone: '0123456790', address: 'الإسكندرية' }
        ];
        for (const patient of patients) {
            await db.createPatient(patient);
        }
    }
}
