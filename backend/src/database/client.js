// ================================================================
// src/database/client.js
// Single Prisma client instance shared across the entire app.
// Prevents opening too many DB connections.
// ================================================================

import { PrismaClient } from '@prisma/client';
import { config }       from '../config/app.config.js';

const prisma = new PrismaClient({
  log: config.isDev
    ? ['query', 'warn', 'error']   // show all SQL in dev
    : ['warn', 'error'],           // only warnings/errors in prod
});

// Graceful shutdown — close DB connection when server stops
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
