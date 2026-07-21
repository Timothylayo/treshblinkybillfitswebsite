// ================================================================
// src/interfaces/design.interface.js
// ================================================================

// ----------------------------------------------------------------
// REQUEST INTERFACES
// ----------------------------------------------------------------

/**
 * CreateDesignRequest
 * POST /api/designs
 *
 * @typedef {Object} CreateDesignRequest
 * @property {string}  name      - Design name e.g. "Royal Monogram I"
 * @property {string}  number    - Design number e.g. "TBF-001"
 * @property {string}  category  - Design category slug
 * @property {string}  [badge]   - "new" | "popular" | ""
 * @property {string}  [imageId] - ID of uploaded media (from /api/media/upload)
 */

/**
 * UpdateDesignRequest
 * PATCH /api/designs/:id
 *
 * @typedef {Object} UpdateDesignRequest
 * @property {string} [name]
 * @property {string} [number]
 * @property {string} [category]
 * @property {string} [badge]
 * @property {string} [imageId]
 */

/**
 * GetDesignsQuery
 * GET /api/designs?category=native-monogram&search=royal&page=1
 *
 * @typedef {Object} GetDesignsQuery
 * @property {string} [category] - Filter by category slug
 * @property {string} [search]   - Search by name or number
 * @property {number} [page]
 * @property {number} [limit]
 */

// ----------------------------------------------------------------
// RESPONSE INTERFACES
// ----------------------------------------------------------------

/**
 * DesignResponse
 *
 * @typedef {Object} DesignResponse
 * @property {number}  id
 * @property {string}  name
 * @property {string}  number      - e.g. "TBF-001"
 * @property {string}  category    - category slug
 * @property {string}  catLabel    - human-readable e.g. "Native Monogram"
 * @property {string}  [badge]     - "new" | "popular" | ""
 * @property {string}  [imageUrl]  - Full URL to design image
 * @property {string}  createdAt
 * @property {string}  updatedAt
 */

/**
 * DesignListResponse
 *
 * @typedef {Object} DesignListResponse
 * @property {DesignResponse[]} data
 * @property {number}           total
 * @property {number}           page
 * @property {number}           limit
 */

// ----------------------------------------------------------------
// VALIDATORS
// ----------------------------------------------------------------

export const VALID_DESIGN_CATEGORIES = ['native-monogram', 'native-normal', 'agbada', 'english'];
export const VALID_BADGES            = ['new', 'popular', ''];

export const CATEGORY_LABELS = {
  'native-monogram': 'Native Monogram',
  'native-normal':   'Native Normal',
  'agbada':          'Agbada',
  'english':         'English Wear',
};

export function validateCreateDesign(body) {
  const errors = [];
  if (!body.name?.trim())   errors.push('name is required');
  if (!body.number?.trim()) errors.push('number is required');
  if (!body.category)       errors.push('category is required');

  if (body.category && !VALID_DESIGN_CATEGORIES.includes(body.category)) {
    errors.push(`category must be one of: ${VALID_DESIGN_CATEGORIES.join(', ')}`);
  }
  if (body.badge !== undefined && !VALID_BADGES.includes(body.badge)) {
    errors.push(`badge must be one of: ${VALID_BADGES.join(', ')}`);
  }

  return errors.length ? { valid: false, errors } : { valid: true };
}

export function validateUpdateDesign(body) {
  const errors = [];
  if (body.category && !VALID_DESIGN_CATEGORIES.includes(body.category)) {
    errors.push(`category must be one of: ${VALID_DESIGN_CATEGORIES.join(', ')}`);
  }
  if (body.badge !== undefined && !VALID_BADGES.includes(body.badge)) {
    errors.push(`badge must be one of: ${VALID_BADGES.join(', ')}`);
  }
  return errors.length ? { valid: false, errors } : { valid: true };
}
