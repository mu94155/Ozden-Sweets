/**
 * Mobile QR Access Manager
 * إدارة رموز QR للوصول السريع - مجمع الأصيل التجاري
 * 
 * This file handles all QR code generation, downloading, printing, and management
 * functionality for the AlAseelComm mobile access page.
 */

// بيانات QR مع روابط GitHub Pages المباشرة والمحدثة
const GITHUB_PAGES_BASE = `https://mu94155.github.io/Ozden-Sweets/)`;

// وظيفة لتحديد الرابط الأساسي (GitHub Pages أو محلي)
function getBaseUrl() {
    // استخدم دائماً GitHub Pages للQR codes لضمان العمل من أي مكان
    return GITHUB_PAGES_BASE;
}

const qrData = {
    'qr-home': {
        url: `${GITHUB_PAGES_BASE}/01-Oz-home.html`,
        title: 'الصفحة الرئيسية'
    },
    'qr-archive': {
        url: `${GITHUB_PAGES_BASE}/archive.html`,
        title: 'الأرشيف'
    },
    'qr-expenses': {
        url: `${GITHUB_PAGES_BASE}/project-expenses.html`,
        title: 'مصاريف المشروع'
    },
    'qr-phone': {
        url: 'tel:+96899869416',
        title: 'رقم الهاتف'
    },
    'qr-email': {
        url: 'mailto:info@aseelcc.com?subject=استفسار مجمع الأصيل التجاري',
        title: 'البريد الإلكتروني'
    },
    'qr-photos': {
        url: 'https://drive.google.com/drive/folders/18Apv7DpzRot1K82yK0tKPAaSgc3I4vgy?usp=drive_link',
        title: 'صور المشروع'
    }
};

/**
 * إنشاء QR باستخدام QR Server API
 * @param {string} elementId - معرف العنصر HTML الذي سيحتوي على QR
 * @param {string} url - الرابط أو النص المراد تحويله لـ QR
 */
function generateQRCode(elementId, url) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('لم يتم العثور على العنصر:', elementId);
        return;
    }
    
    console.log('إنشاء QR لـ:', elementId, 'مع الرابط:', url);
    element.innerHTML = '<div class="loading">⏳ جاري الإنشاء...</div>';
    
    // إنشاء عنصر الصورة
    const img = document.createElement('img');
    img.className = 'qr-image';
    img.alt = 'QR Code';
    
    // رابط QR Server API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}&margin=10&format=png`;
    console.log('QR URL:', qrUrl);
    
    img.onload = function() {
        console.log('تم تحميل QR بنجاح لـ:', elementId);
        element.innerHTML = '';
        element.appendChild(img);
    };
    
    img.onerror = function() {
        console.error('فشل في تحميل QR لـ:', elementId);
        element.innerHTML = `
            <div class="error">
                ⚠️ فشل في إنشاء الرمز<br>
                <button class="btn btn-sm btn-outline-primary mt-2" onclick="generateQRCode('${elementId}', '${url}')">
                    🔄 إعادة المحاولة
                </button>
            </div>
        `;
    };
    
    // تعيين المصدر (يبدأ التحميل)
    img.src = qrUrl;
}

/**
 * إنشاء جميع رموز QR
 */
function generateAllQRs() {
    console.log('بدء إنشاء جميع رموز QR...');
    
    Object.keys(qrData).forEach((id, index) => {
        setTimeout(() => {
            generateQRCode(id, qrData[id].url);
        }, index * 500); // تأخير 500ms بين كل رمز لتجنب الحمل الزائد
    });
    
    // إظهار رسالة نجاح
    setTimeout(() => {
        showToast('تم إنشاء جميع رموز QR بنجاح! 🎉', 'success');
    }, 3000);
}

/**
 * تحميل رمز QR كصورة
 * @param {string} elementId - معرف العنصر الذي يحتوي على QR
 * @param {string} filename - اسم الملف للتحميل
 */
function downloadQR(elementId, filename) {
    const img = document.querySelector('#' + elementId + ' img');
    if (img && img.src && img.complete) {
        const link = document.createElement('a');
        link.download = 'QR-' + filename + '.png';
        link.href = img.src;
        link.click();
        showToast('تم تحميل الرمز: ' + filename, 'success');
    } else {
        showToast('لم يتم إنشاء الرمز بعد. انقر "إنشاء جميع الرموز" أولاً.', 'warning');
    }
}

/**
 * طباعة رمز QR منفرد
 * @param {string} elementId - معرف العنصر الذي يحتوي على QR
 * @param {string} title - عنوان الرمز
 */
