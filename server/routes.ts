import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { storage } from './storage.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
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
      message: 'تم إنشاء المستخدم بنجاح',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// routes للمرضى
router.get('/patients', authenticateToken, (req, res) => {
  try {
    const patients = storage.getAllPatients();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب بيانات المرضى' });
  }
});

router.post('/patients', authenticateToken, (req, res) => {
  try {
    const patient = storage.createPatient(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في إضافة المريض' });
  }
});

// routes للمواعيد
router.get('/appointments', authenticateToken, (req, res) => {
  try {
    const appointments = storage.getAllAppointments();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب بيانات المواعيد' });
  }
});

router.post('/appointments', authenticateToken, (req, res) => {
  try {
    const appointment = storage.createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في إضافة الموعد' });
  }
});

export default router;
