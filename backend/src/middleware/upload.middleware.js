// ================================================================
// src/middleware/upload.middleware.js
// Multer config for handling image uploads to /api/media/upload
// ================================================================

import multer from 'multer';
import path   from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/app.config.js';

// ---- Storage: save to disk in uploads/ folder ----
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, config.upload.dir);
  },
  filename(req, file, cb) {
    // uuid + original extension — prevents name collisions
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

// ---- File filter: images only ----
function fileFilter(req, file, cb) {
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Accepted: ${config.upload.allowedTypes.join(', ')}`), false);
  }
}

// ---- Multer instance ----
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize:  config.upload.maxSizeMB * 1024 * 1024,
    files:     10,   // max 10 files per upload request
  },
});

// ---- Middleware presets used in routes ----
export const uploadSingle  = upload.single('file');        // single file field named "file"
export const uploadMultiple = upload.array('files', 10);   // up to 10 files, field named "files"
