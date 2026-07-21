// ================================================================
// src/routes/designs.routes.js
// ================================================================

import { Router } from 'express';
import {
  getAllDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  deleteDesign,
} from '../controllers/designs.controller.js';

const router = Router();

// GET  /api/designs     — list all designs (public)
// POST /api/designs     — add a design     (admin)
router.route('/')
  .get(getAllDesigns)
  .post(createDesign);

// GET    /api/designs/:id  — get one design
// PATCH  /api/designs/:id  — update design (admin)
// DELETE /api/designs/:id  — delete design (admin)
router.route('/:id')
  .get(getDesignById)
  .patch(updateDesign)
  .delete(deleteDesign);

export default router;
