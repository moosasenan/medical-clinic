import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { storage } from './storage.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'medical-clinic-secret-key-2024';

// Middleware للمصادقة
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token مطلوب' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Token غير صالح' });
    }
    req.user = user;
    next();
  });
};

// Middleware للمسؤولين فقط
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'صلاحيات مسؤول مطلوبة' });
  }
  next();
};

// تسجيل الدخول
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'اسم المستخدم وكلمة المرور مطلوبان' });
    }

    const user = storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// تسجيل مستخدم جديد (للمسؤولين فقط)
router.post('/register', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'اسم المستخدم وكلمة المرور مطلوبان' });
    }

    const existingUser = storage.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'اسم المستخدم موجود مسبقاً' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = storage.createUser(username, passwordHash, role);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء المستخدم بنجاح',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// routes للمرضى
router.get('/patients', authenticateToken, (req, res) => {
  try {
    const patients = storage.getAllPatients();
    res.json({
      success: true,
      data: patients,
      count: patients.length
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: 'خطأ في جلب بيانات المرضى' });
  }
});

router.get('/patients/:id', authenticateToken, (req, res) => {
  try {
    const patient = storage.getPatientById(parseInt(req.params.id));
    if (!patient) {
      return res.status(404).json({ error: 'المريض غير موجود' });
    }
    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: 'خطأ في جلب بيانات المريض' });
  }
});

router.post('/patients', authenticateToken, (req, res) => {
  try {
    const { name, age, gender, phone, address } = req.body;

    if (!name || !age || !gender) {
      return res.status(400).json({ error: 'الاسم والعمر والجنس مطلوبان' });
    }

    const patient = storage.createPatient({
      name,
      age: parseInt(age),
      gender,
      phone,
      address
    });

    res.status(201).json({
      success: true,
      message: 'تم إضافة المريض بنجاح',
      data: patient
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ error: 'خطأ في إضافة المريض' });
  }
});

router.put('/patients/:id', authenticateToken, (req, res) => {
  try {
    const patient = storage.updatePatient(parseInt(req.params.id), req.body);
    if (!patient) {
      return res.status(404).json({ error: 'المريض غير موجود' });
    }

    res.json({
      success: true,
      message: 'تم تحديث بيانات المريض بنجاح',
      data: patient
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ error: 'خطأ في تحديث بيانات المريض' });
  }
});

router.delete('/patients/:id', authenticateToken, (req, res) => {
  try {
    const success = storage.deletePatient(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ error: 'المريض غير موجود' });
    }

    res.json({
      success: true,
      message: 'تم حذف المريض بنجاح'
    });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ error: 'خطأ في حذف المريض' });
  }
});

// routes للمواعيد
router.get('/appointments', authenticateToken, (req, res) => {
  try {
    const appointments = storage.getAllAppointments();
    res.json({
      success: true,
      data: appointments,
      count: appointments.length
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'خطأ في جلب بيانات المواعيد' });
  }
});

router.get('/appointments/:id', authenticateToken, (req, res) => {
  try {
    const appointment = storage.getAppointmentById(parseInt(req.params.id));
    if (!appointment) {
      return res.status(404).json({ error: 'الموعد غير موجود' });
    }
    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: 'خطأ في جلب بيانات الموعد' });
  }
});

router.post('/appointments', authenticateToken, (req, res) => {
  try {
    const { patient_id, doctor_name, appointment_date, status, notes } = req.body;

    if (!patient_id || !doctor_name || !appointment_date) {
      return res.status(400).json({ error: 'بيانات الموعد مطلوبة' });
    }

    const appointment = storage.createAppointment({
      patient_id: parseInt(patient_id),
      doctor_name,
      appointment_date,
      status: status || 'scheduled',
      notes
    });

    res.status(201).json({
      success: true,
      message: 'تم إضافة الموعد بنجاح',
      data: appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'خطأ في إضافة الموعد' });
  }
});

router.put('/appointments/:id', authenticateToken, (req, res) => {
  try {
    const appointment = storage.updateAppointment(parseInt(req.params.id), req.body);
    if (!appointment) {
      return res.status(404).json({ error: 'الموعد غير موجود' });
    }

    res.json({
      success: true,
      message: 'تم تحديث الموعد بنجاح',
      data: appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'خطأ في تحديث الموعد' });
  }
});

router.delete('/appointments/:id', authenticateToken, (req, res) => {
  try {
    const success = storage.deleteAppointment(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ error: 'الموعد غير موجود' });
    }

    res.json({
      success: true,
      message: 'تم حذف الموعد بنجاح'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ error: 'خطأ في حذف الموعد' });
  }
});

// الحصول على الإحصائيات
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const patientsCount = storage.getAllPatients().length;
    const appointmentsCount = storage.getAllAppointments().length;
    
    res.json({
      success: true,
      data: {
        patients: patientsCount,
        appointments: appointmentsCount
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'خطأ في جلب الإحصائيات' });
  }
});

export default router;
