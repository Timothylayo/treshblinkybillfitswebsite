import { prisma } from '../config/db.js';

// ================================================================
// CATEGORY SERVICE
// ================================================================
export const CategoryService = {

  async getAll() {
    return prisma.category.findMany({ orderBy: { name: 'asc' } });
  },

  async create(data) {
    return prisma.category.create({
      data: { name: data.name, slug: data.slug, type: data.type },
    });
  },

  async delete(id) {
    return prisma.category.delete({ where: { id: Number(id) } });
  },
};

// ================================================================
// PRODUCT SERVICE
// ================================================================
export const ProductService = {

  async getAll({ category, page = 1, limit = 50 } = {}) {
    const where = category ? { category: { slug: category } } : {};

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include:  { category: true },
        orderBy:  { createdAt: 'desc' },
        skip:     (Number(page) - 1) * Number(limit),
        take:     Number(limit),
      }),
      prisma.product.count({ where }),
    ]);

    return { data, total };
  },

  async getById(id) {
    return prisma.product.findUnique({
      where:   { id: Number(id) },
      include: { category: true },
    });
  },

  async create(data) {
    return prisma.product.create({
      data: {
        name:       data.name,
        badge:      data.badge    || '',
        imageUrl:   data.imageUrl || null,
        tags:       Array.isArray(data.tags) ? data.tags.join(',') : (data.tags || ''),
        categoryId: Number(data.categoryId),
      },
      include: { category: true },
    });
  },

  async update(id, data) {
    return prisma.product.update({
      where: { id: Number(id) },
      data: {
        ...(data.name     && { name:     data.name }),
        ...(data.badge    !== undefined && { badge: data.badge }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.tags     && { tags: Array.isArray(data.tags) ? data.tags.join(',') : data.tags }),
      },
      include: { category: true },
    });
  },

  async delete(id) {
    return prisma.product.delete({ where: { id: Number(id) } });
  },
};

// ================================================================
// USER SERVICE
// ================================================================
export const UserService = {

  async getAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { orders: true } } },
    });
  },

  async getById(id) {
    return prisma.user.findUnique({
      where:   { id: Number(id) },
      include: { orders: true },
    });
  },

  async create(data) {
    return prisma.user.create({
      data: {
        name:     data.name,
        phone:    data.phone,
        whatsapp: data.whatsapp,
        address:  data.address || null,
      },
    });
  },

  async update(id, data) {
    return prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...(data.name     && { name:     data.name }),
        ...(data.phone    && { phone:    data.phone }),
        ...(data.whatsapp && { whatsapp: data.whatsapp }),
        ...(data.address  !== undefined && { address: data.address }),
      },
    });
  },
};

// ================================================================
// INVOICE SERVICE
// ================================================================
export const InvoiceService = {

  async getByOrderId(orderId) {
    return prisma.invoice.findUnique({
      where:   { orderId },
      include: { order: { include: { user: true, orderDetail: true } } },
    });
  },

  async generate(orderId) {
    // Check order exists
    const order = await prisma.order.findUnique({
      where:   { id: orderId },
      include: { user: true, orderDetail: { include: { design: true } } },
    });
    if (!order) return null;

    const invoiceRef = `INV-${orderId}`;

    // Build line items
    const items = [{
      name:      order.orderDetail?.design?.name || 'Custom Order',
      qty:       order.orderDetail?.qty          || 1,
      unitPrice: 0,   // ← set real price when you add pricing to designs
    }];

    return prisma.invoice.upsert({
      where:  { orderId },
      update: { items: JSON.stringify(items), status: 'draft' },
      create: {
        orderId,
        invoiceRef,
        items:       JSON.stringify(items),
        subtotal:    0,
        deliveryFee: 0,
        total:       0,
        status:      'draft',
      },
      include: { order: { include: { user: true } } },
    });
  },
};