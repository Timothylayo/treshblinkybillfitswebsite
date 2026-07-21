// ================================================================
// src/routes/orders.routes.js
// ================================================================

import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderPricing,
  deleteOrder,
} from '../controllers/orders.controller.js';

const router = Router();
const { requireAuth } = await import('../middleware/auth.middleware.js');

//public routes
router.post('/', createOrder)
  
//private routes
router.get('/', requireAuth, getAllOrders);
router.route('/:id')
  .get(requireAuth, getOrderById)
  .delete(requireAuth, deleteOrder);

// PATCH  /api/orders/:id/status — update status (admin)
router.patch('/:id/status',requireAuth, updateOrderStatus);
router.patch('/:orderId/pricing', requireAuth, updateOrderPricing);
export default router;
  