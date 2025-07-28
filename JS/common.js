// Common JavaScript functionality for all Ozden Sweets pages

document.addEventListener('DOMContentLoaded', function() {
    console.log('Ozden Sweets common scripts loaded');
    
    // Initialize common functionality
    initializeNavigation();
    initializeCommonSearch();
    initializeCartFunctionality();
});

// Initialize navigation functionality
function initializeNavigation() {
    // Add active class management
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Mobile menu auto-close on link click
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks2 = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks2.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// Initialize common search functionality
function initializeCommonSearch() {
    const searchForms = document.querySelectorAll('form.d-flex');
    
    searchForms.forEach(form => {
        const searchInput = form.querySelector('input[type="search"]');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                performSearch(searchTerm);
            }
        });
        
        // Add search suggestions (optional enhancement)
        if (searchInput) {
            setupSearchSuggestions(searchInput);
        }
    });
}

// Perform search functionality
function performSearch(searchTerm) {
    // If we're not on the products page, redirect there with search term
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage !== '01-Oz-products.html') {
        window.location.href = `01-Oz-products.html?search=${encodeURIComponent(searchTerm)}`;
    } else {
        // If we're on products page, filter products
        filterProducts(searchTerm);
    }
}

// Filter products on products page
function filterProducts(searchTerm) {
    const productCards = document.querySelectorAll('.products-container .col-lg-4, .products-container .col-md-6');
    let visibleCount = 0;
    
    productCards.forEach(card => {
        const title = card.querySelector('.card-title');
        const description = card.querySelector('.card-text');
        const category = card.querySelector('.text-muted');
        
        if (title || description || category) {
            const titleText = title ? title.textContent.toLowerCase() : '';
            const descText = description ? description.textContent.toLowerCase() : '';
            const catText = category ? category.textContent.toLowerCase() : '';
            
            const searchLower = searchTerm.toLowerCase();
            
            if (titleText.includes(searchLower) || 
                descText.includes(searchLower) || 
                catText.includes(searchLower)) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        }
    });
    
    // Show search results message
    showSearchResults(searchTerm, visibleCount);
}

// Setup search suggestions
function setupSearchSuggestions(searchInput) {
    const suggestions = [
        'براونيز',
        'كوكيز',
        'كيك',
        'حلويات',
        'شوكولاتة',
        'نيويورك',
        'كراميل',
        'مكسرات'
    ];
    
    let suggestionList = null;
    
    searchInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        
        // Remove existing suggestions
        if (suggestionList) {
            suggestionList.remove();
            suggestionList = null;
        }
        
        if (value.length > 1) {
            const matches = suggestions.filter(suggestion => 
                suggestion.toLowerCase().includes(value)
            );
            
            if (matches.length > 0) {
                suggestionList = createSuggestionList(matches, searchInput);
                searchInput.parentNode.appendChild(suggestionList);
            }
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (suggestionList && !searchInput.contains(e.target) && !suggestionList.contains(e.target)) {
            suggestionList.remove();
            suggestionList = null;
        }
    });
}

// Create suggestion list
function createSuggestionList(suggestions, searchInput) {
    const list = document.createElement('div');
    list.className = 'search-suggestions position-absolute bg-white border rounded shadow-sm';
    list.style.cssText = `
        top: 100%;
        left: 0;
        right: 0;
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
    `;
    
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item px-3 py-2 cursor-pointer';
        item.textContent = suggestion;
        item.style.cursor = 'pointer';
        
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
        
        item.addEventListener('click', function() {
            searchInput.value = suggestion;
            list.remove();
            searchInput.closest('form').dispatchEvent(new Event('submit'));
        });
        
        list.appendChild(item);
    });
    
    return list;
}

// Initialize cart functionality
function initializeCartFunctionality() {
    // Update cart from localStorage if available
    updateCartDisplay();
    
    // Cart icon click handler
    const cartLinks = document.querySelectorAll('a[href="01-Oz-checkOut.html"]');
    cartLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add animation effect
            this.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                this.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        });
    });
}

// Update cart display
function updateCartDisplay() {
    const cart = getCartFromStorage();
    const cartBadges = document.querySelectorAll('.badge.rounded-pill.bg-danger');
    
    cartBadges.forEach(badge => {
        badge.textContent = cart.length;
        if (cart.length === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'inline-block';
        }
    });
}

// Get cart from localStorage
function getCartFromStorage() {
    try {
        return JSON.parse(localStorage.getItem('ozdenCart')) || [];
    } catch (error) {
        console.error('Error reading cart from storage:', error);
        return [];
    }
}

// Save cart to localStorage
function saveCartToStorage(cart) {
    try {
        localStorage.setItem('ozdenCart', JSON.stringify(cart));
        updateCartDisplay();
    } catch (error) {
        console.error('Error saving cart to storage:', error);
    }
}

// Add item to cart
function addToCart(item) {
    const cart = getCartFromStorage();
    
    // Check if item already exists
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCartToStorage(cart);
    return cart;
}

// Show search results message
function showSearchResults(searchTerm, count) {
    // Remove existing search message
    const existingMessage = document.querySelector('.search-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const message = document.createElement('div');
    message.className = 'search-results-message alert alert-info mb-4';
    message.innerHTML = `
        <i class="bi bi-search"></i>
        نتائج البحث عن "<strong>${searchTerm}</strong>": 
        ${count} منتج${count !== 1 ? 'ات' : ''} 
        ${count > 0 ? 'موجود' : 'غير موجود'}
        ${count === 0 ? '<br><small>جرب البحث بكلمات أخرى</small>' : ''}
    `;
    
    // Insert message before products grid
    const productsGrid = document.querySelector('.js-products-grid, .products-container');
    if (productsGrid) {
        productsGrid.parentNode.insertBefore(message, productsGrid);
    }
}

// Smooth scroll utility
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Format price utility
function formatPrice(price) {
    return `${price} ر.ع`;
}

// Show notification utility
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 150);
    }, 4000);
}

// Export common utilities
window.OzdenCommon = {
    performSearch,
    filterProducts,
    updateCartDisplay,
    getCartFromStorage,
    saveCartToStorage,
    addToCart,
    smoothScrollTo,
    formatPrice,
    showNotification
};
