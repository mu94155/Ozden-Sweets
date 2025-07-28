// Checkout page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout page loaded');
    
    // Initialize checkout functionality
    initializeCheckout();
    loadCartItems();
    setupOrderButton();
});

// Initialize checkout functionality
function initializeCheckout() {
    console.log('Initializing checkout...');
    
    // Update cart items display
    displayCartItems();
    
    // Calculate and display totals
    updateOrderSummary();
}

// Load cart items from storage or use sample data
function loadCartItems() {
    let cartItems = [];
    
    // Try to get cart from localStorage, fallback to sample data
    if (window.OzdenCommon && typeof window.OzdenCommon.getCartFromStorage === 'function') {
        cartItems = window.OzdenCommon.getCartFromStorage();
    }
    
    // If no items in cart, use sample data for demonstration
    if (cartItems.length === 0) {
        cartItems = [
            {
                id: '1',
                image: 'Images/newyorkCookies.jpg',
                name: 'New York Style Cookies',
                price: 15.00,
                priceCents: 1500,
                quantity: 2,
                size: '8 pieces'
            }
            
        ];
    }
    
    return cartItems;
}

// Display cart items in the checkout page
function displayCartItems() {
    const cartItems = loadCartItems();
    const cartContainer = document.querySelector('.main');
    
    if (!cartContainer) return;
    
    if (cartItems.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart-x display-1 text-muted"></i>
                <h3 class="mt-3">العربة فارغة</h3>
                <p class="text-muted">لا توجد منتجات في عربة التسوق</p>
                <a href="01-Oz-products.html" class="btn btn-primary">تصفح المنتجات</a>
            </div>
        `;
        return;
    }
    
    let cartHTML = '<div class="row g-3">';
    
    cartItems.forEach((item, index) => {
        cartHTML += `
            <div class="col-12" data-item-id="${item.id}">
                <div class="card">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-2">
                                <img src="${item.image}" alt="${item.name}" class="img-fluid rounded" style="max-height: 80px; object-fit: cover;">
                            </div>
                            <div class="col-md-4">
                                <h6 class="mb-1">${item.name}</h6>
                                <small class="text-muted">${item.size || 'Standard size'}</small>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label small">الكمية</label>
                                <select class="form-select form-select-sm quantity-selector" data-item-id="${item.id}">
                                    ${generateQuantityOptions(item.quantity)}
                                </select>
                            </div>
                            <div class="col-md-2 text-center">
                                <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                                <br>
                                <small class="text-muted">$${item.price.toFixed(2)} each</small>
                            </div>
                            <div class="col-md-2 text-center">
                                <button class="btn btn-outline-danger btn-sm remove-item" data-item-id="${item.id}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartHTML += '</div>';
    cartContainer.innerHTML = cartHTML;
    
    // Add event listeners for quantity changes and item removal
    setupCartEventListeners();
}

// Generate quantity options for select dropdown
function generateQuantityOptions(selectedQuantity) {
    let options = '';
    for (let i = 1; i <= 10; i++) {
        const selected = i === selectedQuantity ? 'selected' : '';
        options += `<option value="${i}" ${selected}>${i}</option>`;
    }
    return options;
}

// Setup event listeners for cart interactions
function setupCartEventListeners() {
    // Quantity change handlers
    const quantitySelectors = document.querySelectorAll('.quantity-selector');
    quantitySelectors.forEach(selector => {
        selector.addEventListener('change', function() {
            const itemId = this.dataset.itemId;
            const newQuantity = parseInt(this.value);
            updateItemQuantity(itemId, newQuantity);
        });
    });
    
    // Remove item handlers
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            removeItemFromCart(itemId);
        });
    });
}

// Update item quantity
function updateItemQuantity(itemId, newQuantity) {
    const cartItems = loadCartItems();
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        cartItems[itemIndex].quantity = newQuantity;
        
        // Save updated cart
        if (window.OzdenCommon && typeof window.OzdenCommon.saveCartToStorage === 'function') {
            window.OzdenCommon.saveCartToStorage(cartItems);
        }
        
        // Refresh display
        displayCartItems();
        updateOrderSummary();
        
        // Show notification
        if (window.OzdenCommon && typeof window.OzdenCommon.showNotification === 'function') {
            window.OzdenCommon.showNotification('تم تحديث الكمية', 'info');
        }
    }
}

