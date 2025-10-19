import express from 'express';
import cors from 'cors';
import { initDatabase } from './db.js';
import routes from './routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// تهيئة قاعدة البيانات
await initDatabase();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.get('/health', (req, res) => {
    res.json({ 
        success: true,
        status: 'OK', 
        message: 'الخادم يعمل بشكل صحيح',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({ 
        success: true,
        message: 'مرحباً بك في نظام العيادة الطبية',
        endpoints: {
            health: '/health',
            login: 'POST /api/login',
            patients: 'GET /api/patients',
            appointments: 'GET /api/appointments'
        },
        credentials: {
            username: 'admin',
            password: 'admin123'
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});

export default app;
