// ================================================================
// src/middleware/error.middleware.js
// Global error handler — must be registered LAST in Express.
// Catches anything thrown in controllers/routes.
// ================================================================

import { config } from '../config/app.config.js';

export function errorMiddleware(err, req, res, next) {
  // Log the full error in dev
  if (config.isDev) {
    console.error('\n❌ Error:', err.message);
    console.error(err.stack);
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error:   `File too large. Max size is ${config.upload.maxSizeMB}MB`,
    });
  }

  // Multer unexpected field error
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error:   'Unexpected file field in upload',
    });
  }

  // Validation errors thrown manually with a status
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      error:   err.message,
      errors:  err.errors || null,
    });
  }

  // Default: 500 Internal Server Error
  return res.status(500).json({
    success: false,
    error:   config.isDev ? err.message : 'Internal server error',
  });
}

// ----------------------------------------------------------------
// Helper to throw structured HTTP errors from controllers
// Usage: throw httpError(404, 'Order not found')
// ----------------------------------------------------------------
export function httpError(status, message, errors = null) {
  const err = new Error(message);
  err.status = status;
  err.errors = errors;
  return err;
}
