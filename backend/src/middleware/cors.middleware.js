// ================================================================
// src/middleware/cors.middleware.js
// ================================================================

import cors   from 'cors';
import { config } from '../config/app.config.js';

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (config.cors.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  methods:          ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders:   ['Content-Type'],
  credentials:      true, // required for cookies to work cross-origin
});
