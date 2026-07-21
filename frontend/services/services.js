/* ================================================================
   SERVICE LAYER — treshblinkybill/services/services.js
   Business logic lives here. Pages call services, not API directly.
   ================================================================ */

const Utils = {
  formatDate(isoString) {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
  },
  showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.textContent = message;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el?.remove(), 300);
    }, 3000);
  },
};

const ComponentLoader = {
  async load(selector, componentPath) {
    const el = document.querySelector(selector);
    if (!el) return;
    try {
      const res = await fetch(componentPath);
      el.innerHTML = await res.text();
    } catch (e) {
      console.warn(`Could not load component: ${componentPath}`);
    }
  },
  async loadNav(activePage) {
    await this.load('#nav-slot', '../components/nav.html');
    document.querySelectorAll('.nav__link').forEach(link => {
      link.classList.toggle('nav__link--active', link.dataset.page === activePage);
    });
  },
  async loadFooter() {
    await this.load('#footer-slot', '../components/footer.html');
  },
  async init(activePage) {
    await Promise.all([this.loadNav(activePage), this.loadFooter()]);
  },
};

/* ================================================================
   ORDER SERVICE
   ================================================================ */
const OrderService = {
  async placeOrder(payload) {
    try {
      return await window.TBF_API.Orders.create(payload);
    } catch (err) {
      Utils.showToast(err.message || 'Failed to place request.', 'error');
      throw err;
    }
  },
  async getAll(filters = {}) {
    try {
      const res = await window.TBF_API.Orders.getAll(filters);
      return Array.isArray(res) ? res : (res.data || []);
    } catch (err) {
      Utils.showToast('Failed to load orders. Check connection.', 'error');
      return []; // Return empty array so UI renders the empty state safely
    }
  },
  async getById(orderId) {
    try {
      const res = await window.TBF_API.Orders.getById(orderId);
      return res.data || res;
    } catch (err) {
      Utils.showToast('Failed to load order details.', 'error');
      throw err;
    }
  },
  async updatePricing(orderId, pricingData) {
    try {
      const res = await window.TBF_API.Orders.updatePricing(orderId, pricingData);
      return res.data || res;
    } catch (err) {
      Utils.showToast(err.message || 'Failed to save pricing.', 'error');
      throw err;
    }
  },
  async updateStatus(id, status) {
    try {
      const res = await window.TBF_API.Orders.updateStatus(id, status);
      return res.data || res;
    } catch (err) {
      Utils.showToast(err.message || 'Failed to update order status.', 'error');
      throw err;
    }
  }
};

/* ================================================================
   DESIGN SERVICE
   ================================================================ */
const DesignService = {
  async getAll(filters = {}) {
    try {
      const res = await window.TBF_API.Designs.getAll(filters);
      return Array.isArray(res) ? res : (res.data || []);
    } catch (err) {
      Utils.showToast('Failed to load designs.', 'error');
      return [];
    }
  },
  async create(data) {
    try {
      const res = await window.TBF_API.Designs.create(data);
      return res.data || res;
    } catch (err) {
      Utils.showToast(err.message || 'Failed to create design.', 'error');
      throw err;
    }
  },
  async update(id, data) {
    try {
      const res = await window.TBF_API.Designs.update(id, data);
      return res.data || res;
    } catch (err) {
      Utils.showToast(err.message || 'Failed to update design.', 'error');
      throw err;
    }
  },
  async delete(id) {
    try {
      return await window.TBF_API.Designs.delete(id);
    } catch (err) {
      Utils.showToast(err.message || 'Failed to delete design.', 'error');
      throw err;
    }
  }
};

/* ================================================================
   MEDIA SERVICE
   ================================================================ */
const MediaService = {
  async getAll(params = {}) {
    try {
      const res = await window.TBF_API.Media.getAll(params);
      return res.data || [];
    } catch (err) {
      Utils.showToast('Failed to load media.', 'error');
      return [];
    }
  },
  async upload(files, metadataPayload) {
    try {
      return await window.TBF_API.Media.upload(files, metadataPayload);
    } catch (err) {
      Utils.showToast(err.message || 'Image upload failed.', 'error');
      throw err;
    }
  },
  async delete(id) {
    try {
      return await window.TBF_API.Media.delete(id);
    } catch (err) {
      Utils.showToast(err.message || 'Failed to delete media.', 'error');
      throw err;
    }
  }
};

/* ================================================================
   CART SERVICE
   ================================================================ */
const CartService = {
  storageKey: 'tbf_cart',
  getItems() {
    const cart = localStorage.getItem(this.storageKey);
    return cart ? JSON.parse(cart) : [];
  },
  addItem(itemData) {
    const cart = this.getItems();
    const existingIndex = cart.findIndex(i => i.designId === itemData.designId);
    
    if (existingIndex !== -1) {
       cart[existingIndex].qty = Number(cart[existingIndex].qty) + 1;
    } else {
       cart.push({ ...itemData, qty: itemData.qty || 1 });
    }
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.updateWidget();
    Utils.showToast(`${itemData.name} added to your request!`, 'success');
  },
  removeItem(index) {
    const cart = this.getItems();
    cart.splice(index, 1);
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.updateWidget();
  },
  clearCart() {
    localStorage.removeItem(this.storageKey);
    this.updateWidget();
  },
  getItemCount() {
    return this.getItems().reduce((total, item) => total + Number(item.qty), 0);
  },
  updateWidget() {
    const count = this.getItemCount();
    const widget = document.getElementById('floatingCart');
    const countSpan = document.getElementById('cartItemCount');
    if (widget && countSpan) {
      countSpan.textContent = count;
      widget.style.display = count > 0 ? 'block' : 'none';
    }
  }
};

window.TBF = { Utils, ComponentLoader, OrderService, DesignService, MediaService, CartService };