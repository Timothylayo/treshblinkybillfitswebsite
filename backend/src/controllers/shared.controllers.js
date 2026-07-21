// ================================================================
// src/controllers/products.controller.js
// ================================================================

import { validateCreateProduct } from '../interfaces/shared.interfaces.js';

export async function getAllProducts(req, res, next) {
  try {
    const { category, page = 1, limit = 50 } = req.query;
    // ── SERVICE CALL GOES HERE: await ProductService.getAll({ category, page, limit })
    return res.success([], 200, { total: 0, page: Number(page), limit: Number(limit) });
  } catch (err) { next(err); }
}

export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    // ── SERVICE CALL GOES HERE: await ProductService.getById(id)
    return res.fail(`Product ${id} not found`, 404);
  } catch (err) { next(err); }
}

export async function createProduct(req, res, next) {
  try {
    const { valid, errors } = validateCreateProduct(req.body);
    if (!valid) return res.fail('Validation failed', 400, errors);
    // ── SERVICE CALL GOES HERE: await ProductService.create(req.body)
    return res.created({ id: Date.now(), ...req.body, createdAt: new Date().toISOString() });
  } catch (err) { next(err); }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    // ── SERVICE CALL GOES HERE: await ProductService.update(id, req.body)
    return res.success({ id: Number(id), ...req.body, updatedAt: new Date().toISOString() });
  } catch (err) { next(err); }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    // ── SERVICE CALL GOES HERE: await ProductService.delete(id)
    return res.success({ id: Number(id), deleted: true });
  } catch (err) { next(err); }
}


// ================================================================
// src/controllers/categories.controller.js
// ================================================================

import { validateCreateCategory } from '../interfaces/shared.interfaces.js';

export async function getAllCategories(req, res, next) {
  try {
    // ── SERVICE CALL GOES HERE: await CategoryService.getAll()
    return res.success([]);
  } catch (err) { next(err); }
}

export async function createCategory(req, res, next) {
  try {
    const { valid, errors } = validateCreateCategory(req.body);
    if (!valid) return res.fail('Validation failed', 400, errors);
    // ── SERVICE CALL GOES HERE: await CategoryService.create(req.body)
    return res.created({ id: Date.now(), ...req.body, createdAt: new Date().toISOString() });
  } catch (err) { next(err); }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    // ── SERVICE CALL GOES HERE: await CategoryService.delete(id)
    return res.success({ id: Number(id), deleted: true });
  } catch (err) { next(err); }
}


// ================================================================
// src/controllers/users.controller.js
// ================================================================

import { validateCreateUser } from '../interfaces/shared.interfaces.js';

export async function getAllUsers(req, res, next) {
  try {
    // ── SERVICE CALL GOES HERE: await UserService.getAll()
    return res.success([]);
  } catch (err) { next(err); }
}

export async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    // ── SERVICE CALL GOES HERE: await UserService.getById(id)
    return res.fail(`User ${id} not found`, 404);
  } catch (err) { next(err); }
}

export async function createUser(req, res, next) {
  try {
    const { valid, errors } = validateCreateUser(req.body);
    if (!valid) return res.fail('Validation failed', 400, errors);
    // ── SERVICE CALL GOES HERE: await UserService.create(req.body)
    return res.created({ id: Date.now(), ...req.body, createdAt: new Date().toISOString() });
  } catch (err) { next(err); }
}

export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    // ── SERVICE CALL GOES HERE: await UserService.update(id, req.body)
    return res.success({ id: Number(id), ...req.body, updatedAt: new Date().toISOString() });
  } catch (err) { next(err); }
}


// ================================================================
// src/controllers/invoices.controller.js
// ================================================================

export async function getInvoiceByOrderId(req, res, next) {
  try {
    const { orderId } = req.query;
    if (!orderId) return res.fail('orderId query param is required');
    // ── SERVICE CALL GOES HERE: await InvoiceService.getByOrderId(orderId)
    return res.fail(`Invoice for order ${orderId} not found`, 404);
  } catch (err) { next(err); }
}

export async function generateInvoice(req, res, next) {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.fail('orderId is required');
    // ── SERVICE CALL GOES HERE: await InvoiceService.generate(orderId)
    return res.created({
      id:         Date.now(),
      orderId,
      invoiceRef: `INV-${orderId}`,
      status:     'draft',
      createdAt:  new Date().toISOString(),
    });
  } catch (err) { next(err); }
}

export async function getInvoicePdf(req, res, next) {
  try {
    const { id } = req.params;
    // ── SERVICE CALL GOES HERE: stream PDF from InvoiceService.getPdf(id)
    return res.fail('PDF generation not yet implemented', 501);
  } catch (err) { next(err); }
}
