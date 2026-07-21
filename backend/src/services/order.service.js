import { prisma } from '../config/db.js';

export const OrderService = {

async create(data) {
    // 1. Silent Registration (Keep your awesome upsert logic)
    const user = await prisma.user.upsert({
      where:  { phone: data.phone },
      update: { name: data.customer, whatsapp: data.whatsapp, address: data.address },
      create: { name: data.customer, phone: data.phone, whatsapp: data.whatsapp, address: data.address },
    });

    // 2. Map the frontend cart array to match your Prisma OrderItem fields
    // (If the cart is empty for some reason, default to an empty array)
    const itemsToCreate = (data.cart || []).map(item => ({
      designId:      item.designId ? parseInt(item.designId) : null,
      qty:           item.qty ? parseInt(item.qty) : 1,
      event:         item.event,
      notes:         item.notes,
      chest:         item.chest ? parseFloat(item.chest) : null,
      waist:         item.waist ? parseFloat(item.waist) : null,
      hip:           item.hip ? parseFloat(item.hip) : null,
      shoulder:      item.shoulder ? parseFloat(item.shoulder) : null,
      sleeveLength:  item.sleeveLength ? parseFloat(item.sleeveLength) : null,
      bodyLength:    item.bodyLength ? parseFloat(item.bodyLength) : null,
      trouserLength: item.trouserLength ? parseFloat(item.trouserLength) : null,
      thigh:         item.thigh ? parseFloat(item.thigh) : null,
      //for the custome design that the customer can add
      name: item.name || null,
      image: item.image || null,
      isCustom: item.isCustom || false,
    }));

    // 3. Create the Order AND all items simultaneously (Nested Write)
    const newOrder = await prisma.order.create({
      data: {
        id:           data.id, // e.g., 'TBF-2026-XXXX'
        userId:       user.id,
        deliveryMode: data.deliveryMode || 'pickup',
        status:       'pending',
        // 👉 This is the magic! It creates all items inside the order instantly.
        items: {
          create: itemsToCreate
        }
      },
      // Return the newly created data so the frontend can confirm it
      include: {
        items: {
          include: { design: true } // Bring back the design info too!
        },
        user: true
      }
    });

    return newOrder;
  },

  // Add this inside your OrderService object
  async getAll({ status, search, page = 1, limit = 20 } = {}) {
    const pageNum  = Number(page)  || 1;
    const limitNum = Number(limit) || 20;

    // Build the WHERE clause dynamically based on filters
    const where = {
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { id: { contains: search, mode: 'insensitive' } },
              { user: { name:  { contains: search, mode: 'insensitive' } } },
              { user: { phone: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    // Run the query and the count in parallel for efficiency
    const [rawOrders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          user: true,
          items: {
            include: { design: true } // Gets the design name/image for the Admin UI
          }
        }
      }),
      prisma.order.count({ where }),
    ]);

    // Flatten the data so the frontend Admin Panel can read simple fields
    // (design, event, qty, neededBy) directly off the order object
    const data = rawOrders.map(order => {
      const firstItem = order.items?.[0] || {};

      return {
        id:           order.id,
        customer:     order.user.name,
        phone:        order.user.phone,
        whatsapp:     order.user.whatsapp,
        address:      order.user.address,
        status:       order.status,
        deliveryMode: order.deliveryMode,
        deliveryFee:  order.deliveryFee,
        grandTotal:   order.grandTotal,
        createdAt:    order.createdAt,

        // Flattened fields for the table row (from the first item)
        design:   firstItem.design?.number || firstItem.designId || null,
        event:    firstItem.event || null,
        neededBy: firstItem.neededBy || null,
        qty:      order.items.reduce((sum, i) => sum + (i.qty || 1), 0),

        // Full items array still passed through in case the drawer needs it
        items: order.items,
      };
    });

    // Return the exact shape the controller expects
    return { data, total };
  },

  async getById(id) {
    const order = await prisma.order.findUnique({
      where:   { id },
      include: {
        user: true,
        items: { include: { design: true } },
        invoice: true,
      },
    });

    if (!order) return null;

    // Return the full order shape — invoice-editor.html needs the whole
    // items array (not just one flattened item), since it renders and
    // prices every item in the order individually.
    return {
      id:           order.id,
      status:       order.status,
      createdAt:    order.createdAt,
      deliveryMode: order.deliveryMode,
      deliveryFee:  order.deliveryFee,
      grandTotal:   order.grandTotal,
      user:         order.user,
      items:        order.items,
      invoice:      order.invoice,
    };
  },

  
  async updateStatus(id, status) {
    return prisma.order.update({
      where: { id },
      data:  { status },
    });
  },

  async delete(id) {
    // Delete child records first to avoid foreign key issues
    await prisma.orderDetail.deleteMany({ where: { orderId: id } });
    await prisma.invoice.deleteMany({    where: { orderId: id } });
    return prisma.order.delete({ where: { id } });
  },

  async updatePricing(orderId, { deliveryFee, grandTotal, items }) {
    // 1. Confirm the order exists first, so we can 404 cleanly instead of
    //    throwing a confusing Prisma error deep inside the transaction
    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existingOrder) return null;

    // 2. Update each OrderItem's price + measurements in one transaction.
    //    Using $transaction means either ALL items save, or NONE do —
    //    no risk of half-updated pricing if one item update fails.
    const itemUpdates = items.map(item =>
      prisma.orderItem.update({
        where: { id: item.id },
        data: {
          unitPrice:     item.unitPrice ?? null,
          chest:         item.chest ?? null,
          waist:         item.waist ?? null,
          shoulder:      item.shoulder ?? null,
          sleeveLength:  item.sleeveLength ?? null,
          trouserLength: item.trouserLength ?? null,
          thigh:         item.thigh ?? null,
        },
      })
    );

    await prisma.$transaction(itemUpdates);

    // 3. Update the parent Order's delivery fee + grand total, and return
    //    the full order (with items + user) so the frontend can re-render
    //    without needing a second fetch
    return prisma.order.update({
      where: { id: orderId },
      data: {
        deliveryFee,
        grandTotal,
      },
      include: {
        user: true,
        items: { include: { design: true } },
      },
    });
  },
};