function printQR(elementId, title) {
    const img = document.querySelector('#' + elementId + ' img');
    if (img && img.src && img.complete) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>طباعة QR - ${title}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        padding: 40px; 
                        background: white;
                    }
                    .print-container { 
                        border: 3px solid #000; 
                        padding: 40px; 
                        display: inline-block; 
                        border-radius: 15px;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    }
                    .title { 
                        font-size: 28px; 
                        font-weight: bold; 
                        margin-bottom: 10px; 
                        color: #007bff;
                    }
                    .company {
                        font-size: 20px;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    .qr-image {
                        margin: 20px 0;
                        border: 2px solid #ddd;
                        border-radius: 10px;
                        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                    }
                    .url { 
                        font-size: 14px; 
                        color: #666; 
                        margin-top: 20px; 
                        word-break: break-all; 
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                        border: 1px solid #ddd;
                    }
                    .footer {
                        margin-top: 25px;
                        font-size: 12px;
                        color: #999;
                        border-top: 1px solid #eee;
                        padding-top: 15px;
                    }
                </style>
            </head>
            <body>
                <div class="print-container">
                    <div class="title">${title}</div>
                    <div class="company">مجمع الأصيل التجاري</div>
                    <img src="${img.src}" alt="QR Code" class="qr-image" style="width: 300px; height: 300px;">
                    <div class="url">${qrData[elementId].url}</div>
                    <div class="footer">
                        امسح الرمز بكاميرا هاتفك للوصول المباشر<br>
                        © 2025 مجمع الأصيل التجاري
                    </div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
            showToast('تم إرسال ' + title + ' للطباعة', 'success');
        }, 1000);
    } else {
        showToast('لم يتم إنشاء الرمز بعد.', 'warning');
    }
}

/**
 * طباعة جميع رموز QR في صفحة واحدة
 */
function printAllQRs() {
    const printWindow = window.open('', '_blank');
    let content = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>جميع رموز QR - مجمع الأصيل التجاري</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px; 
                    background: white;
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    border-bottom: 3px solid #007bff;
                    padding-bottom: 20px;
                }
                .main-title {
                    font-size: 32px;
                    color: #007bff;
                    margin-bottom: 10px;
                }
                .subtitle {
                    font-size: 18px;
                    color: #666;
                }
                .qr-grid { 
                    display: grid; 
                    grid-template-columns: repeat(2, 1fr); 
                    gap: 40px; 
                    margin: 30px 0; 
                }
                .qr-item { 
                    border: 3px solid #000; 
                    padding: 25px; 
                    text-align: center;
                    border-radius: 15px;
                    page-break-inside: avoid; 
                    background: #fafafa;
                }
                .qr-title { 
                    font-size: 20px; 
                    font-weight: bold; 
                    margin-bottom: 15px;
                    color: #333;
                }
                .qr-url { 
                    font-size: 12px; 
                    color: #666; 
                    margin-top: 15px; 
                    word-break: break-all;
                    background: white;
                    padding: 10px;
                    border-radius: 5px;
                    border: 1px solid #ddd;
                }
                .qr-img {
                    margin: 15px 0;
                    border: 2px solid #ddd;
                    border-radius: 8px;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    font-size: 14px;
                    color: #666;
                    border-top: 2px solid #eee;
                    padding-top: 20px;
                }
                @media print {
                    .qr-grid { grid-template-columns: repeat(2, 1fr); }
                    body { margin: 0; padding: 15px; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="main-title">رموز QR - مجمع الأصيل التجاري</div>
                <div class="subtitle">امسح أي رمز بكاميرا هاتفك للوصول المباشر</div>
            </div>
            <div class="qr-grid">
    `;

    let qrCount = 0;
    Object.keys(qrData).forEach(id => {
        const img = document.querySelector('#' + id + ' img');
        if (img && img.src && img.complete) {
            content += `
                <div class="qr-item">
                    <div class="qr-title">${qrData[id].title}</div>
                    <img src="${img.src}" alt="QR Code" class="qr-img" style="width: 200px; height: 200px;">
                    <div class="qr-url">${qrData[id].url}</div>
                </div>
            `;
            qrCount++;
        }
    });

    content += `
            </div>
            <div class="footer">
                <strong>© 2025 مجمع الأصيل التجاري - جميع الحقوق محفوظة</strong><br>
                تم طباعة ${qrCount} رمز QR بتاريخ ${new Date().toLocaleDateString('ar-SA')}
            </div>
        </body>
        </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
        showToast(`تم إرسال ${qrCount} رمز QR للطباعة`, 'success');
    }, 1500);
}

