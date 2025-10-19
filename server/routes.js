import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from './db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'medical-clinic-secret-key-2024';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'رمز الدخول مطلوب' });
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'رمز الدخول غير صالح' });
        req.user = user;
        next();
    });
};

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'اسم المستخدم وكلمة المرور مطلوبان' });
        }

        const user = db.getUserByUsername(username);
        if (!user) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });

        const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            success: true,
            token,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في الخادم' });
    }
});

router.get('/patients', authenticateToken, (req, res) => {
    try {
        const patients = db.getAllPatients();
        res.json({ success: true, data: patients });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في جلب المرضى' });
    }
});

router.get('/appointments', authenticateToken, (req, res) => {
    try {
        const appointments = db.getAllAppointments();
        res.json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في جلب المواعيد' });
    }
});

export default router;
