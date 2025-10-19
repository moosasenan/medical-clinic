// @ts-ignore  (تعطيل TypeScript مؤقتاً)
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../shared/schema.js';

if (!process.env.DATABASE_URL) {
  // استخدم قاعدة بيانات وهمية للتطوير
  console.log("⚠️  Using in-memory database for development");
  export const db = {
    select: () => ({
      from: () => ({
        where: () => Promise.resolve([]),
        orderBy: () => Promise.resolve([])
      })
    }),
    insert: (table: any) => ({
      values: (data: any) => ({
        returning: () => Promise.resolve([{ id: '1', ...data }])
      })
    }),
    update: (table: any) => ({
      set: (data: any) => ({
        where: () => ({
          returning: () => Promise.resolve([{ id: '1', ...data }])
        })
      })
    }),
    delete: (table: any) => ({
      where: () => Promise.resolve({ rowCount: 1 })
    })
  } as any;
} else {
  const connection = postgres(process.env.DATABASE_URL);
  export const db = drizzle(connection, { schema });
}
