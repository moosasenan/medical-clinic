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
            nextIds: {
                users: 1,
                patients: 1,
                appointments: 1
            }
        };
    }

    async load() {
        try {
            const content = await fs.readFile(dbPath, 'utf-8');
            this.data = JSON.parse(content);
            console.log('✅ تم تحميل قاعدة البيانات');
        } catch (error) {
            console.log('📁 إنشاء قاعدة بيانات جديدة');
            await this.save();
        }
    }

    async save() {
        try {
            await fs.writeFile(dbPath, JSON.stringify(this.data, null, 2));
        } catch (error) {
            console.log('⚠️  لا يمكن حفظ قاعدة البيانات (مؤقت)');
        }
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

    // المرضى
    getAllPatients() {
        return this.data.patients.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    getPatientById(id) {
        return this.data.patients.find(patient => patient.id === id);
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

    async updatePatient(id, updates) {
        const index = this.data.patients.findIndex(p => p.id === id);
        if (index === -1) return null;
        
        this.data.patients[index] = { ...this.data.patients[index], ...updates };
        await this.save();
        return this.data.patients[index];
    }

    async deletePatient(id) {
        const index = this.data.patients.findIndex(p => p.id === id);
        if (index === -1) return false;
        
        this.data.patients.splice(index, 1);
        await this.save();
        return true;
    }

    // المواعيد
    getAllAppointments() {
        return this.data.appointments.map(appointment => {
            const patient = this.getPatientById(appointment.patient_id);
            return {
                ...appointment,
                patient_name: patient ? patient.name : 'غير معروف'
            };
        }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    getAppointmentById(id) {
        const appointment = this.data.appointments.find(apt => apt.id === id);
        if (!appointment) return null;
        
        const patient = this.getPatientById(appointment.patient_id);
        return {
            ...appointment,
            patient_name: patient ? patient.name : 'غير معروف'
        };
    }

    async createAppointment(appointmentData) {
        const appointment = {
            id: this.data.nextIds.appointments++,
            ...appointmentData,
            created_at: new Date().toISOString()
        };
        this.data.appointments.push(appointment);
        await this.save();
        
        return this.getAppointmentById(appointment.id);
    }

    async updateAppointment(id, updates) {
        const index = this.data.appointments.findIndex(apt => apt.id === id);
        if (index === -1) return null;
        
        this.data.appointments[index] = { ...this.data.appointments[index], ...updates };
        await this.save();
        return this.getAppointmentById(id);
    }

    async deleteAppointment(id) {
        const index = this.data.appointments.findIndex(apt => apt.id === id);
        if (index === -1) return false;
        
        this.data.appointments.splice(index, 1);
        await this.save();
        return true;
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

    // بيانات تجريبية للمواعيد
    if (db.data.appointments.length === 0 && db.data.patients.length > 0) {
        const sampleAppointments = [
            { patient_id: 1, doctor_name: 'د. علي حسين', appointment_date: new Date(Date.now() + 86400000).toISOString(), status: 'مجدول', notes: 'كشف دوري' },
            { patient_id: 2, doctor_name: 'د. سارة محمد', appointment_date: new Date(Date.now() + 172800000).toISOString(), status: 'مجدول', notes: 'متابعة علاج' }
        ];

        for (const appointment of sampleAppointments) {
            await db.createAppointment(appointment);
        }
        console.log('✅ تم إضافة بيانات تجريبية للمواعيد');
    }

    console.log('🎉 تم تهيئة النظام بالكامل بنجاح');
    console.log(`👥 عدد المرضى: ${db.data.patients.length}`);
    console.log(`📅 عدد المواعيد: ${db.data.appointments.length}`);
    console.log(`👤 عدد المستخدمين: ${db.data.users.length}`);
}
