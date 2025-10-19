import { initDatabase } from './db.js';

console.log('🌱 بدء تهيئة النظام...');
await initDatabase();
console.log('✅ تم تهيئة النظام بنجاح');
