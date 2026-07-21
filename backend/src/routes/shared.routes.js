// ================================================================
// src/routes/products.routes.js
// ================================================================

import { Router } from 'express';
import {
  getAllProducts, getProductById,
  createProduct, updateProduct, deleteProduct,
} from '../controllers/shared.controllers.js';

const router = Router();

router.route('/').get(getAllProducts).post(createProduct);
router.route('/:id').get(getProductById).patch(updateProduct).delete(deleteProduct);

export default router;


// ================================================================
// src/routes/categories.routes.js
// ================================================================

import { Router as CatRouter } from 'express';
import {
  getAllCategories, createCategory, deleteCategory,
} from '../controllers/shared.controllers.js';

export const categoriesRouter = CatRouter();

categoriesRouter.route('/').get(getAllCategories).post(createCategory);
categoriesRouter.route('/:id').delete(deleteCategory);


// ================================================================
// src/routes/media.routes.js
// ================================================================

import { Router as MediaRouter } from 'express';
import { uploadMultiple } from '../middleware/upload.middleware.js';
import {
  getAllMedia, uploadMedia, updateMedia, deleteMedia,
} from '../controllers/media.controller.js';

const { requireAuth } = await import('../middleware/auth.middleware.js');

export const mediaRouter = MediaRouter();

//public routes
mediaRouter.get('/', getAllMedia);

//private routes
mediaRouter.post('/upload',  uploadMultiple, uploadMedia);
mediaRouter.route('/:id')
  .patch(requireAuth, updateMedia)
  .delete(requireAuth, deleteMedia);


// ================================================================
// src/routes/users.routes.js
// ================================================================

import { Router as UserRouter } from 'express';
import {
  getAllUsers, getUserById, createUser, updateUser,
} from '../controllers/shared.controllers.js';

export const usersRouter = UserRouter();

usersRouter.route('/').get(getAllUsers).post(createUser);
usersRouter.route('/:id').get(getUserById).patch(updateUser);


// ================================================================
// src/routes/invoices.routes.js
// ================================================================

import { Router as InvoiceRouter } from 'express';
import {
  getInvoiceByOrderId, generateInvoice, getInvoicePdf,
} from '../controllers/shared.controllers.js';

export const invoicesRouter = InvoiceRouter();

// GET  /api/invoices?orderId=TBF-2026-0047
// POST /api/invoices    — generate invoice for an order
invoicesRouter.route('/').get(getInvoiceByOrderId).post(generateInvoice);

// GET /api/invoices/:id/pdf
invoicesRouter.get('/:id/pdf', getInvoicePdf);
