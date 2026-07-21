// ================================================================
// src/interfaces/product.interface.js
// ================================================================

/**
 * ProductResponse
 * @typedef {Object} ProductResponse
 * @property {number}  id
 * @property {string}  name
 * @property {string}  category     - "natives" | "english" | "agbada"
 * @property {string}  [imageUrl]
 * @property {string}  [badge]      - "new" | "bespoke" | ""
 * @property {string[]} tags
 * @property {string}  createdAt
 * @property {string}  updatedAt
 */

export const VALID_PRODUCT_CATEGORIES = ['natives', 'english', 'agbada'];

export function validateCreateProduct(body) {
  const errors = [];
  if (!body.name?.trim())     errors.push('name is required');
  if (!body.category?.trim()) errors.push('category is required');
  if (body.category && !VALID_PRODUCT_CATEGORIES.includes(body.category)) {
    errors.push(`category must be one of: ${VALID_PRODUCT_CATEGORIES.join(', ')}`);
  }
  return errors.length ? { valid: false, errors } : { valid: true };
}


// ================================================================
// src/interfaces/category.interface.js
// ================================================================

/**
 * CategoryResponse
 * @typedef {Object} CategoryResponse
 * @property {number} id
 * @property {string} name   - Human-readable e.g. "Native Monogram"
 * @property {string} slug   - URL-safe e.g. "native-monogram"
 * @property {string} type   - "design" | "product"
 */

export function validateCreateCategory(body) {
  const errors = [];
  if (!body.name?.trim()) errors.push('name is required');
  if (!body.slug?.trim()) errors.push('slug is required');
  if (!body.type)         errors.push('type is required');
  if (body.type && !['design', 'product'].includes(body.type)) {
    errors.push('type must be "design" or "product"');
  }
  return errors.length ? { valid: false, errors } : { valid: true };
}


// ================================================================
// src/interfaces/media.interface.js
// ================================================================

/**
 * MediaResponse
 * @typedef {Object} MediaResponse
 * @property {number}  id
 * @property {string}  url         - Full URL to access the file
 * @property {string}  filename    - Original filename
 * @property {string}  mimetype    - e.g. "image/jpeg"
 * @property {number}  size        - File size in bytes
 * @property {string}  category    - "designs" | "products" | "events" | "fabrics" | "general"
 * @property {string}  createdAt
 */

export const VALID_MEDIA_CATEGORIES = ['designs', 'products', 'events', 'fabrics', 'general'];

export function validateUpdateMedia(body) {
  const errors = [];
  if (body.category && !VALID_MEDIA_CATEGORIES.includes(body.category)) {
    errors.push(`category must be one of: ${VALID_MEDIA_CATEGORIES.join(', ')}`);
  }
  return errors.length ? { valid: false, errors } : { valid: true };
}


// ================================================================
// src/interfaces/user.interface.js
// ================================================================

/**
 * UserResponse
 * @typedef {Object} UserResponse
 * @property {number}  id
 * @property {string}  name
 * @property {string}  phone
 * @property {string}  whatsapp
 * @property {string}  [address]
 * @property {string}  createdAt
 * @property {string}  updatedAt
 */

export function validateCreateUser(body) {
  const errors = [];
  if (!body.name?.trim())      errors.push('name is required');
  if (!body.phone?.trim())     errors.push('phone is required');
  if (!body.whatsapp?.trim())  errors.push('whatsapp is required');
  return errors.length ? { valid: false, errors } : { valid: true };
}


// ================================================================
// src/interfaces/invoice.interface.js
// ================================================================

/**
 * InvoiceResponse
 * @typedef {Object} InvoiceResponse
 * @property {number}  id
 * @property {string}  orderId      - Links to the order
 * @property {string}  invoiceRef   - e.g. "INV-TBF-2026-0047"
 * @property {Object[]} items       - Line items
 * @property {string}  items[].name
 * @property {number}  items[].qty
 * @property {number}  items[].unitPrice
 * @property {number}  subtotal
 * @property {number}  deliveryFee
 * @property {number}  total
 * @property {string}  status       - "draft" | "sent" | "paid"
 * @property {string}  createdAt
 */

export const VALID_INVOICE_STATUSES = ['draft', 'sent', 'paid'];
