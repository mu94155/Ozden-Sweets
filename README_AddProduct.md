# إضافة منتج جديد - Add New Product

هذا الدليل يشرح كيفية استخدام نموذج إضافة منتج جديد في موقع أوزدن للحلويات.

## الملفات المطلوبة / Required Files

### HTML
- `01-Oz-addProduct.html` - نموذج إضافة المنتج الجديد

### JavaScript
- `JS/01-Oz-addProduct.js` - منطق معالجة النموذج والتحقق من البيانات

## كيفية الاستخدام / How to Use

### 1. الوصول إلى النموذج / Accessing the Form
يمكن الوصول إلى نموذج إضافة المنتج من خلال:
- لوحة الإدارة: `01-Oz-AdminPanel.html`
- الرابط المباشر: `01-Oz-addProduct.html`
- القائمة الرئيسية في الموقع

### 2. ملء البيانات المطلوبة / Required Fields

#### البيانات الأساسية / Basic Information
- **اسم المنتج** (Product Name) - مطلوب
- **معرف المنتج** (Product ID) - مطلوب ويجب أن يكون فريداً
- **السعر** (Price) - مطلوب بالدولار
- **الفئة** (Category) - اختر من القائمة المنسدلة
- **وصف المنتج** (Description) - وصف مفصل للمنتج

#### صورة المنتج / Product Image
- **صورة المنتج** (Product Image) - مطلوبة
- الملفات المدعومة: JPG, PNG, GIF
- الحد الأقصى للحجم: 5MB
- يتم عرض معاينة للصورة قبل الإرسال

#### خيارات إضافية / Additional Options
- **منتج مميز** (Featured Product) - اختياري
- **متوفر للطلب** (Available for Order) - افتراضياً مُفعّل

### 3. التحقق من البيانات / Data Validation

النموذج يتضمن التحقق التلقائي من:
- ملء جميع الحقول المطلوبة
- صحة تنسيق البريد الإلكتروني
- صحة الأرقام (السعر)
- نوع وحجم ملف الصورة
- عدم تكرار معرف المنتج

### 4. حفظ المنتج / Saving the Product

عند النقر على "إضافة المنتج":
1. يتم التحقق من صحة البيانات
2. معالجة صورة المنتج
3. حفظ البيانات في localStorage (للتجربة)
4. عرض رسالة نجاح أو خطأ
5. إعادة تعيين النموذج عند النجاح

## البيانات المحفوظة / Saved Data Structure

```javascript
{
  id: "product_id",           // معرف المنتج الفريد
  name: "اسم المنتج",          // اسم المنتج
  price: 15.99,              // السعر بالدولار
  description: "وصف المنتج",   // وصف مفصل
  category: "حلويات",         // فئة المنتج
  image: "Images/filename.jpg", // مسار الصورة
  isFeatured: false,         // منتج مميز
  isAvailable: true          // متوفر للطلب
}
```

## معالجة الصور / Image Handling

### الميزات / Features
- معاينة فورية للصورة
- التحقق من نوع الملف
- التحقق من حجم الملف
- ضغط الصورة عند الحاجة (متقدم)

### مجلد الصور / Images Folder
- مسار حفظ الصور: `Images/`
- يُنصح بتنظيم الصور في مجلدات فرعية حسب الفئة

## التخصيص والتطوير / Customization & Development

### إضافة فئات جديدة / Adding New Categories
يمكن تعديل قائمة الفئات في:
```html
<select class="form-select" id="productCategory" name="productCategory" required>
    <option value="فئة جديدة">فئة جديدة</option>
</select>
```

### تخصيص التحقق / Custom Validation
يمكن إضافة قواعد تحقق جديدة في `JS/01-Oz-addProduct.js`:
```javascript
validateProductData(productData) {
    // إضافة قواعد تحقق جديدة هنا
    return true;
}
```

### دمج مع الخادم / Server Integration
لربط النموذج بخادم حقيقي، قم بتعديل دالة `saveProduct()` في الملف JavaScript.

## استكشاف الأخطاء / Troubleshooting

### مشاكل شائعة / Common Issues

1. **الصورة لا تظهر في المعاينة**
   - تأكد من أن الملف من نوع صورة صحيح
   - تحقق من حجم الملف (< 5MB)

2. **معرف المنتج مكرر**
   - استخدم معرفاً فريداً
   - يتم التحقق من التكرار تلقائياً

3. **النموذج لا يتم إرساله**
   - تأكد من ملء جميع الحقول المطلوبة
   - تحقق من رسائل الخطأ في وحدة التحكم

## الدعم / Support

للحصول على المساعدة:
1. تحقق من رسائل الخطأ في وحدة التحكم
2. راجع هذا الدليل
3. تحقق من أن جميع الملفات موجودة في مكانها الصحيح

---

## Development Notes

### File Structure
```
Ozden-Sweets/
├── 01-Oz-addProduct.html     # Main form page
├── JS/
│   └── 01-Oz-addProduct.js   # Form logic
├── Images/                   # Product images folder
├── Styles/                   # CSS files
└── data/
    └── products.js           # Products data
```

### Dependencies
- Bootstrap 5.3.0
- Bootstrap Icons
- Google Fonts (Arabic)

### Browser Compatibility
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

### Future Enhancements
- Server-side integration
- Image upload to cloud storage
- Bulk product import
- Product categories management
- Inventory tracking
