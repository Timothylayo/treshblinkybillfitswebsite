// ================================================================
// src/middleware/response.middleware.js
// Attaches res.success() and res.fail() to every response object
// so every controller returns the exact same shape.
//
// Success shape:  { success: true,  data: {...},   meta?: {...} }
// Error shape:    { success: false, error: string, errors?: [] }
// ================================================================

export function responseMiddleware(req, res, next) {
  /**
   * Send a successful response
   * @param {*}      data    - The payload to return
   * @param {number} status  - HTTP status code (default 200)
   * @param {Object} [meta]  - Optional pagination / extra info
   */
  res.success = (data, status = 200, meta = null) => {
    const body = { success: true, data };
    if (meta) body.meta = meta;
    return res.status(status).json(body);
  };

  /**
   * Send a created response (201)
   * @param {*} data
   */
  res.created = (data) => res.success(data, 201);

  /**
   * Send an error response
   * @param {string}   message  - Human-readable error message
   * @param {number}   status   - HTTP status code (default 400)
   * @param {string[]} [errors] - Array of validation errors
   */
  res.fail = (message, status = 400, errors = null) => {
    const body = { success: false, error: message };
    if (errors) body.errors = errors;
    return res.status(status).json(body);
  };

  next();
}
