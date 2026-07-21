document.addEventListener('DOMContentLoaded', () => {
  // 1. Kick them out if the cart is empty
//   const cartItems = TBF.CartService.getItems();
//   if (cartItems.length === 0) {
//     alert("Your cart is empty! Redirecting to catalog...");
//     window.location.href = "products.html"; // Change to your actual shop page
//     return;
//   }

  // 2. Render the Cart Summary
  renderCartSummary(cartItems);

  // 3. Attach Form Submit Listener
  const form = document.getElementById('checkoutForm');
  form.addEventListener('submit', handleCheckoutSubmit);
});

function renderCartSummary(cartItems) {
  const container = document.getElementById('cartItemsContainer');
  let totalQty = 0;
  let html = '';

  cartItems.forEach((item, index) => {
    totalQty += Number(item.qty);
    html += `
      <div class="summary-item">
        <div>
          <strong>Design ID: ${item.designId || 'Custom'}</strong><br>
          <span style="color: #666; font-size: 12px;">Qty: ${item.qty} | Event: ${item.event || 'N/A'}</span>
        </div>
        <button type="button" onclick="removeItem(${index})" style="background:none; border:none; color:red; cursor:pointer;">Remove</button>
      </div>
    `;
  });

  container.innerHTML = html;
  document.getElementById('summaryTotalItems').textContent = totalQty;
}

// Global function so the inline HTML button can reach it
window.removeItem = function(index) {
  TBF.CartService.removeItem(index);
  // Reload the page to refresh the state, or re-render dynamically
  window.location.reload(); 
};

async function handleCheckoutSubmit(event) {
  event.preventDefault();
  
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.textContent = "Processing...";
  submitBtn.disabled = true;

  try {
    // Generate a unique Order ID (e.g., TBF-2026-6417)
    const orderId = 'TBF-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    // Build the grand payload
    const payload = {
      id: orderId,
      customer: document.getElementById('customerName').value,
      phone: document.getElementById('customerPhone').value,
      whatsapp: document.getElementById('customerWhatsapp').value,
      address: document.getElementById('customerAddress').value,
      deliveryMode: document.getElementById('deliveryMode').value,
      cart: TBF.CartService.getItems() // The magic array!
    };

    // Send to backend
    await TBF.OrderService.placeOrder(payload);

    // Success! Clear the cart and redirect
    TBF.CartService.clearCart();
    
    // You can redirect to a custom success page, passing the ID in the URL
    window.location.href = `success.html?orderId=${orderId}`;

  } catch (error) {
    alert("Failed to submit order: " + error.message);
    submitBtn.textContent = "Complete Order";
    submitBtn.disabled = false;
  }
}