import { validateUpdateMedia, VALID_MEDIA_CATEGORIES } from '../interfaces/shared.interfaces.js';
import { MediaService } from '../services/media.service.js';

export async function getAllMedia(req, res, next) {
  try {
    // 👉 ADDED designNum to the extraction list so it catches the URL parameter!
    const { category, search, page = 1, limit = 50, batchId, isPrimary, designNum } = req.query;

    if (category && category !== 'all' && !VALID_MEDIA_CATEGORIES.includes(category)) {
      return res.fail(`category must be one of: ${VALID_MEDIA_CATEGORIES.join(', ')}`);
    }

    // 👉 PASSED designNum straight into the service
    const { data, total } = await MediaService.getAll({ 
      category, 
      search, 
      page, 
      limit, 
      batchId, 
      isPrimary, 
      designNum 
    });
    
    return res.success(data, 200, { total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}
export async function uploadMedia(req, res, next) {
  try {
    const files = req.files; 
    
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    // 1. Grab the raw stringified metadata from the frontend
    const metadataString = req.body.metadata || '{}';

    // 2. Let your MediaService do all the work! It already has the Prisma logic perfectly written.
    const savedMedia = await MediaService.saveMany(files, metadataString);

    // 3. Return the saved media back to the frontend
    res.json({ success: true, data: savedMedia });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
}

export async function updateMedia(req, res, next) {
  try {
    const { id } = req.params;
    const { valid, errors } = validateUpdateMedia(req.body);
    if (!valid) return res.fail('Validation failed', 400, errors);

    const media = await MediaService.update(id, req.body);
    return res.success(media);
  } catch (err) {
    next(err);
  }
}

export async function deleteMedia(req, res, next) {
  try {
    const { id } = req.params;

    await MediaService.delete(id);
    return res.success({ id: Number(id), deleted: true });
  } catch (err) {
    next(err);
  }
}