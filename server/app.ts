import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// خدمة الملفات الثابتة من مجلد البناء
app.use(express.static(path.join(__dirname, '../dist/public'), {
  index: false,
  extensions: ['html', 'js', 'css', 'png', 'jpg']
}));

// جميع المسارات الأخرى تخدم التطبيق
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/public/index.html'));
});
