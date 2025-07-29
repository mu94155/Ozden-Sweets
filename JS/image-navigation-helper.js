// Universal Image Navigation Helper
// Add this script to any page where you want image selection to navigate to add product page

class ImageNavigationHelper {
    constructor() {
        this.setupImageNavigation();
    }

    setupImageNavigation() {
        // Find all file inputs that should trigger navigation
        const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
        
        imageInputs.forEach(input => {
            input.addEventListener('change', (event) => this.handleImageSelection(event));
        });
    }

    handleImageSelection(event) {
        const file = event.target.files[0];
        
        if (file && file.type.startsWith('image/')) {
            // Show loading message
            this.showNavigationMessage();
            
            // Process the image
            const reader = new FileReader();
            reader.onload = (e) => {
                // Generate filename
                const timestamp = Date.now();
                const extension = file.name.split('.').pop().toLowerCase();
                const newFileName = `product_${timestamp}.${extension}`;
                
                // Store image data for the add product page
                const imageData = {
                    originalName: file.name,
                    newFileName: newFileName,
                    dataURL: e.target.result,
                    timestamp: timestamp
                };
                
                localStorage.setItem('pendingProductImage', JSON.stringify(imageData));
                
                // Navigate to add product page
                setTimeout(() => {
                    window.location.href = '01-Oz-addProduct.html';
                }, 1000);
            };
            
            reader.readAsDataURL(file);
        }
    }

    showNavigationMessage() {
        // Create or update a message element
        let messageEl = document.getElementById('imageNavigationMessage');
        
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'imageNavigationMessage';
            messageEl.className = 'alert alert-info position-fixed top-0 start-50 translate-middle-x mt-3';
            messageEl.style.zIndex = '9999';
            document.body.appendChild(messageEl);
        }
        
        messageEl.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="spinner-border spinner-border-sm me-2" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <span>جاري تحميل الصورة والانتقال إلى صفحة إضافة المنتج...</span>
            </div>
        `;
        
        messageEl.style.display = 'block';
    }
}

// Initialize on any page that's not the add product page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage !== '01-Oz-addProduct.html') {
        new ImageNavigationHelper();
    }
});
