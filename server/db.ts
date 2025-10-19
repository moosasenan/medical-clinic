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
            appointments: []
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

    // المستخدمين
    getUserByUsername(username) {
        return this.data.users.find(user => user.username === username);
    }

    getUserById(id) {
        return this.data.users.find(user => user.id === id);
    }

    async createUser(username, passwordHash, role = 'user') {
        const user = {
            id: this.data.users.length + 1,
            username,
            password_hash: passwordHash,
            role,
            created_at: new Date().toISOString()
        };
        this.data.users.push(user);
        await this.save();
        return user;
    }

    // المرضى
    getAllPatients() {
        return this.data.patients;
    }

    getPatientById(id) {
        return this.data.patients.find(patient => patient.id === id);
    }

    async createPatient(patientData) {
        const patient = {
            id: this.data.patients.length + 1,
            ...patientData,
            created_at: new Date().toISOString()
        };
        this.data.patients.push(patient);
        await this.save();
        return patient;
    }

    // المواعيد
    getAllAppointments() {
        return this.data.appointments.map(appointment => {
            const patient = this.getPatientById(appointment.patient_id);
            return {
                ...appointment,
                patient_name: patient ? patient.name : 'Unknown'
            };
        });
    }

    async createAppointment(appointmentData) {
        const appointment = {
            id: this.data.appointments.length + 1,
            ...appointmentData,
            created_at: new Date().toISOString()
        };
        this.data.appointments.push(appointment);
        await this.save();
        
        const patient = this.getPatientById(appointment.patient_id);
        return {
            ...appointment,
            patient_name: patient ? patient.name : 'Unknown'
        };
    }
}

export const db = new JSONDatabase();

export async function initDatabase() {
    await db.load();
    
    // إنشاء مستخدم افتراضي إذا لم يكن موجوداً
    if (db.data.users.length === 0) {
        const passwordHash = await bcrypt.hash('admin123', 10);
        await db.createUser('admin', passwordHash, 'admin');
        console.log('✅ تم إنشاء المستخدم الافتراضي: admin / admin123');
    }

    // بيانات تجريبية للمرضى
    if (db.data.patients.length === 0) {
        const samplePatients = [
            { name: 'أحمد محمد', age: 35, gender: 'ذكر', phone: '0123456789', address: 'القاهرة - مصر' },
            { name: 'فاطمة علي', age: 28, gender: 'أنثى', phone: '0123456790', address: 'الإسكندرية - مصر' },
            { name: 'محمد إبراهيم', age: 45, gender: 'ذكر', phone: '0123456791', address: 'الجيزة - مصر' }
        ];

        for (const patient of samplePatients) {
            await db.createPatient(patient);
        }
        console.log('✅ تم إضافة بيانات تجريبية للمرضى');
    }

    console.log('✅ تم تهيئة قاعدة البيانات بنجاح');
}
