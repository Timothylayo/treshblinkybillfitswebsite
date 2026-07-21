// ================================================================
// src/index.js
// Server entry point — starts the HTTP server.
// ================================================================

import fs     from 'fs';
import path   from 'path';
import { fileURLToPath } from 'url';

import app           from './app.js';
import { config }    from './config/app.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', config.upload.dir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📁 Created uploads directory: ${uploadDir}`);
}

// Start server
app.listen(config.port, () => {
  console.log('\n🧵 TreshBlinkybill Fits API');
  console.log(`   Environment : ${config.nodeEnv}`);
  console.log(`   Port        : ${config.port}`);
  console.log(`   Health      : http://localhost:${config.port}/health`);
  console.log(`   API base    : http://localhost:${config.port}/api`);
  console.log('\n   Routes:');
  console.log('   POST   /api/orders');
  console.log('   GET    /api/orders');
  console.log('   GET    /api/orders/:id');
  console.log('   PATCH  /api/orders/:id/status');
  console.log('   DELETE /api/orders/:id');
  console.log('   ---');
  console.log('   GET    /api/designs');
  console.log('   POST   /api/designs');
  console.log('   PATCH  /api/designs/:id');
  console.log('   DELETE /api/designs/:id');
  console.log('   ---');
  console.log('   GET    /api/products');
  console.log('   GET    /api/categories');
  console.log('   GET    /api/media');
  console.log('   POST   /api/media/upload');
  console.log('   DELETE /api/media/:id');
  console.log('   ---');
  console.log('   GET    /api/users');
  console.log('   GET    /api/invoices?orderId=...');
  console.log('   POST   /api/invoices\n');
});
