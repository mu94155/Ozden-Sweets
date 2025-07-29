// Add Product Form Management
class ProductManager {
    constructor() {
        this.initializeForm();
        this.setupEventListeners();
        this.loadPendingImage();
        this.ensureProperLayout();
    }

    initializeForm() {
        this.form = document.getElementById('addProductForm');
        this.imageInput = document.getElementById('productImage');
        this.imagePreview = document.getElementById('imagePreview');
        this.messageContainer = document.getElementById('messageContainer');
    }

    setupEventListeners() {
        // Image preview with additional safeguards
        this.imageInput.addEventListener('change', (e) => {
            e.stopPropagation();
            this.handleImagePreview(e);
        });
        
        // Auto-generate product ID
        document.getElementById('productName').addEventListener('input', (e) => this.generateProductId(e));
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Form reset
        document.querySelector('button[type="reset"]').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleFormReset();
        });
        
        // Prevent any unwanted form submissions
        this.form.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.type !== 'submit') {
                e.preventDefault();
            }
        });
    }

    handleImagePreview(event) {
        // Prevent any default behavior that might cause page reload
        event.preventDefault();
        
        const file = event.target.files[0];
        
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showMessage('error', 'خطأ!', 'يرجى اختيار ملف صورة صحيح.');
                this.imageInput.value = '';
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                this.showMessage('error', 'خطأ!', 'حجم الصورة كبير جداً. الحد الأقصى 5MB.');
                this.imageInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                // Generate the new filename
                const timestamp = Date.now();
                const extension = file.name.split('.').pop().toLowerCase();
                const newFileName = `product_${timestamp}.${extension}`;
                
                this.imagePreview.innerHTML = `
                    <img src="${e.target.result}" alt="Product Preview" 
                         style="max-width: 100%; max-height: 150px; border-radius: 4px;">
                    <p class="text-success mt-2 arabic-text small">معاينة الصورة</p>
                    <p class="text-muted small">اسم الملف الجديد: <code>${newFileName}</code></p>
                    <button type="button" class="btn btn-xs btn-outline-primary mt-1 download-btn" 
                            data-original="${file.name}" data-new="${newFileName}" data-url="${e.target.result}">
                        <i class="bi bi-download"></i> تحميل للحفظ
                    </button>
                `;
                
                // Add event listener to the download button
                const downloadBtn = this.imagePreview.querySelector('.download-btn');
                downloadBtn.addEventListener('click', (btnEvent) => {
                    btnEvent.preventDefault();
                    btnEvent.stopPropagation();
                    this.previewDownloadImage(
                        downloadBtn.dataset.original, 
                        downloadBtn.dataset.new, 
                        downloadBtn.dataset.url
                    );
                });
                
                // Store current image data
                this.currentImageData = {
                    originalName: file.name,
                    newFileName: newFileName,
                    dataURL: e.target.result,
                    timestamp: timestamp
                };
                
                // Show success message
                this.showMessage('success', 'نجح!', 'تم تحميل الصورة بنجاح.');
                
                // Navigate to add product page after image is loaded
                // Check if we're not already on the add product page
                const currentPage = window.location.pathname.split('/').pop();
                if (currentPage !== '01-Oz-addProduct.html') {
                    // Show loading message
                    this.showMessage('info', 'جاري التحويل...', 'سيتم الانتقال إلى صفحة إضافة المنتج.');
                    
                    // Store image data in localStorage for the add product page
                    localStorage.setItem('pendingProductImage', JSON.stringify({
                        originalName: file.name,
                        newFileName: newFileName,
                        dataURL: e.target.result,
                        timestamp: timestamp
                    }));
                    
                    // Navigate after a short delay to show the success message
                    setTimeout(() => {
                        window.location.href = '01-Oz-addProduct.html';
                    }, 1500);
                }
            };
            reader.readAsDataURL(file);
            
            // Update file input label
            const label = document.querySelector('label[for="productImage"]');
            if (label) {
                label.innerHTML = `<i class="bi bi-check-circle me-2"></i>${file.name}`;
                label.classList.add('text-success');
            }
        }
    }

    generateProductId(event) {
        const name = event.target.value;
        const productIdField = document.getElementById('productId');
        
        if (name && !productIdField.value) {
            // Generate ID from name
            let id = name
                .trim()
                .toLowerCase()
                .replace(/[\u0600-\u06FF\s]+/g, '_') // Replace Arabic chars and spaces with underscore
                .replace(/[^a-zA-Z0-9_]/g, '') // Keep only alphanumeric and underscore
                .replace(/_+/g, '_') // Replace multiple underscores with single
                .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
            
            if (!id || id.length < 3) {
                id = 'product_' + Date.now(); // Fallback ID
            }
            
            productIdField.value = id;
        }
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        
        // Validate form
        if (!this.form.checkValidity()) {
            this.form.classList.add('was-validated');
            return;
        }

        // Get form data
        const formData = new FormData(this.form);
        const productData = this.extractProductData(formData);

        try {
            // Validate required fields
            if (!this.validateProductData(productData)) {
                return;
            }

            // Process image
            const imageFile = formData.get('productImage');
            if (imageFile && imageFile.size > 0) {
                productData.image = await this.processProductImage(imageFile);
            }

            // Save product
            await this.saveProduct(productData);
            
            // Show success message
            this.showMessage('success', 'تم إضافة المنتج بنجاح!', 
                'تم حفظ المنتج وسيظهر في قائمة المنتجات.');
            
            // Reset form
            this.resetForm();
            
        } catch (error) {
            console.error('Error adding product:', error);
            this.showMessage('error', 'خطأ!', 'حدث خطأ أثناء إضافة المنتج. يرجى المحاولة مرة أخرى.');
        }
    }

    extractProductData(formData) {
        return {
            id: formData.get('productId'),
            name: formData.get('productName'),
            price: parseFloat(formData.get('productPrice')),
            description: formData.get('productDescription'),
            category: formData.get('productCategory'),
            image: '',
            isFeatured: formData.get('isFeatured') === 'on',
            isAvailable: formData.get('isAvailable') === 'on'
        };
    }

    validateProductData(productData) {
        // Check for duplicate ID
        if (this.isProductIdExists(productData.id)) {
            this.showMessage('error', 'خطأ!', 'معرف المنتج موجود بالفعل. يرجى اختيار معرف آخر.');
            return false;
        }

        // Validate price
        if (productData.price <= 0) {
            this.showMessage('error', 'خطأ!', 'يرجى إدخال سعر صحيح أكبر من صفر.');
            return false;
        }

        return true;
    }

    isProductIdExists(id) {
        // Check if products array exists in localStorage or data file
        // For now, we'll just return false, but in a real app you'd check against existing products
        try {
            const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
            return existingProducts.some(product => product.id === id);
        } catch {
            return false;
        }
    }

    async processProductImage(imageFile) {
        return new Promise((resolve, reject) => {
            try {
                // Use the current image data if available
                if (this.currentImageData) {
                    const imagePath = `Images/${this.currentImageData.newFileName}`;
                    
                    // Store the image data for reference
                    localStorage.setItem(`product_image_${this.currentImageData.timestamp}`, JSON.stringify(this.currentImageData));
                    
                    // Show instructions to user
                    this.showImageCopyInstructions(imageFile, this.currentImageData.newFileName);
                    
                    resolve(imagePath);
                } else {
                    // Fallback method
                    const timestamp = Date.now();
                    const extension = imageFile.name.split('.').pop().toLowerCase();
                    const fileName = `product_${timestamp}.${extension}`;
                    
                    // Create the image path
                    const imagePath = `Images/${fileName}`;
                    
                    // Save image data to localStorage and provide copy instructions
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        // Store the image data for reference
                        const imageData = {
                            fileName: fileName,
                            originalName: imageFile.name,
                            dataURL: e.target.result,
                            timestamp: timestamp,
                            size: imageFile.size,
                            type: imageFile.type
                        };
                        
                        localStorage.setItem(`product_image_${timestamp}`, JSON.stringify(imageData));
                        
                        // Show instructions to user
                        this.showImageCopyInstructions(imageFile, fileName);
                        
                        resolve(imagePath);
                    };
                    reader.onerror = () => reject(new Error('Failed to read image file'));
                    reader.readAsDataURL(imageFile);
                }
                
            } catch (error) {
                reject(new Error('Failed to process image: ' + error.message));
            }
        });
    }

    async saveProduct(productData) {
        try {
            // Get existing products from localStorage
            const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
            
            // Add new product
            existingProducts.push(productData);
            
            // Save back to localStorage
            localStorage.setItem('products', JSON.stringify(existingProducts, null, 2));
            
            // Also save to a global products array if it exists
            if (typeof window.products !== 'undefined') {
                window.products.push(productData);
            }
            
            console.log('Product saved successfully:', productData);
            
            // In a real application, you would send this to a server
            // return fetch('/api/products', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(productData)
            // });
            
        } catch (error) {
            throw new Error('Failed to save product: ' + error.message);
        }
    }

    handleFormReset() {
        this.form.classList.remove('was-validated');
        this.resetImagePreview();
        this.resetFileInputLabel();
        this.clearMessages();
    }

    resetForm() {
        this.form.reset();
        this.form.classList.remove('was-validated');
        this.resetImagePreview();
        this.resetFileInputLabel();
    }

    resetImagePreview() {
        this.imagePreview.innerHTML = `
            <i class="bi bi-image fs-1 text-muted"></i>
            <p class="text-muted mt-2 arabic-text">معاينة الصورة</p>
        `;
        this.currentImageData = null;
    }

    resetFileInputLabel() {
        const label = document.querySelector('label[for="productImage"]');
        label.innerHTML = '<i class="bi bi-cloud-upload me-2"></i>اختر صورة المنتج';
        label.classList.remove('text-success');
    }

    loadPendingImage() {
        // Check if there's a pending image from localStorage
        const pendingImageData = localStorage.getItem('pendingProductImage');
        
        if (pendingImageData) {
            try {
                const imageData = JSON.parse(pendingImageData);
                
                // Display the pending image
                this.imagePreview.innerHTML = `
                    <img src="${imageData.dataURL}" alt="Product Preview" 
                         style="max-width: 100%; max-height: 150px; border-radius: 4px;">
                    <p class="text-success mt-2 arabic-text small">تم تحميل الصورة من الصفحة السابقة ✅</p>
                    <p class="text-muted small">اسم الملف: <code>${imageData.newFileName}</code></p>
                    <button type="button" class="btn btn-xs btn-outline-primary mt-1 download-btn" 
                            data-original="${imageData.originalName}" data-new="${imageData.newFileName}" data-url="${imageData.dataURL}">
                        <i class="bi bi-download"></i> تحميل للحفظ
                    </button>
                `;
                
                // Add event listener to the download button
                const downloadBtn = this.imagePreview.querySelector('.download-btn');
                if (downloadBtn) {
                    downloadBtn.addEventListener('click', (btnEvent) => {
                        btnEvent.preventDefault();
                        btnEvent.stopPropagation();
                        this.previewDownloadImage(
                            downloadBtn.dataset.original, 
                            downloadBtn.dataset.new, 
                            downloadBtn.dataset.url
                        );
                    });
                }
                
                // Store the image data
                this.currentImageData = imageData;
                
                // Update file input label
                const label = document.querySelector('label[for="productImage"]');
                if (label) {
                    label.innerHTML = `<i class="bi bi-check-circle me-2"></i>${imageData.originalName}`;
                    label.classList.add('text-success');
                }
                
                // Show success message
                this.showMessage('success', 'تم التحميل!', 'تم تحميل الصورة المحددة مسبقاً.');
                
                // Clear the pending image data
                localStorage.removeItem('pendingProductImage');
                
            } catch (error) {
                console.error('Error loading pending image:', error);
                localStorage.removeItem('pendingProductImage');
            }
        }
    }

    ensureProperLayout() {
        // Ensure the page loads with proper positioning
        setTimeout(() => {
            // Reset any horizontal scroll position
            window.scrollTo(0, window.scrollY);
            
            // Ensure the body is properly positioned
            document.body.style.transform = 'translateX(0)';
            document.body.style.position = 'relative';
            
            // Force a reflow to fix any layout issues
            document.body.offsetHeight;
            
            // If we're still off-center, scroll to the form
            const formContainer = document.querySelector('.form-container');
            if (formContainer) {
                const rect = formContainer.getBoundingClientRect();
                if (rect.left < 0 || rect.left > window.innerWidth * 0.1) {
                    formContainer.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start', 
                        inline: 'center' 
                    });
                }
            }
        }, 100);
        
        // Also add a resize listener to handle window resize
        window.addEventListener('resize', () => {
            window.scrollTo(0, window.scrollY);
        });
    }

    clearMessages() {
        this.messageContainer.innerHTML = '';
    }

    showMessage(type, title, message) {
        let alertClass, icon;
        
        switch(type) {
            case 'success':
                alertClass = 'alert-success';
                icon = 'bi-check-circle';
                break;
            case 'error':
                alertClass = 'alert-danger';
                icon = 'bi-exclamation-triangle';
                break;
            case 'info':
                alertClass = 'alert-info';
                icon = 'bi-info-circle';
                break;
            default:
                alertClass = 'alert-secondary';
                icon = 'bi-info-circle';
        }
        
        this.messageContainer.innerHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                <i class="bi ${icon} me-2"></i>
                <strong class="arabic-text">${title}</strong>
                <span class="arabic-text"> ${message}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        // Auto-dismiss after 5 seconds (except for info messages)
        if (type !== 'info') {
            setTimeout(() => {
                const alert = this.messageContainer.querySelector('.alert');
                if (alert) {
                    const bsAlert = new bootstrap.Alert(alert);
                    bsAlert.close();
                }
            }, 5000);
        }
        
        // Scroll to message
        this.messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showImageCopyInstructions(originalFile, newFileName) {
        const instructions = `
            <div class="alert alert-info alert-dismissible fade show" role="alert">
                <i class="bi bi-info-circle me-2"></i>
                <strong class="arabic-text">تعليمات حفظ الصورة:</strong>
                <div class="mt-2 arabic-text">
                    <p class="mb-1">لإكمال إضافة المنتج، يرجى حفظ صورة المنتج:</p>
                    <ol class="mb-2">
                        <li>انقر على زر "تحميل الصورة" أدناه</li>
                        <li>احفظ الصورة في مجلد: <code>Images/</code></li>
                        <li>تأكد من اسم الملف: <code>${newFileName}</code></li>
                    </ol>
                    <div class="d-flex gap-2 mt-2">
                        <button type="button" class="btn btn-sm btn-success" onclick="window.productManager.downloadProcessedImage('${newFileName}')">
                            <i class="bi bi-download me-1"></i>تحميل الصورة
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-primary" onclick="navigator.clipboard.writeText('${newFileName}').then(() => alert('تم نسخ اسم الملف!'))">
                            <i class="bi bi-clipboard me-1"></i>نسخ اسم الملف
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" onclick="window.productManager.openImagesFolder()">
                            <i class="bi bi-folder2-open me-1"></i>فتح مجلد الصور
                        </button>
                    </div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        // Add instructions before the success message
        const existingAlert = this.messageContainer.querySelector('.alert');
        if (existingAlert) {
            existingAlert.insertAdjacentHTML('beforebegin', instructions);
        } else {
            this.messageContainer.innerHTML = instructions + this.messageContainer.innerHTML;
        }
    }

    downloadProcessedImage(fileName) {
        try {
            // Get the latest image data from localStorage
            const imageKeys = Object.keys(localStorage).filter(key => key.startsWith('product_image_'));
            if (imageKeys.length === 0) {
                this.showMessage('error', 'خطأ!', 'لم يتم العثور على بيانات الصورة.');
                return;
            }
            
            // Get the most recent image
            const latestKey = imageKeys[imageKeys.length - 1];
            const imageData = JSON.parse(localStorage.getItem(latestKey));
            
            // Create download link
            const link = document.createElement('a');
            link.href = imageData.dataURL;
            link.download = fileName;
            link.style.display = 'none';
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showMessage('success', 'تم بدء التحميل!', 'احفظ الصورة في مجلد Images/ بالاسم المحدد.');
            
        } catch (error) {
            console.error('Error downloading image:', error);
            this.showMessage('error', 'خطأ!', 'فشل في تحميل الصورة.');
        }
    }

    openImagesFolder() {
        // This will show instructions since we can't directly open folders
        this.showMessage('info', 'مجلد الصور', 'انتقل إلى مجلد المشروع ثم افتح مجلد Images/ وضع الصورة هناك.');
    }

    previewDownloadImage(originalName, newFileName, dataURL) {
        try {
            // Create download link
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = newFileName;
            link.style.display = 'none';
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showMessage('success', 'تم بدء التحميل!', `احفظ الصورة باسم "${newFileName}" في مجلد Images/`);
            
        } catch (error) {
            console.error('Error downloading image:', error);
            this.showMessage('error', 'خطأ!', 'فشل في تحميل الصورة.');
        }
    }
}

// Initialize the product manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const productManager = new ProductManager();
    
    // Make it globally available for debugging
    window.productManager = productManager;
});

// Utility functions for image handling
const ImageUtils = {
    // Compress image if needed
    compressImage(file, maxWidth = 800, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    },

    // Validate image dimensions
    validateImageDimensions(file, minWidth = 200, minHeight = 200) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                if (img.width < minWidth || img.height < minHeight) {
                    reject(new Error(`الصورة صغيرة جداً. الحد الأدنى ${minWidth}x${minHeight} بكسل.`));
                } else {
                    resolve(true);
                }
            };
            img.onerror = () => reject(new Error('فشل في قراءة الصورة.'));
            img.src = URL.createObjectURL(file);
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProductManager, ImageUtils };
}
