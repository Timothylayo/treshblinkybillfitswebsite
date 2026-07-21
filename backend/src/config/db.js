// ================================================================
// src/config/database.js
// Single Prisma client instance shared across the entire app.
// Import this wherever you need to query the database.
//
// Usage in a service:
//   import { db } from '../config/database.js';
//   const orders = await db.order.findMany();
// ================================================================

import { PrismaClient } from '@prisma/client';
import { config } from './app.config.js';

const db = new PrismaClient({
  log: config.isDev
    ? ['query', 'warn', 'error']   // log all SQL in development
    : ['warn', 'error'],           // only problems in production
});

// Graceful shutdown — close DB connection when server stops
process.on('beforeExit', async () => {
  await db.$disconnect();
});

export { db };


const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
