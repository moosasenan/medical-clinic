import express from 'express';
import session from 'express-session';
import { app } from './app.js';
import { storage } from './storage.js';
import { routes } from './routes.js';

const server = express();
const PORT = process.env.PORT || 5000;

// إعدادات الجلسة
server.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  store: storage,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 ساعة
}));

server.use(express.json());
server.use('/api', routes);
server.use(app);

server.listen(PORT, () => {
  console.log(`[express] serving on port ${PORT}`);
});
