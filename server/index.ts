import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { initDatabase } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// تهيئة قاعدة البيانات
initDatabase();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// route للتحقق من صحة الخادم
app.get('/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    message: 'Medical Clinic API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'مرحباً بك في نظام العيادة الطبية',
    description: 'نظام إدارة العيادات الطبية - Medical Clinic Management System',
    endpoints: {
      health: '/health',
      auth: {
        login: 'POST /api/login',
        register: 'POST /api/register (Admin only)'
      },
      patients: {
        list: 'GET /api/patients',
        create: 'POST /api/patients',
        get: 'GET /api/patients/:id',
        update: 'PUT /api/patients/:id',
        delete: 'DELETE /api/patients/:id'
      },
      appointments: {
        list: 'GET /api/appointments',
        create: 'POST /api/appointments',
        get: 'GET /api/appointments/:id',
        update: 'PUT /api/appointments/:id',
        delete: 'DELETE /api/appointments/:id'
      },
      stats: 'GET /api/stats'
    },
    default_credentials: {
      username: 'admin',
      password: 'admin123'
    }
  });
});

// معالجة routes غير موجودة
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route غير موجود'
  });
});

// معالجة الأخطاء العامة
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'خطأ داخلي في الخادم'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Medical Clinic Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 Main API: http://localhost:${PORT}/`);
  console.log(`🔑 Default credentials: admin / admin123`);
});

export default app;
