import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type'; // Reads binary signatures

// 1. Keep the file entirely in RAM (No disk writing)
const storage = multer.memoryStorage();

export const secureUpload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB hard limit
});

// 2. The Verification Middleware (Used in your route)
export const verifyImageSignature = async (req, res, next) => {
    if (!req.file) return next(); // Skip if no file uploaded

    // Read the actual binary headers of the uploaded buffer
    const fileSignature = await fileTypeFromBuffer(req.file.buffer);

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    // If it's unrecognizable or not an allowed type, drop it immediately
    if (!fileSignature || !allowedTypes.includes(fileSignature.mime)) {
        return res.status(400).json({ error: "Malicious payload detected. Invalid image format." });
    }

    // Pass the safe buffer to your compression logic, then to ImageKit
    next();
};