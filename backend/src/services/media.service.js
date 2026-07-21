import { prisma } from '../config/db.js';
import fs         from 'fs';
import path       from 'path';
import { config } from '../config/app.config.js';
import cloudinary from '../config/cloudinary.js';

export const MediaService = {

  async getAll(filters = {}) {
    const { category, designNum, batchId, isPrimary } = filters;
    const where = {};

    // 1. Filter by Category (e.g. 'designs', 'natives', 'agbada')
    if (category && category !== 'all') {
      where.category = category;
    }

    // 👉 THE MISSING LOCK: Forces Prisma to match the exact TBF-XXX reference
    if (designNum) {
      where.designNum = designNum;
    }

    // 3. Filter by upload batch (Used by Collections 'Angles' modal)
    if (batchId) {
      where.batchId = batchId;
    }

    // 4. Filter by cover status (Used by Collections homepage grid)
    if (isPrimary !== undefined) {
      where.isPrimary = (isPrimary === 'true' || isPrimary === true);
    }

    const data = await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return { data, total: data.length };
  },
  async saveMany(files, metadataPayload = {}) {
    // Frontend FormData sends metadata as a JSON string. We parse it safely here.
    let meta = metadataPayload;
    if (typeof metadataPayload === 'string') {
      try { 
        meta = JSON.parse(metadataPayload); 
      } catch (e) { 
        meta = {}; 
      }
    }

    const created = await Promise.all(
      files.map((file, index) =>
        prisma.media.create({
          data: {
            filename:     file.filename,
            url:          file.path, // This is the Cloudinary URL returned by multer-storage-cloudinary
            mimetype:     file.mimetype,
            size:         file.size,
            originalName: file.originalname,
            
            // New Portfolio / Collection Data
            category:     meta.category || 'general',
            title:        meta.title || null,
            designNum:    meta.designNum || null,
            batchId:      meta.batchId || null,
            
            // ONLY the very first file in the upload batch gets marked as the primary cover
            isPrimary:    index === 0 ? (meta.isPrimaryBatchCover === true || meta.isPrimaryBatchCover === 'true') : false,
          },
        })
      )
    );
    return created;
  },

  async update(id, data) {
    return prisma.media.update({
      where: { id: Number(id) },
      // Allows updating title, category, and designNum later if needed
      data: { 
        category: data.category,
        title: data.title,
        designNum: data.designNum 
      },
    });
  },

  async delete(id) {
  const media = await prisma.media.findUnique({ where: { id: Number(id) } });
  if (!media) return null;

  // Delete file from Cloudinary using the stored public_id
  if (media.filename) {
    await cloudinary.uploader.destroy(media.filename);
  }

  // Delete DB record
  return prisma.media.delete({ where: { id: Number(id) } });
},

};