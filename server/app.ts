import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// خدمة الملفات الثابتة للواجهة الأمامية
app.use(express.static(path.join(__dirname, '../dist/public')));

// جميع المسارات الأخرى تخدم index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/public/index.html'));
});