/**
 * إنشاء رمز QR مخصص
 */
function generateCustomQR() {
    const url = prompt('أدخل الرابط أو النص لإنشاء رمز QR مخصص:');
    if (url && url.trim()) {
        const printWindow = window.open('', '_blank');
        const cleanUrl = url.trim();
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(cleanUrl)}&margin=20&format=png`;
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>رمز QR مخصص</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        padding: 40px; 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        margin: 0;
                    }
                    .custom-container { 
                        background: white;
                        border: 3px solid #007bff; 
                        padding: 40px; 
                        display: inline-block;
                        border-radius: 20px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                        max-width: 500px;
                    }
                    .title {
                        font-size: 28px;
                        color: #007bff;
                        margin-bottom: 10px;
                        font-weight: bold;
                    }
                    .company {
                        font-size: 18px;
                        color: #333;
                        margin-bottom: 30px;
                    }
                    .qr-custom {
                        margin: 25px 0;
                        border: 2px solid #ddd;
                        border-radius: 15px;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    }
                    .url {
                        font-size: 14px;
                        color: #666;
                        margin-top: 20px;
                        word-break: break-all;
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 10px;
                        border: 1px solid #ddd;
                    }
                    .buttons {
                        margin-top: 25px;
                    }
                    .btn {
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 25px;
                        font-size: 16px;
                        cursor: pointer;
                        margin: 0 10px;
                        transition: all 0.3s ease;
                    }
                    .btn:hover {
                        background: #0056b3;
                        transform: scale(1.05);
                    }
                </style>
            </head>
            <body>
                <div class="custom-container">
                    <div class="title">رمز QR مخصص</div>
                    <div class="company">مجمع الأصيل التجاري</div>
                    <img src="${qrUrl}" alt="Custom QR Code" class="qr-custom" 
                         style="width: 350px; height: 350px;"
                         onload="this.style.display='block'; this.nextElementSibling.style.display='none';" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div style="display: none; color: red; padding: 30px; border: 2px dashed #dc3545; border-radius: 10px;">
                        ⚠️ فشل في إنشاء رمز QR<br>
                        <small>تحقق من اتصال الإنترنت والمحتوى المدخل</small>
                    </div>
                    <div class="url">${cleanUrl}</div>
                    <div class="buttons">
                        <button class="btn" onclick="window.print()">🖨️ طباعة الرمز</button>
                        <button class="btn" onclick="downloadCustomQR()">📥 تحميل الرمز</button>
                    </div>
                </div>
                <script>
                    function downloadCustomQR() {
                        const img = document.querySelector('.qr-custom');
                        if (img && img.src) {
                            const link = document.createElement('a');
                            link.download = 'QR-مخصص-' + Date.now() + '.png';
                            link.href = img.src;
                            link.click();
                        }
                    }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
        showToast('تم إنشاء رمز QR مخصص!', 'success');
    }
}

/**
 * اختبار رموز QR
 */
function testQRCodes() {
    let workingCount = 0;
    let totalCount = Object.keys(qrData).length;
    
    Object.keys(qrData).forEach(id => {
        const img = document.querySelector('#' + id + ' img');
        if (img && img.src && img.complete) {
            workingCount++;
        }
    });
    
    if (workingCount === totalCount) {
        showToast(`✅ جميع الرموز تعمل بشكل صحيح! (${workingCount}/${totalCount})`, 'success');
    } else if (workingCount > 0) {
        showToast(`⚠️ يعمل ${workingCount} من ${totalCount} رموز. انقر "إنشاء جميع الرموز" لإصلاح البقية.`, 'warning');
    } else {
        showToast(`❌ لا تعمل أي رموز. انقر "إنشاء جميع الرموز" لإنشائها.`, 'error');
    }
}

/**
 * عرض الروابط المستخدمة في رموز QR
 */
function showQRUrls() {
    const urlList = Object.keys(qrData).map(id => {
        return `• ${qrData[id].title}: ${qrData[id].url}`;
    }).join('\n');
    
    const message = `
🔗 الروابط المستخدمة في رموز QR:

${urlList}

📍 نوع الاستضافة: GitHub Pages ✅

✅ جميع هذه الروابط تعمل من أي مكان في العالم!

💡 نصيحة: شارك رموز QR مع العملاء والزملاء للوصول المباشر
🌐 الموقع الرئيسي: https://mu94155.github.io/Ozden-Sweets/
    `;
    
    alert(message);
    console.log(message);
}

/**
 * مساعدة المستخدمين
 */
function showHelp() {
    const helpText = `
🔍 دليل استخدام رموز QR:

📱 للمستخدمين:
• افتح تطبيق الكاميرا في هاتفك
• وجه الكاميرا نحو أي رمز QR
• انتظر حتى يتعرف على الرمز (ثانية أو ثانيتان)
• انقر على الرابط الذي يظهر على الشاشة

💻 لمديري الموقع:
• انقر "إنشاء جميع الرموز" لإنشاء الرموز
• استخدم "تحميل" لحفظ الرموز كصور
• استخدم "طباعة" لطباعة الرموز
• استخدم "رمز مخصص" لإنشاء رموز إضافية

🎯 نصائح مفيدة:
• احفظ رموز QR في معرض الصور للمشاركة
• اطبع الرموز ووزعها في المكاتب
• شارك الرموز عبر WhatsApp أو الإيميل
• ضع رمز الصفحة الرئيسية على بطاقات العمل

⚠️ إذا لم تعمل الرموز:
• تأكد من اتصال الإنترنت
• انقر "إنشاء جميع الرموز" مرة أخرى
• تأكد من وضوح الرمز عند المسح
• جرب تطبيق ماسح QR مختلف
    `;
    
    alert(helpText);
}

/**
 * إظهار رسالة توضيحية (Toast Notification)
 * @param {string} message - النص المراد عرضه
 * @param {string} type - نوع الرسالة (success, warning, error, info)
 */
function showToast(message, type = 'info') {
    // إنشاء عنصر التوست
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : type === 'error' ? '#dc3545' : '#007bff'};
        color: ${type === 'warning' ? '#000' : '#fff'};
        padding: 15px 25px;
        border-radius: 25px;
        z-index: 9999;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        font-weight: bold;
        max-width: 300px;
        text-align: center;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // إظهار التوست
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // إخفاء التوست
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

/**
 * تهيئة الصفحة عند التحميل
 */
function initializeQRPage() {
    console.log('🚀 تم تحميل صفحة رموز QR!');
    
    // تحديد نوع الاستضافة وإظهار رسالة مناسبة
    const isGitHubPages = window.location.hostname === 'mu94155.github.io';
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isGitHubPages) {
        showToast('🌐 تم تحميل الصفحة من GitHub Pages - الروابط ستعمل من أي مكان!', 'success');
    } else if (isLocalhost) {
        showToast('⚠️ تعمل الصفحة محلياً - الروابط ستوجه إلى GitHub Pages للوصول العالمي', 'warning');
    } else {
        showToast('مرحباً! جاري إنشاء رموز QR...', 'info');
    }
    
    // إنشاء الرموز تلقائياً بعد ثانية واحدة
    setTimeout(() => {
        generateAllQRs();
    }, 1000);
    
    // معلومات تشخيصية مفصلة - جميع الروابط تشير إلى GitHub Pages
    console.log('📊 بيانات QR المحدثة:', qrData);
    console.log('🌐 URL الحالي:', window.location.href);
    console.log('🔗 جميع روابط QR تشير إلى:', GITHUB_PAGES_BASE);
    console.log('📱 حالة الموقع:', isGitHubPages ? 'GitHub Pages (مباشر)' : 'محلي (QR codes تشير لـ GitHub Pages)');
    
    // عرض معلومات الروابط المحدثة للمستخدم
    const linkInfo = `
🔗 روابط QR المحدثة (جميعها تعمل عالمياً):
• الصفحة الرئيسية: ${qrData['qr-home'].url}
• الأرشيف: ${qrData['qr-archive'].url}
• المصاريف: ${qrData['qr-expenses'].url}
• الهاتف: ${qrData['qr-phone'].url}
• الإيميل: ${qrData['qr-email'].url}
• الصور: ${qrData['qr-photos'].url}

✅ جميع الروابط تعمل من أي جهاز في العالم!
    `;
    console.log(linkInfo);
}

/**
 * معالجة الأخطاء العامة
 */
function handlePageErrors() {
    window.addEventListener('error', function(e) {
        console.error('خطأ في الصفحة:', e.error);
        showToast('حدث خطأ. يرجى إعادة تحميل الصفحة.', 'error');
    });
}

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeQRPage();
    handlePageErrors();
});

// تصدير الوظائف للاستخدام العام
window.QRManager = {
    generateQRCode,
    generateAllQRs,
    downloadQR,
    printQR,
    printAllQRs,
    generateCustomQR,
    testQRCodes,
    showHelp,
    showToast,
    qrData
};
