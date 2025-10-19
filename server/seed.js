import { initDatabase } from './db.js';

console.log('🌱 بدء تهيئة قاعدة البيانات...');
await initDatabase();
console.log('✅ تم الانتهاء من تهيئة النظام');