// Remove item from cart
function removeItemFromCart(itemId) {
    let cartItems = loadCartItems();
    cartItems = cartItems.filter(item => item.id !== itemId);
    
    // Save updated cart
    if (window.OzdenCommon && typeof window.OzdenCommon.saveCartToStorage === 'function') {
        window.OzdenCommon.saveCartToStorage(cartItems);
    }
    
    // Refresh display
    displayCartItems();
    updateOrderSummary();
    
    // Show notification
    if (window.OzdenCommon && typeof window.OzdenCommon.showNotification === 'function') {
        window.OzdenCommon.showNotification('تم حذف المنتج من العربة', 'warning');
    }
}

// Update order summary
function updateOrderSummary() {
    const cartItems = loadCartItems();
    
    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 4.99 : 0;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;
    
    // Update the summary display
    const summaryElements = {
        items: document.querySelector('.payment-summary .d-flex:nth-child(1) span:last-child'),
        shipping: document.querySelector('.payment-summary .d-flex:nth-child(2) span:last-child'),
        subtotal: document.querySelector('.payment-summary .d-flex:nth-child(3) span:last-child'),
        tax: document.querySelector('.payment-summary .d-flex:nth-child(4) span:last-child'),
        total: document.querySelector('.payment-summary .h5.text-primary')
    };
    
    if (summaryElements.items) {
        summaryElements.items.textContent = `$${subtotal.toFixed(2)}`;
        // Update item count
        const itemCountElement = summaryElements.items.parentElement.querySelector('span:first-child');
        if (itemCountElement) {
            const totalItems = cartItems.reduce((count, item) => count + item.quantity, 0);
            itemCountElement.textContent = `الاختيارات: (${totalItems}):`;
        }
    }
    
    if (summaryElements.shipping) {
        summaryElements.shipping.textContent = `$${shipping.toFixed(2)}`;
    }
    
    if (summaryElements.subtotal) {
        summaryElements.subtotal.textContent = `$${(subtotal + shipping).toFixed(2)}`;
    }
    
    if (summaryElements.tax) {
        summaryElements.tax.textContent = `$${tax.toFixed(2)}`;
    }
    
    if (summaryElements.total) {
        summaryElements.total.textContent = `$${total.toFixed(2)}`;
    }
}

// Setup order button functionality
function setupOrderButton() {
    const orderButton = document.querySelector('.place-order-button');
    
    if (orderButton) {
        orderButton.addEventListener('click', function() {
            processOrder();
        });
    }
}

// Process the order
function processOrder() {
    const cartItems = loadCartItems();
    
    if (cartItems.length === 0) {
        if (window.OzdenCommon && typeof window.OzdenCommon.showNotification === 'function') {
            window.OzdenCommon.showNotification('العربة فارغة! أضف منتجات للمتابعة', 'warning');
        }
        return;
    }
    
    // Simulate order processing
    const orderButton = document.querySelector('.place-order-button');
    const originalText = orderButton.innerHTML;
    
    // Show loading state
    orderButton.disabled = true;
    orderButton.innerHTML = '<i class="bi bi-hourglass-split"></i> جاري المعالجة...';
    
    // Simulate API call
    setTimeout(() => {
        // Clear cart
        if (window.OzdenCommon && typeof window.OzdenCommon.saveCartToStorage === 'function') {
            window.OzdenCommon.saveCartToStorage([]);
        }
        
        // Show success message
        showOrderSuccess();
        
        // Reset button
        orderButton.disabled = false;
        orderButton.innerHTML = originalText;
        
    }, 2000);
}

// Show order success message
function showOrderSuccess() {
    const successModal = `
        <div class="modal fade" id="orderSuccessModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body text-center py-5">
                        <i class="bi bi-check-circle-fill text-success display-1"></i>
                        <h3 class="mt-3 text-success">تم إتمام الطلب بنجاح!</h3>
                        <p class="text-muted">سيتم التواصل معك قريباً لتأكيد الطلب وترتيب التوصيل</p>
                        <div class="mt-4">
                            <button type="button" class="btn btn-primary me-2" onclick="window.location.href='01-Oz-home.html'">
                                العودة للرئيسية
                            </button>
                            <button type="button" class="btn btn-outline-secondary" onclick="window.location.href='01-Oz-products.html'">
                                تصفح المزيد
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successModal);
    const modal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
    modal.show();
    
    // Auto redirect after 5 seconds
    setTimeout(() => {
        window.location.href = '01-Oz-home.html';
    }, 5000);
}

// Export functions for potential external use
window.OzdenCheckout = {
    loadCartItems,
    displayCartItems,
    updateItemQuantity,
    removeItemFromCart,
    updateOrderSummary,
    processOrder
};
