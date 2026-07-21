// ================================================================
// src/interfaces/order.interface.js
// Defines the exact shape of Order requests and responses.
// Controllers validate incoming data against these interfaces.
// Service layer will implement the actual business logic later.
// ================================================================

// ----------------------------------------------------------------
// REQUEST INTERFACES  (what the frontend sends in)
// ----------------------------------------------------------------

/**
 * CreateOrderRequest
 * POST /api/orders
 * Sent from: pages/order.html → services/services.js → api/api.js
 *
 * @typedef {Object} CreateOrderRequest
 * @property {string}   customer   - Full name of customer
 * @property {string}   phone      - Phone number
 * @property {string}   whatsapp   - WhatsApp number
 * @property {string}   address    - Delivery address
 * @property {string}   design     - Design number e.g. "TBF-001"
 * @property {string}   category   - "native-monogram" | "native-normal" | "agbada" | "english"
 * @property {string}   event      - "Wedding" | "Birthday" | "Corporate" | "Church" | "Burial / Ceremony" | "Other"
 * @property {string}   neededBy   - ISO date string "YYYY-MM-DD"
 * @property {number}   qty        - Quantity (min 1)
 * @property {string}   [notes]    - Optional extra instructions
 * @property {Object}   [measurements] - Optional measurements object
 * @property {number}   [measurements.chest]
 * @property {number}   [measurements.waist]
 * @property {number}   [measurements.hip]
 * @property {number}   [measurements.shoulder]
 * @property {number}   [measurements.sleeveLength]
 * @property {number}   [measurements.bodyLength]
 * @property {number}   [measurements.trouserLength]
 * @property {number}   [measurements.thigh]
 */

/**
 * UpdateOrderStatusRequest
 * PATCH /api/orders/:id/status
 *
 * @typedef {Object} UpdateOrderStatusRequest
 * @property {OrderStatus} status
 */

/**
 * GetOrdersQuery
 * GET /api/orders?status=pending&page=1&limit=20
 *
 * @typedef {Object} GetOrdersQuery
 * @property {OrderStatus} [status]  - Filter by status
 * @property {string}      [search]  - Search by customer name, order ID, design
 * @property {number}      [page]    - Pagination page (default 1)
 * @property {number}      [limit]   - Items per page (default 20)
 */

// ----------------------------------------------------------------
// RESPONSE INTERFACES  (what the API sends back)
// ----------------------------------------------------------------

/**
 * @typedef {'pending'|'confirmed'|'production'|'ready'|'delivered'} OrderStatus
 */

/**
 * OrderResponse
 * Returned by: GET /api/orders, GET /api/orders/:id, POST /api/orders
 *
 * @typedef {Object} OrderResponse
 * @property {string}      id          - e.g. "TBF-2026-0047"
 * @property {string}      customer    - Customer full name
 * @property {string}      phone       - Phone number
 * @property {string}      whatsapp    - WhatsApp number
 * @property {string}      address     - Delivery address
 * @property {string}      design      - Design number
 * @property {string}      category    - Design category
 * @property {string}      event       - Occasion type
 * @property {string}      neededBy    - ISO date string
 * @property {number}      qty         - Quantity
 * @property {string}      [notes]     - Extra notes
 * @property {Object}      [measurements] - Measurements object
 * @property {OrderStatus} status      - Current order status
 * @property {string}      createdAt   - ISO datetime
 * @property {string}      updatedAt   - ISO datetime
 */

/**
 * OrderListResponse
 * Returned by: GET /api/orders
 *
 * @typedef {Object} OrderListResponse
 * @property {OrderResponse[]} data    - Array of orders
 * @property {number}          total   - Total count (for pagination)
 * @property {number}          page    - Current page
 * @property {number}          limit   - Items per page
 */

// ----------------------------------------------------------------
// VALIDATORS  (used by controllers to check incoming requests)
// ----------------------------------------------------------------

export const VALID_ORDER_STATUSES = ['pending', 'confirmed', 'production', 'ready', 'delivered'];
export const VALID_CATEGORIES     = ['native-monogram', 'native-normal', 'agbada', 'english'];
export const VALID_EVENTS         = ['Wedding', 'Birthday', 'Corporate', 'Church', 'Burial / Ceremony', 'Other'];

/**
 * Validates a CreateOrderRequest body.
 * Returns { valid: true } or { valid: false, errors: string[] }
 */
export function validateCreateOrder(body) {
  const errors = [];

  if (!body.customer?.trim())  errors.push('customer is required');
  if (!body.phone?.trim())     errors.push('phone is required');
  if (!body.whatsapp?.trim())  errors.push('whatsapp is required');
  if (!body.address?.trim())   errors.push('address is required');
  if (!body.design?.trim())    errors.push('design number is required');
  if (!body.neededBy)          errors.push('neededBy date is required');
  if (!body.qty || body.qty < 1) errors.push('qty must be at least 1');

  if (body.category && !VALID_CATEGORIES.includes(body.category)) {
    errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }
  if (body.event && !VALID_EVENTS.includes(body.event)) {
    errors.push(`event must be one of: ${VALID_EVENTS.join(', ')}`);
  }

  return errors.length ? { valid: false, errors } : { valid: true };
}

/**
 * Validates a status update body.
 */
export function validateStatusUpdate(body) {
  if (!body.status) return { valid: false, errors: ['status is required'] };
  if (!VALID_ORDER_STATUSES.includes(body.status)) {
    return { valid: false, errors: [`status must be one of: ${VALID_ORDER_STATUSES.join(', ')}`] };
  }
  return { valid: true };
}
