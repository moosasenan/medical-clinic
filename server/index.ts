import express from 'express';
import session from 'express-session';
import { app } from './app.js';
import { storage } from './storage.js';

const server = express();
const PORT = process.env.PORT || 5000;

// إعدادات الجلسة
server.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  store: storage,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

server.use(express.json());

// مسارات API أساسية (مؤقتة)
server.post("/api/auth/login", (req, res) => {
  res.json({ 
    message: "Login endpoint - under development", 
    status: "success",
    user: { id: "1", name: "Test User", role: "admin" }
  });
});

server.post("/api/auth/register", (req, res) => {
  res.json({ 
    message: "Register endpoint - under development", 
    status: "success",
    user: { id: "1", name: "Test User", role: "patient" }
  });
});

server.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Medical Clinic API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// مسارات للأدوار المختلفة
server.get("/api/admin/dashboard", (req, res) => {
  res.json({
    role: "admin",
    message: "Admin dashboard data",
    stats: { users: 150, appointments: 45, revenue: 12500 }
  });
});

server.get("/api/doctor/dashboard", (req, res) => {
  res.json({
    role: "doctor", 
    message: "Doctor dashboard data",
    appointments: [{ id: 1, patient: "John Doe", time: "10:00 AM" }]
  });
});

server.get("/api/patient/dashboard", (req, res) => {
  res.json({
    role: "patient",
    message: "Patient dashboard data", 
    appointments: [{ id: 1, doctor: "Dr. Smith", time: "10:00 AM" }]
  });
});

// استخدم التطبيق الرئيسي (يخدم الواجهة الأمامية)
server.use(app);

server.listen(PORT, () => {
  console.log(`🏥 Medical Clinic Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
