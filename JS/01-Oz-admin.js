// Admin Panel JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin panel loaded');
    
    // Initialize admin functionality
    initializeAdminButtons();
    initializeSearchFunctionality();
    initializeStatistics();
});

// Initialize admin button functionality
function initializeAdminButtons() {
    // Product Management
    const productManagementBtn = document.querySelector('.btn.btn-primary');
    if (productManagementBtn && productManagementBtn.textContent.includes('إدارة المنتجات')) {
        productManagementBtn.addEventListener('click', function() {
            handleProductManagement();
        });
    }
    
    // Order Management
    const orderManagementBtn = document.querySelector('.btn.btn-success');
    if (orderManagementBtn && orderManagementBtn.textContent.includes('عرض الطلبات')) {
        orderManagementBtn.addEventListener('click', function() {
            handleOrderManagement();
        });
    }
    
    // Customer Management
    const customerManagementBtn = document.querySelector('.btn.btn-info');
    if (customerManagementBtn && customerManagementBtn.textContent.includes('إدارة العملاء')) {
        customerManagementBtn.addEventListener('click', function() {
            handleCustomerManagement();
        });
    }
    
    // Reports
    const reportsBtn = document.querySelector('.btn.btn-warning');
    if (reportsBtn && reportsBtn.textContent.includes('عرض التقارير')) {
        reportsBtn.addEventListener('click', function() {
            handleReports();
        });
    }
}

// Product Management functionality
function handleProductManagement() {
    showModal('إدارة المنتجات', `
        <div class="mb-3">
            <p>هنا يمكنك إدارة المنتجات:</p>
            <ul>
                <li>إضافة منتجات جديدة</li>
                <li>تعديل المنتجات الموجودة</li>
                <li>حذف المنتجات</li>
                <li>إدارة الفئات</li>
            </ul>
        </div>
        <div class="d-grid gap-2">
            <button class="btn btn-primary" onclick="window.location.href='01-Oz-products.html'">
                عرض المنتجات
            </button>
            <button class="btn btn-success" onclick="addNewProduct()">
                إضافة منتج جديد
            </button>
        </div>
    `);
}

// Order Management functionality
function handleOrderManagement() {
    // Simulate orders data
    const orders = [
        { id: '001', customer: 'أحمد محمد', total: '45.50 ر.ع', status: 'قيد المعالجة' },
        { id: '002', customer: 'فاطمة علي', total: '32.75 ر.ع', status: 'تم التسليم' },
        { id: '003', customer: 'سعد الحارثي', total: '67.25 ر.ع', status: 'قيد التوصيل' }
    ];
    
    let ordersHtml = `
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>رقم الطلب</th>
                        <th>العميل</th>
                        <th>المجموع</th>
                        <th>الحالة</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    orders.forEach(order => {
        ordersHtml += `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.total}</td>
                <td><span class="badge bg-info">${order.status}</span></td>
            </tr>
        `;
    });
    
    ordersHtml += `
                </tbody>
            </table>
        </div>
    `;
    
    showModal('إدارة الطلبات', ordersHtml);
}

// Customer Management functionality
function handleCustomerManagement() {
    showModal('إدارة العملاء', `
        <div class="mb-3">
            <p>إحصائيات العملاء:</p>
            <div class="row text-center">
                <div class="col-md-4">
                    <div class="card bg-primary text-white">
                        <div class="card-body">
                            <h4>89</h4>
                            <p>إجمالي العملاء</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-success text-white">
                        <div class="card-body">
                            <h4>12</h4>
                            <p>عملاء جدد هذا الشهر</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-info text-white">
                        <div class="card-body">
                            <h4>67</h4>
                            <p>عملاء نشطون</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
}

// Reports functionality
function handleReports() {
    showModal('التقارير والإحصائيات', `
        <div class="row">
            <div class="col-md-6">
                <h5>تقرير المبيعات</h5>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between">
                        <span>مبيعات اليوم</span>
                        <strong>1,250 ر.ع</strong>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>مبيعات الأسبوع</span>
                        <strong>8,750 ر.ع</strong>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>مبيعات الشهر</span>
                        <strong>32,450 ر.ع</strong>
                    </li>
                </ul>
            </div>
            <div class="col-md-6">
                <h5>أفضل المنتجات</h5>
                <ol class="list-group list-group-numbered">
                    <li class="list-group-item">براونيز بريميوم</li>
                    <li class="list-group-item">كوكيز نيويورك</li>
                    <li class="list-group-item">قطع الكراميل</li>
                </ol>
            </div>
        </div>
    `);
}

// Search functionality
function initializeSearchFunctionality() {
    const searchForm = document.querySelector('form.d-flex');
    const searchInput = document.querySelector('input[type="search"]');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // Implement admin search functionality
                performAdminSearch(searchTerm);
            }
        });
    }
}

// Initialize statistics update
function initializeStatistics() {
    // Update statistics periodically (every 30 seconds)
    setInterval(updateStatistics, 30000);
}

// Perform admin search
function performAdminSearch(searchTerm) {
    showModal('نتائج البحث', `
        <p>نتائج البحث عن: "<strong>${searchTerm}</strong>"</p>
        <div class="alert alert-info">
            سيتم تطوير وظيفة البحث في النسخة القادمة
        </div>
    `);
}

// Update statistics
function updateStatistics() {
    // This would typically fetch real data from a server
    console.log('Updating admin statistics...');
}

// Add new product function
function addNewProduct() {
    showModal('إضافة منتج جديد', `
        <form id="addProductForm">
            <div class="mb-3">
                <label for="productName" class="form-label">اسم المنتج</label>
                <input type="text" class="form-control" id="productName" required>
            </div>
            <div class="mb-3">
                <label for="productPrice" class="form-label">السعر (ر.ع)</label>
                <input type="number" class="form-control" id="productPrice" step="0.01" required>
            </div>
            <div class="mb-3">
                <label for="productDescription" class="form-label">الوصف</label>
                <textarea class="form-control" id="productDescription" rows="3"></textarea>
            </div>
            <div class="mb-3">
                <label for="productCategory" class="form-label">الفئة</label>
                <select class="form-control" id="productCategory" required>
                    <option value="">اختر الفئة</option>
                    <option value="brownies">براونيز</option>
                    <option value="cookies">كوكيز</option>
                    <option value="cakes">كيك</option>
                    <option value="others">أخرى</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary btn-arabic">إضافة المنتج</button>
        </form>
    `);
    
    // Handle form submission
    document.getElementById('addProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productData = {
            name: document.getElementById('productName').value,
            price: document.getElementById('productPrice').value,
            description: document.getElementById('productDescription').value,
            category: document.getElementById('productCategory').value
        };
        
        // Here you would send the data to your server
        console.log('New product data:', productData);
        
        // Close modal and show success message
        closeModal();
        showSuccessMessage('تم إضافة المنتج بنجاح!');
    });
}

// Utility function to show modal
function showModal(title, content) {
    const modalHtml = `
        <div class="modal fade" id="adminModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary btn-arabic" data-bs-dismiss="modal">إغلاق</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('adminModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('adminModal'));
    modal.show();
}

// Utility function to close modal
function closeModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('adminModal'));
    if (modal) {
        modal.hide();
    }
}

// Utility function to show success message
function showSuccessMessage(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alert.innerHTML = `
        <strong>نجح!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 150);
    }, 3000);
}

// Export functions for global access
window.OzdenAdmin = {
    handleProductManagement,
    handleOrderManagement,
    handleCustomerManagement,
    handleReports,
    addNewProduct,
    showModal,
    closeModal,
    showSuccessMessage
};
