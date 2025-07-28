// Home page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Home page loaded');
    
    // Add to Cart functionality for featured products
    const addToCartButtons = document.querySelectorAll('.btn-outline-primary');
    
    addToCartButtons.forEach(button => {
        if (button.textContent.trim() === 'Add to Cart') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get product info from the card
                const card = this.closest('.card');
                const productTitle = card.querySelector('.card-title').textContent;
                const productPrice = card.querySelector('.badge').textContent;
                
                // Show success message
                showAddToCartMessage(productTitle);
                
                // Update cart count (you can implement cart logic here)
                updateCartCount();
                
                console.log(`Added ${productTitle} to cart - ${productPrice}`);
            });
        }
    });
    
    // Search functionality
    const searchForm = document.querySelector('form.d-flex');
    const searchInput = document.querySelector('input[type="search"]');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // Redirect to products page with search term
                window.location.href = `01-Oz-products.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
    
    // Smooth scrolling for menu link
    const menuLink = document.querySelector('a[href="#menu"]');
    if (menuLink) {
        menuLink.addEventListener('click', function(e) {
            e.preventDefault();
            const menuSection = document.querySelector('#menu');
            if (menuSection) {
                menuSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});

// Helper function to show add to cart message
function showAddToCartMessage(productName) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            <strong>تم الإضافة!</strong> ${productName} تم إضافته إلى العربة
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        const alert = toast.querySelector('.alert');
        if (alert) {
            alert.classList.remove('show');
            setTimeout(() => toast.remove(), 150);
        }
    }, 3000);
}

// Helper function to update cart count
function updateCartCount() {
    const cartBadge = document.querySelector('.badge.rounded-pill.bg-danger');
    if (cartBadge) {
        let currentCount = parseInt(cartBadge.textContent) || 0;
        cartBadge.textContent = currentCount + 1;
    }
}

// Export functions for potential use in other scripts
window.OzdenHome = {
    showAddToCartMessage,
    updateCartCount
};
