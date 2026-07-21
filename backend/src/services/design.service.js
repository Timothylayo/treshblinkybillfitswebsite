import { prisma } from '../config/db.js';
import { CATEGORY_LABELS } from '../interfaces/design.interface.js';

export const DesignService = {

  async getAll({ category, search, page = 1, limit = 50 } = {}) {
    const where = {};

    if (category && category !== 'all') {
      where.category = { slug: category };
    }
    if (search) {
      where.OR = [
        { name:   { contains: search } },
        { number: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.design.findMany({
        where,
        include:  { category: true },
        orderBy:  { createdAt: 'desc' },
        skip:     (Number(page) - 1) * Number(limit),
        take:     Number(limit),
      }),
      prisma.design.count({ where }),
    ]);

    // Shape the response to match what the frontend expects
    const shaped = data.map(d => ({
      ...d,
      catLabel: d.category?.name || '',
    }));

    return { data: shaped, total };
  },

  async getById(id) {
    const design = await prisma.design.findUnique({
      where:   { id: Number(id) },
      include: { category: true },
    });
    if (!design) return null;
    return { ...design, catLabel: design.category?.name || '' };
  },

  async create(data) {
    // TRANSLATION FIX: If frontend sends string slug instead of ID, look up the ID first
    let finalCategoryId = data.categoryId ? Number(data.categoryId) : null;
    
    if (!finalCategoryId && data.category) {
      const cat = await prisma.category.findFirst({ where: { slug: data.category } });
      if (cat) finalCategoryId = cat.id;
    }

    return prisma.design.create({
      data: {
        name:       data.name,
        number:     data.number,
        badge:      data.badge      || '',
        imageUrl:   data.imageUrl   || null,
        categoryId: finalCategoryId,
      },
      include: { category: true },
    });
  },

  async update(id, data) {
    // TRANSLATION FIX: Look up the ID if a string slug is sent during an edit
    let finalCategoryId = data.categoryId ? Number(data.categoryId) : undefined;
    
    if (!finalCategoryId && data.category) {
      const cat = await prisma.category.findFirst({ where: { slug: data.category } });
      if (cat) finalCategoryId = cat.id;
    }

    return prisma.design.update({
      where: { id: Number(id) },
      data: {
        ...(data.name       && { name:       data.name }),
        ...(data.number     && { number:     data.number }),
        ...(data.badge      !== undefined && { badge: data.badge }),
        ...(data.imageUrl   !== undefined && { imageUrl: data.imageUrl }),
        ...(finalCategoryId !== undefined && { categoryId: finalCategoryId }),
      },
      include: { category: true },
    });
  },

  async delete(id) {
    return prisma.design.delete({ where: { id: Number(id) } });
  },
};