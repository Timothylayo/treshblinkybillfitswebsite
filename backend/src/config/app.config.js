// ================================================================
// src/config/app.config.js
// All environment variables loaded and validated in one place.
// Every other file imports from here — never from process.env directly.
// ================================================================

import 'dotenv/config';

export const config = {
  port:        parseInt(process.env.PORT) || 5000,
  nodeEnv:     process.env.NODE_ENV || 'development',
  isDev:       (process.env.NODE_ENV || 'development') === 'development',

  cors: {
    // Add your deployed frontend URL here when you go live
    allowedOrigins: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://127.0.0.1:5500',  // VS Code Live Server
      'http://localhost:5500',
    ],
  },

  upload: {
    dir:         process.env.UPLOAD_DIR || 'uploads',
    maxSizeMB:   parseInt(process.env.MAX_FILE_SIZE_MB) || 10,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },

  db: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT) || 5432,
    name:     process.env.DB_NAME     || 'tbf_db',
    user:     process.env.DB_USER     || 'tbf_user',
    password: process.env.DB_PASSWORD || '',
  },

  auth: {
  jwtSecret:  process.env.JWT_SECRET || 'dev_secret_change_in_prod',
 },
};
