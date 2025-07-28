// Products page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Products page loaded');
    
    // Initialize products page
    initializeProductsPage();
    loadProducts();
    handleUrlSearchParams();
});

// Initialize products page functionality
function initializeProductsPage() {
    console.log('Initializing products page...');
}

// Load and display products
function loadProducts() {
    if (typeof products === 'undefined') {
        console.error('Products data not loaded');
        return;
    }
    
    displayProducts(products);
}

// Display products with Bootstrap cards
function displayProducts(productsToShow) {
    let productsHTML = '';
    
    productsToShow.forEach((product) => {
        const price8 = product.price;
        const price12 = (product.price + (product.price * 0.25)).toFixed(2);
        
        productsHTML += `
            <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-img-top-container">
                        <img class="card-img-top product-card-image" src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title limit-text-to-2-lines">${product.name}</h5>
                        <div class="mb-2">
                            <div class="badge bg-primary mb-1">علبة 8 قطع: ${price8} ر.ع</div>
                            <div class="badge bg-secondary">علبة 12 قطع: ${price12} ر.ع</div>
                        </div>
                        <p class="card-text text-muted flex-grow-1">${product.description}</p>
                        <small class="text-muted mb-2">الفئة: ${product.category}</small>
                        
                        <div class="product-options mb-3">
                            <label class="form-label small">حجم العلبة:</label>
                            <select class="form-select form-select-sm package-size" data-product-id="${product.id}">
                                <option value="8" data-price="${price8}">علبة 8 قطع - ${price8} ر.ع</option>
                                <option value="12" data-price="${price12}">علبة 12 قطع - ${price12} ر.ع</option>
                            </select>
                        </div>
                        
                        <div class="added-to-cart alert alert-success d-none" data-product-id="${product.id}">
                            <i class="bi bi-check-circle"></i> تم الإضافة إلى العربة
                        </div>
                        
                        <div class="mt-auto">
                            <button class="btn btn-primary w-100 js-add-to-cart" 
                                    type="button" 
                                    data-product-id="${product.id}"
                                    data-product-name="${product.name}"
                                    data-product-image="${product.image}"
                                    data-product-category="${product.category}">
                                <i class="bi bi-cart-plus"></i> أضف إلى العربة
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
    });
    
    const productsGrid = document.querySelector('.js-products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = productsHTML;
        setupProductEventListeners();
    }
}

// Setup event listeners for product interactions
function setupProductEventListeners() {
    // Add to cart button handlers
    const addToCartButtons = document.querySelectorAll('.js-add-to-cart');
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', function() {
            handleAddToCart(this);
        });
    });
    
    // Package size change handlers
    const packageSelects = document.querySelectorAll('.package-size');
    packageSelects.forEach((select) => {
        select.addEventListener('change', function() {
            updateAddToCartButton(this);
        });
    });
}

// Handle add to cart functionality
function handleAddToCart(button) {
    const productId = button.dataset.productId;
    const productName = button.dataset.productName;
    const productImage = button.dataset.productImage;
    const productCategory = button.dataset.productCategory;
    
    // Get selected package size and price
    const packageSelect = document.querySelector(`.package-size[data-product-id="${productId}"]`);
    const selectedOption = packageSelect.selectedOptions[0];
    const packageSize = selectedOption.value;
    const price = parseFloat(selectedOption.dataset.price);
    
    // Create cart item object
    const cartItem = {
        id: `${productId}-${packageSize}`,
        productId: productId,
        name: productName,
        image: productImage,
        category: productCategory,
        price: price,
        size: `${packageSize} pieces`,
        quantity: 1
    };
    
    // Add to cart using common functionality
    if (window.OzdenCommon && typeof window.OzdenCommon.addToCart === 'function') {
        window.OzdenCommon.addToCart(cartItem);
    }
    
    // Show success feedback
    showAddedToCartFeedback(productId, productName, packageSize);
    
    console.log(`Added ${productName} (${packageSize} pieces) to cart - ${price} ر.ع`);
}

// Update add to cart button when package size changes
function updateAddToCartButton(packageSelect) {
    const productId = packageSelect.dataset.productId;
    const selectedOption = packageSelect.selectedOptions[0];
    const price = selectedOption.dataset.price;
    const size = selectedOption.value;
    
    // Update button text with current price
    const addButton = document.querySelector(`.js-add-to-cart[data-product-id="${productId}"]`);
    if (addButton) {
        addButton.innerHTML = `<i class="bi bi-cart-plus"></i> أضف إلى العربة - ${price} ر.ع`;
    }
}

// Show added to cart feedback
function showAddedToCartFeedback(productId, productName, packageSize) {
    // Show inline success message
    const successAlert = document.querySelector(`.added-to-cart[data-product-id="${productId}"]`);
    if (successAlert) {
        successAlert.classList.remove('d-none');
        setTimeout(() => {
            successAlert.classList.add('d-none');
        }, 2000);
    }
    
    // Show notification using common functionality
    if (window.OzdenCommon && typeof window.OzdenCommon.showNotification === 'function') {
        window.OzdenCommon.showNotification(
            `تم إضافة ${productName} (${packageSize} قطع) إلى العربة`, 
            'success'
        );
    }
    
    // Update cart display
    if (window.OzdenCommon && typeof window.OzdenCommon.updateCartDisplay === 'function') {
        window.OzdenCommon.updateCartDisplay();
    }
}

// Handle URL search parameters
function handleUrlSearchParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    
    if (searchTerm) {
        // Update search input if exists
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.value = searchTerm;
        }
        
        // Filter products using common functionality
        if (window.OzdenCommon && typeof window.OzdenCommon.filterProducts === 'function') {
            setTimeout(() => {
                window.OzdenCommon.filterProducts(searchTerm);
            }, 100);
        }
    }
}

// Filter products by category
function filterByCategory(category) {
    if (!products) return;
    
    let filteredProducts;
    if (category === 'all') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => 
            product.category.toLowerCase().includes(category.toLowerCase())
        );
    }
    
    displayProducts(filteredProducts);
    
    // Show filter results
    const message = category === 'all' 
        ? 'عرض جميع المنتجات' 
        : `منتجات فئة: ${category}`;
        
    if (window.OzdenCommon && typeof window.OzdenCommon.showNotification === 'function') {
        window.OzdenCommon.showNotification(message, 'info');
    }
}

// Sort products
function sortProducts(sortBy) {
    if (!products) return;
    
    let sortedProducts = [...products];
    
    switch (sortBy) {
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'category':
            sortedProducts.sort((a, b) => a.category.localeCompare(b.category));
            break;
        default:
            // Keep original order
            break;
    }
    
    displayProducts(sortedProducts);
}

// Export functions for external use
window.OzdenProducts = {
    displayProducts,
    filterByCategory,
    sortProducts,
    handleAddToCart
};
