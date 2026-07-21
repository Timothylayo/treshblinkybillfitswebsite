/* ================================================================
   API LAYER — treshblinkybill/api/api.js
   All raw HTTP calls live here.
   Services call this layer. Pages call services.
   ================================================================ */

const BASE_URL = 'http://localhost:5000'; // Replace with your backend URL

/* ---- ROBUST HTTP HELPERS ---- */
// Added an 'isPublic' flag so we don't send admin cookies on customer-facing routes
async function http(method, endpoint, body = null, isPublic = false) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  
  // 👉 CRITICAL SECURITY: Automatically attach cookies for all admin routes
  if (!isPublic) {
    options.credentials = 'include';
  }

  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    // 🟢 Handle Success
    if (response.ok) {
      // Some endpoints (like DELETE) might return empty responses, so we check first
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    }

    // 🔴 Handle Errors (Extract the exact error message from the backend)
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (parseError) {
      // If the backend crashed and sent HTML instead of JSON
      errorMessage = "Server returned an invalid response.";
    }
    throw new Error(errorMessage);

  } catch (error) {
    console.error(`[API Error] ${method} ${endpoint}:`, error.message);
    throw error; // Re-throw so the Service layer can catch it
  }
}

async function httpUpload(endpoint, formData) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include', // 👉 Always include cookies for uploads
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {}
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    console.error(`[Upload Error] POST ${endpoint}:`, error.message);
    throw error;
  }
}

/* ================================================================
   ORDERS API
   ================================================================ */
const OrdersAPI = {
  // 🟢 PUBLIC: Customers submitting a request (isPublic = true)
  create: (data) => http('POST', '/api/orders', data, true),

  // 🔴 PRIVATE: Admin routes (Automatically uses credentials: 'include')
  getAll: (filters = {}) => {
    const qs = new URLSearchParams(filters).toString();
    return http('GET', `/api/orders${qs ? '?' + qs : ''}`);
  },
  getById: (id) => http('GET', `/api/orders/${id}`),
  updatePricing: (id, data) => http('PATCH', `/api/orders/${id}/pricing`, data),
  updateStatus: (id, status) => http('PATCH', `/api/orders/${id}/status`, { status }),
};

/* ================================================================
   DESIGNS API
   ================================================================ */
const DesignsAPI = {
  // 🟢 PUBLIC: Customers viewing designs
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return http('GET', `/api/designs${qs ? '?' + qs : ''}`, null, true);
  },
  getById: (id) => http('GET', `/api/designs/${id}`, null, true),

  // 🔴 PRIVATE: Admin modifying designs
  create: (data) => http('POST', '/api/designs', data),
  update: (id, data) => http('PATCH', `/api/designs/${id}`, data),
  delete: (id) => http('DELETE', `/api/designs/${id}`),
};

/* ================================================================
   MEDIA / IMAGES API
   ================================================================ */
const MediaAPI = {
  // 🟢 PUBLIC: Customers viewing collections
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return http('GET', `/api/media${qs ? '?' + qs : ''}`, null, true);
  },
  
  // 🔴 PRIVATE: Admin uploads and deletes
  upload: (files, metadata = {}) => {
    const formData = new FormData();
    for (const file of files) formData.append('files', file);
    formData.append('metadata', JSON.stringify(metadata));
    return httpUpload('/api/media/upload', formData);
  },
  delete: (id) => http('DELETE', `/api/media/${id}`),
  update: (id, data) => http('PATCH', `/api/media/${id}`, data),
};

/* ================================================================
   USERS, INVOICE, AUTH APIs
   ================================================================ */
const UsersAPI = {
  getAll: () => http('GET', '/api/users'),
  getById: (id) => http('GET', `/api/users/${id}`),
  create: (data) => http('POST', '/api/users', data),
  update: (id, data) => http('PATCH', `/api/users/${id}`, data),
};

const InvoiceAPI = {
  getByOrderId: (orderId) => http('GET', `/api/invoices?orderId=${orderId}`),
  generate: (orderId) => http('POST', '/api/invoices', { orderId }),
  getPdf: (invoiceId) => `${BASE_URL}/api/invoices/${invoiceId}/pdf`,
};

const AuthAPI = {
  // 🟢 PUBLIC: Login attempt
  login: (credentials) => http('POST', '/api/auth/login', credentials, true),
  // 🔴 PRIVATE: Admin validating token and logging out
  getMe: () => http('GET', '/api/auth/me'),
  logout: () => http('POST', '/api/auth/logout'), 
};

window.TBF_API = {
  Orders: OrdersAPI,
  Designs: DesignsAPI,
  Media: MediaAPI,
  Users: UsersAPI,
  Invoice: InvoiceAPI,
  Auth: AuthAPI,
};