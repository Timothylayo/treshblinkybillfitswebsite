// ================================================================
// src/middleware/upload.middleware.js
// Multer config — receives files in memory, then handed to ImageKit
// ================================================================

import multer from 'multer';
import { config } from '../config/app.config.js';

// ---- Storage: memory buffer (not disk, not Cloudinary-specific storage) ----
const storage = multer.memoryStorage();

// ---- File filter: images only (same as before) ----
function fileFilter(req, file, cb) {
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Accepted: ${config.upload.allowedTypes.join(', ')}`), false);
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxSizeMB * 1024 * 1024,
    files: 10,
  },
});

export const uploadSingle   = upload.single('file');
export const uploadMultiple = upload.array('files', 10);