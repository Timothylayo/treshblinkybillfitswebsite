import { validateCreateOrder, validateStatusUpdate, VALID_ORDER_STATUSES } from '../interfaces/order.interface.js';
import { httpError } from '../middleware/error.middleware.js';
import { OrderService } from '../services/order.service.js';


export const createOrder = async (req, res) => {
  try {
    const { id, customer, phone, whatsapp, cart } = req.body;

    // 1. Validate the new payload
    if (!customer || !phone) {
      return res.status(400).json({ error: "Customer Name and Phone are required." });
    }

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Your style bag is empty." });
    }

    // 2. Pass the data to the Order Service (which we updated earlier!)
    // Assuming you have OrderService imported
    const newOrder = await OrderService.create(req.body);

    // 3. Send success response
    res.status(201).json({
      message: "Request submitted successfully",
      data: newOrder
    });

  } catch (error) {
    console.error("Error creating order request:", error);
    res.status(400).json({ error: error.message || "Failed to create order request." });
  }
};

export async function getAllOrders(req, res, next) {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    if (status && !VALID_ORDER_STATUSES.includes(status)) {
      return res.fail(`status must be one of: ${VALID_ORDER_STATUSES.join(', ')}`);
    }

    const { data, total } = await OrderService.getAll({ status, search, page, limit });
    return res.success(data, 200, { total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;

    const order = await OrderService.getById(id);
    if (!order) throw httpError(404, `Order ${id} not found`);
    return res.success(order);
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { valid, errors } = validateStatusUpdate(req.body);
    if (!valid) return res.fail('Validation failed', 400, errors);

    const order = await OrderService.updateStatus(id, req.body.status);
    if (!order) throw httpError(404, `Order ${id} not found`);
    return res.success(order);
  } catch (err) {
    next(err);
  }
}

export async function deleteOrder(req, res, next) {
  try {
    const { id } = req.params;

    await OrderService.delete(id);
    return res.success({ id, deleted: true });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderPricing(req, res, next) {
  try {
    const { orderId } = req.params;
    const { deliveryFee, grandTotal, items } = req.body;

    // The invoice editor always sends an items array (one entry per OrderItem)
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items array is required" });
    }

    const updatedOrder = await OrderService.updatePricing(orderId, {
      deliveryFee: Number(deliveryFee) || 0,
      grandTotal:  Number(grandTotal) || 0,
      items,
    });

    if (!updatedOrder) {
      return res.status(404).json({ error: `Order ${orderId} not found` });
    }

    return res.status(200).json({ data: updatedOrder });
  } catch (error) {
    console.error("Error updating order pricing:", error);
    res.status(500).json({ error: error.message || "Failed to update pricing." });
  }
}