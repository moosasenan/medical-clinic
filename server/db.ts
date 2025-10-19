import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');

export const db = new Database(dbPath);

// تهيئة الجداول
export function initDatabase() {
  // جدول المستخدمين
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // جدول المرضى
  db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // جدول المواعيد
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      doctor_name TEXT NOT NULL,
      appointment_date DATETIME NOT NULL,
      status TEXT DEFAULT 'scheduled',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
  `);

  // إنشاء مستخدم افتراضي إذا لم يكن موجوداً
  const userCheck = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  
  if (userCheck.count === 0) {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    
    db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)')
      .run('admin', passwordHash, 'admin');
    
    console.log('✅ تم إنشاء المستخدم الافتراضي: admin / admin123');
  }

  // إضافة بيانات تجريبية للمرضى
  const patientCheck = db.prepare('SELECT COUNT(*) as count FROM patients').get() as { count: number };
  
  if (patientCheck.count === 0) {
    const patients = [
      ['أحمد محمد', 35, 'ذكر', '0123456789', 'القاهرة - مصر'],
      ['فاطمة علي', 28, 'أنثى', '0123456790', 'الإسكندرية - مصر'],
      ['محمد إبراهيم', 45, 'ذكر', '0123456791', 'الجيزة - مصر']
    ];

    const insertPatient = db.prepare('INSERT INTO patients (name, age, gender, phone, address) VALUES (?, ?, ?, ?, ?)');
    
    for (const patient of patients) {
      insertPatient.run(...patient);
    }

    console.log('✅ تم إضافة بيانات تجريبية للمرضى');
  }

  console.log('✅ تم تهيئة قاعدة البيانات بنجاح');
}

initDatabase();
