// ================================================================
// src/middleware/upload.middleware.js
// Multer config — uploads images directly to Cloudinary
// ================================================================

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { config } from '../config/app.config.js';

// ---- Storage: upload straight to Cloudinary instead of local disk ----
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tbf-uploads',            // groups files in Cloudinary's dashboard
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

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