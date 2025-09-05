"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const translations = {
  en: {
    // Header
    "header.home": "Home",
    "header.products": "Products",
    "header.cart": "Cart",
    "header.language": "عربي",

    // Hero Section
    "hero.title1": "Almajd Turkey Clothes",
    "hero.subtitle": "Premium Turkish Fashion For All.",
    "hero.freeShipping": "Free shipping",
    "hero.fastDelivery": "Fast delivery",
    "hero.qualityGuarantee": "Quality guarantee",
  // Location
  "location.address": "Billin - Main Street - Saffa's Road",
  "location.directions": "Click here for directions to our store",

    // Categories
    "categories.title": "Shop by Category",
    "categories.subtitle": "Discover our premium Turkish fashion collections for the whole family",
    "categories.clearFilters": "Clear Filters",
    "categories.men": "Men",
    "categories.women": "Women",
    "categories.boys": "Boys",
    "categories.girls": "Girls",
    "categories.subcategories": "subcategories",

    // Subcategories
    "subcategories.pants": "Pants",
    "subcategories.summerShirts": "Summer Shirts",
    "subcategories.winterShirts": "Winter Shirts",
    "subcategories.jackets": "Jackets",
    "subcategories.boots": "Boots",
    "subcategories.underwear": "Underwear",
    "subcategories.hats": "Hats",
    "subcategories.slippers": "Slippers",
    "subcategories.dress": "Dress",
    "subcategories.abaya": "Abaya",
    "subcategories.pajamaSets": "Pajama Sets",

    // Products
    "products.title": "Our Collection",
    "products.subtitle":
      "Discover premium Turkish fashion for the whole family. Quality craftsmanship meets modern style.",
    "products.featured": "Featured Fashion",
    "products.featuredSubtitle":
      "Discover our most popular Turkish fashion pieces, each crafted with premium materials and attention to detail for the whole family.",
    "products.noProducts": "No products found in this category.",
    "products.size": "Size",
    "products.color": "Color",
    "products.quantity": "Quantity",
    "products.addToCart": "Add to Cart",
    "products.outOfStock": "Out of Stock",
    "products.quickShop": "Quick Shop",
    "products.getNow": "Get Now",
    "products.viewDetails": "View Details",
    "products.selectSize": "Select Size",
    "products.selectColor": "Select Color",
    "products.inStock": "In Stock",
    "products.lowStock": "Low Stock",
    "products.description": "Description",
    "products.selectSizeAndColor": "Please select size and color",

    // Cart
    "cart.title": "Shopping Cart",
    "cart.empty": "Your cart is empty",
    "cart.emptySubtitle": "Add some items to get started",
    "cart.total": "Total",
    "cart.checkout": "Proceed to Checkout",
    "cart.quantity": "Qty:",
    "cart.remove": "Remove",
    "cart.update": "Update",
    "cart.subtotal": "Subtotal",
    "cart.tax": "Tax",
    "cart.shipping": "Shipping",
    "cart.free": "Free",

    // Checkout
    "checkout.title": "Checkout",
    "checkout.orderSummary": "Order Summary",
    "checkout.deliveryInfo": "Delivery Information",
    "checkout.freeDelivery": "Free delivery on all orders",
    "checkout.cashOnDelivery": "Cash on delivery available",
    "checkout.qualityGuarantee": "Quality guarantee",
    "checkout.deliveryDetails": "Delivery Details",
    "checkout.fullName": "Full Name",
    "checkout.phoneNumber": "Phone Number",
    "checkout.deliveryAddress": "Delivery Address",
    "checkout.city": "City",
    "checkout.orderNotes": "Order Notes (Optional)",
    "checkout.orderNotesPlaceholder": "Any special instructions for your order",
    "checkout.placeOrder": "Place Order",
    "checkout.placingOrder": "Placing Order...",
    "checkout.orderSuccess": "Order Placed Successfully!",
    "checkout.orderSuccessMessage":
      "Thank you for your order. We'll contact you soon to confirm the details and arrange delivery.",
    "checkout.continueShopping": "Continue Shopping",
    "checkout.cartEmpty": "Your cart is empty",
    "checkout.cartEmptyMessage": "Add some items to your cart before checking out.",
    "checkout.browseProducts": "Browse Products",

  // Shipping
  "shipping.method": "Shipping Method",
  "shipping.selectMethod": "Select your preferred shipping method",
  "shipping.pickup": "Store Pickup (Free)",
  "shipping.pickupDescription": "Collect your order directly from our store. No address needed.",
  "shipping.village": "Local Village Delivery (₪5)",
  "shipping.villageDescription": "Delivery to your village area.",
  "shipping.westbank": "West Bank Delivery (₪20)",
  "shipping.westbankDescription": "Standard delivery across the West Bank region.",
  "shipping.jerusalem": "Jerusalem Delivery (₪30)",
  "shipping.jerusalemDescription": "Secure delivery service within Jerusalem.",
  "shipping.occupied": "Interior Lands Delivery (₪70)",
  "shipping.occupiedDescription": "Extended delivery service to الداخل (Interior Lands).",
  "shipping.fee": "Shipping Fee",
  "shipping.total": "Order Total",
  "shipping.subtotal": "Subtotal",
  "shipping.free": "Free",

    // Footer
    "footer.categories": "Categories",
    "footer.company": "Company",
    "footer.about": "About",
    "footer.contact": "Contact",
    "footer.pages": "Pages",
    "footer.copyright": "© 2024 Almajd Turkey Clothes. All rights reserved.",
    "footer.description": "Premium Turkish fashion for the whole family. Quality craftsmanship meets modern style.",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.back": "Back",
    "common.close": "Close",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.add": "Add",
    "common.required": "Required",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.price": "Price",
    "common.name": "Name",
    "common.newest": "Newest",
    "common.oldest": "Oldest",
    "common.lowToHigh": "Price: Low to High",
    "common.highToLow": "Price: High to Low",

    // Today's Offers
    todaysOffers: "Today's Offers",
    todaysOffersDescription:
      "Don't miss out on these amazing deals! Limited time offers on our premium Turkish fashion collection.",
    specialOffer: "Special Offer",
    sale: "Sale",
    discount: "Discount",
    limitedTime: "Limited Time",

    // Newsletter/Discover Section
    "discover.title": "Discover Turkish Elegance",
    "discover.subtitle": "Shop our premium collection of high-quality Turkish fashion for the whole family",
    "discover.description":
      "Experience the finest in Turkish fashion craftsmanship with our carefully curated collection of premium clothing for men, women, and children.",

    // Footer Company Description
    "footer.companyDescription":
      "Premium Turkish fashion for the whole family. We create timeless clothing pieces with quality craftsmanship, modern designs, and traditional Turkish elegance for every occasion.",
    "footer.socialMedia": "Follow us on social media",
    "footer.instagram": "Instagram",
    "footer.twitter": "Twitter",
    "footer.facebook": "Facebook",
  "footer.designedBy": "Created & designed by",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.termsOfService": "Terms of Service",
    "footer.cookies": "Cookies",
    "footer.allRightsReserved": "All rights reserved",

    // Product Names (Dynamic translations)
    "product.classicTurkishChinos": "Classic Turkish Chinos",
    "product.cottonPoloShirt": "Cotton Polo Shirt",
    "product.traditionalBlackAbaya": "Traditional Black Abaya",
    "product.silkEveningDress": "Silk Evening Dress",
    "product.premiumWoolJacket": "Premium Wool Jacket",
    "product.casualSummerShirt": "Casual Summer Shirt",
    "product.leatherBoots": "Leather Boots",
    "product.comfortableSlippers": "Comfortable Slippers",

    // Product Descriptions
    "product.description.premium": "Premium quality Turkish cotton with modern design",
    "product.description.comfortable": "Comfortable and stylish for everyday wear",
    "product.description.elegant": "Elegant design perfect for special occasions",
    "product.description.traditional": "Traditional Turkish craftsmanship meets modern style",
    "product.description.durable": "Durable materials with attention to detail",

    // Collections
    "collections.title": "Collections",
    "collections.subtitle":
      "Explore our curated fashion collections, each telling a unique story of Turkish craftsmanship and modern style philosophy.",
    "collections.menCollection": "Men's Collection",
    "collections.womenCollection": "Women's Collection",
    "collections.kidsCollection": "Kids Collection",
    "collections.premiumCollection": "Premium Collection",
    "collections.casualCollection": "Casual Collection",
    "collections.formalCollection": "Formal Collection",
    "collections.traditionalCollection": "Traditional Collection",
    "collections.summerCollection": "Summer Collection",
    "collections.winterCollection": "Winter Collection",
    "collections.footwearCollection": "Footwear Collection",
    "collections.pieces": "pieces",
    "collections.dragToExplore": "Drag to explore collections",

  // Admin (Dashboard)
  "admin.title": "Admin Dashboard",
  "admin.backToStore": "Back to Store",
  "admin.logout": "Logout",
  "admin.nav.overview": "Overview",
  "admin.nav.products": "Products",
  "admin.nav.outOfStock": "Out of Stock",
  "admin.nav.orders": "Orders",
  "admin.nav.offers": "Today's Offers",
  "admin.nav.gallery": "Gallery",
  "admin.stats.totalProducts": "Total Products",
  "admin.stats.totalOrders": "Total Orders",
  "admin.stats.pendingOrders": "Pending Orders",
  "admin.stats.totalRevenue": "Total Revenue",
  "admin.recentOrders": "Recent Orders",
  "admin.products.management": "Products Management",
  "admin.products.add": "Add Product",
  "admin.products.edit": "Edit Product",
  "admin.products.addNew": "Add New Product",
  "admin.products.name": "Product Name",
  "admin.products.price": "Price (₪)",
  "admin.products.originalPrice": "Original Price (₪)",
  "admin.products.stockQuantity": "Stock Quantity",
  "admin.products.category": "Category",
  "admin.products.subcategory": "Subcategory",
  "admin.products.selectSubcategory": "Select subcategory",
  "admin.products.description": "Description",
  "admin.products.images": "Product Images",
  "admin.products.uploadImages": "Upload Images",
  "admin.products.availableSizes": "Available Sizes",
  "admin.products.availableColors": "Available Colors",
  "admin.products.featured": "Featured Product",
  "admin.products.todaysOffer": "Today's Offer",
  "admin.products.markAsLeft": "Mark as X left",
  "admin.products.pcsLeft": "pcs left (label only)",
  "admin.products.clothingSizes": "Clothing Sizes (XS-6XL)",
  "admin.products.numericSizes": "Numeric Sizes (20-50)",
  "admin.products.update": "Update Product",
  "admin.products.cancel": "Cancel",
  "admin.products.imagesSelected": "images selected",
  "admin.gallery.updateItem": "Update Gallery Item",
  "admin.gallery.add": "Add",
  "admin.gallery.update": "Update",
  "admin.orders.management": "Orders Management",
  "admin.orders.refresh": "Refresh Orders",
  "admin.orders.viewDelivered": "View Delivered Orders",
  "admin.orders.nonePending": "No pending orders found",
  "admin.orders.nonePendingSubtitle": "Orders will appear here when customers make purchases",
  "admin.orders.customerInfo": "Customer Information",
  "admin.orders.orderDetails": "Order Details",
  "admin.orders.totalAmount": "Total Amount",
  "admin.orders.size": "Size",
  "admin.orders.color": "Color",
  "admin.orders.qty": "Qty",
  "admin.orders.unitPrice": "Unit Price",
  "admin.orders.productId": "Product ID",
  "admin.orders.subtotal": "Subtotal",
  "admin.orders.items": "Ordered Products",
  "admin.orders.orderTotal": "Order Total",
  "admin.offers.management": "Today's Offers Management",
  "admin.offers.selectProducts": "Select products for today's offers:",
  "admin.delivered.title": "Delivered Orders & Profit Analysis",
  "admin.delivered.back": "Back to Active Orders",
  "admin.delivered.orders": "Delivered Orders",
  "admin.delivered.revenue": "Total Revenue",
  "admin.delivered.estimatedProfit": "Estimated Profit (70%)",
  "admin.delivered.none": "No delivered orders yet",
  "admin.delivered.noneSubtitle": "Completed orders will appear here for profit analysis",
  "admin.gallery.management": "Gallery Management",
  "admin.gallery.addItem": "Add Gallery Item",
  "admin.gallery.editItem": "Edit Gallery Item",
  "admin.gallery.order": "Order",
  "admin.gallery.active": "Active",
  "admin.gallery.inactive": "Inactive",
  "admin.gallery.titleEn": "Title (English)",
  "admin.gallery.titleAr": "Title (Arabic)",
  "admin.gallery.image": "Image",
  "admin.status.pending": "Pending",
  "admin.status.confirmed": "Confirmed",
  "admin.status.shipped": "Shipped",
  "admin.status.delivered": "Delivered",
  "admin.deleteProduct.title": "Delete Product",
  "admin.deleteProduct.confirm": "Are you sure you want to delete",
  "admin.deleteProduct.irreversible": "This action cannot be undone.",
  "admin.deleteProduct.deleting": "Deleting...",
  "admin.deleteProduct.delete": "Delete",
  "admin.deleteProduct.cancel": "Cancel",
  // Color names
  "color.Black": "Black",
  "color.White": "White",
  "color.Navy Blue": "Navy Blue",
  "color.Light Blue": "Light Blue",
  "color.Red": "Red",
  "color.Burgundy": "Burgundy",
  "color.Pink": "Pink",
  "color.Rose": "Rose",
  "color.Green": "Green",
  "color.Lime": "Lime",
  "color.Yellow": "Yellow",
  "color.Orange": "Orange",
  "color.Purple": "Purple",
  "color.Violet": "Violet",
  "color.Gray": "Gray",
  "color.Charcoal": "Charcoal",
  "color.Brown": "Brown",
  "color.Tan": "Tan",
  "color.Beige": "Beige",
  "color.Cream": "Cream",
  "color.Olive": "Olive",
  "color.Maroon": "Maroon",
  "color.Gold": "Gold",
  "color.Silver": "Silver",
  "color.Coral": "Coral",
  "color.Lavender": "Lavender",
  "color.Mint Green": "Mint Green",
  "color.Rust": "Rust",
  "color.Taupe": "Taupe",
  },
  ar: {
    // Header
    "header.home": "الرئيسية",
    "header.products": "المنتجات",
    "header.cart": "السلة",
    "header.language": "English",

    // Hero Section
    "hero.title1": "المجد للألبسة التركية",
    "hero.subtitle": "أزياء تركية راقية للجميع",
    "hero.freeShipping": "شحن مجاني",
    "hero.fastDelivery": "توصيل سريع",
    "hero.qualityGuarantee": "ضمان الجودة",
  // Location
  "location.address": "بلعين - الشارع الرئيسي - طريق صفا",
  "location.directions": "اضغط هنا للحصول على الاتجاهات إلى متجرنا",

    // Categories
    "categories.title": "تسوق حسب الفئة",
    "categories.subtitle": "اكتشف مجموعات الأزياء التركية الراقية لجميع أفراد العائلة",
    "categories.clearFilters": "مسح الفلاتر",
    "categories.men": "رجال",
    "categories.women": "نساء",
    "categories.boys": "أولاد",
    "categories.girls": "بنات",
    "categories.subcategories": "فئات فرعية",

    // Subcategories
    "subcategories.pants": "بناطيل",
    "subcategories.summerShirts": "قمصان صيفية",
    "subcategories.winterShirts": "قمصان شتوية",
    "subcategories.jackets": "جاكيتات",
    "subcategories.boots": "أحذية",
    "subcategories.underwear": "ملابس داخلية",
    "subcategories.hats": "قبعات",
    "subcategories.slippers": "شباشب",
    "subcategories.dress": "فساتين",
    "subcategories.abaya": "عباءات",
    "subcategories.pajamaSets": "بيجامات",

    // Products
    "products.title": "مجموعتنا",
    "products.subtitle":
      "اكتشف الأزياء التركية الراقية لجميع أفراد العائلة. الحرفية عالية الجودة تلتقي بالأسلوب العصري.",
    "products.featured": "الأزياء المميزة",
    "products.featuredSubtitle":
      "اكتشف قطع الأزياء التركية الأكثر شعبية، كل قطعة مصنوعة بمواد عالية الجودة واهتمام بالتفاصيل لجميع أفراد العائلة.",
    "products.noProducts": "لم يتم العثور على منتجات في هذه الفئة.",
    "products.size": "المقاس",
    "products.color": "اللون",
    "products.quantity": "الكمية",
    "products.addToCart": "أضف للسلة",
    "products.outOfStock": "نفد المخزون",
    "products.quickShop": "تسوق سريع",
    "products.getNow": "احصل عليه الآن",
    "products.viewDetails": "عرض التفاصيل",
    "products.selectSize": "اختر المقاس",
    "products.selectColor": "اختر اللون",
    "products.inStock": "متوفر",
    "products.lowStock": "كمية محدودة",
    "products.description": "الوصف",
    "products.selectSizeAndColor": "يرجى اختيار المقاس واللون",

    // Cart
    "cart.title": "سلة التسوق",
    "cart.empty": "سلتك فارغة",
    "cart.emptySubtitle": "أضف بعض العناصر للبدء",
    "cart.total": "المجموع",
    "cart.checkout": "متابعة الدفع",
    "cart.quantity": "الكمية:",
    "cart.remove": "إزالة",
    "cart.update": "تحديث",
    "cart.subtotal": "المجموع الفرعي",
    "cart.tax": "الضريبة",
    "cart.shipping": "الشحن",
    "cart.free": "مجاني",

    // Checkout
    "checkout.title": "الدفع",
    "checkout.orderSummary": "ملخص الطلب",
    "checkout.deliveryInfo": "معلومات التوصيل",
    "checkout.freeDelivery": "توصيل مجاني على جميع الطلبات",
    "checkout.cashOnDelivery": "الدفع عند الاستلام متاح",
    "checkout.qualityGuarantee": "ضمان الجودة",
    "checkout.deliveryDetails": "تفاصيل التوصيل",
    "checkout.fullName": "الاسم الكامل",
    "checkout.phoneNumber": "رقم الهاتف",
    "checkout.deliveryAddress": "عنوان التوصيل",
    "checkout.city": "المدينة",
    "checkout.orderNotes": "ملاحظات الطلب (اختياري)",
    "checkout.orderNotesPlaceholder": "أي تعليمات خاصة لطلبك",
    "checkout.placeOrder": "تأكيد الطلب",
    "checkout.placingOrder": "جاري تأكيد الطلب...",
    "checkout.orderSuccess": "تم تأكيد الطلب بنجاح!",
    "checkout.orderSuccessMessage": "شكراً لك على طلبك. سنتواصل معك قريباً لتأكيد التفاصيل وترتيب التوصيل.",
    "checkout.continueShopping": "متابعة التسوق",
    "checkout.cartEmpty": "سلتك فارغة",
    "checkout.cartEmptyMessage": "أضف بعض العناصر إلى سلتك قبل الدفع.",
    "checkout.browseProducts": "تصفح المنتجات",

  // Shipping
  "shipping.method": "طريقة الشحن",
  "shipping.selectMethod": "اختر طريقة الشحن المناسبة",
  "shipping.pickup": "استلام من المتجر (مجاني)",
  "shipping.pickupDescription": "يمكنك استلام طلبك مباشرة من المتجر بدون الحاجة لعنوان.",
  "shipping.village": "توصيل القرية (₪5)",
  "shipping.villageDescription": "توصيل إلى منطقتك داخل القرية.",
  "shipping.westbank": "توصيل الضفة الغربية (₪20)",
  "shipping.westbankDescription": "توصيل قياسي إلى جميع مناطق الضفة الغربية.",
  "shipping.jerusalem": "توصيل القدس (₪30)",
  "shipping.jerusalemDescription": "خدمة توصيل آمنة داخل مدينة القدس.",
  "shipping.occupied": "توصيل الداخل (₪70)",
  "shipping.occupiedDescription": "خدمة توصيل موسعة إلى الداخل (أراضي 48).",
  "shipping.fee": "رسوم الشحن",
  "shipping.total": "إجمالي الطلب",
  "shipping.subtotal": "المجموع الفرعي",
  "shipping.free": "مجاني",

    // Footer
    "footer.categories": "الفئات",
    "footer.company": "الشركة",
    "footer.about": "من نحن",
    "footer.contact": "اتصل بنا",
    "footer.pages": "الصفحات",
    "footer.copyright": "© ٢٠٢٤ المجد للألبسة التركية. جميع الحقوق محفوظة.",
    "footer.description": "أزياء تركية راقية لجميع أفراد العائلة. الحرفية عالية الجودة تلتقي بالأسلوب العصري.",

    // Common
    "common.loading": "جاري التحميل...",
    "common.error": "خطأ",
    "common.back": "رجوع",
    "common.close": "إغلاق",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.delete": "حذف",
    "common.edit": "تعديل",
    "common.add": "إضافة",
    "common.required": "مطلوب",
    "common.search": "بحث",
    "common.filter": "فلتر",
    "common.sort": "ترتيب",
    "common.price": "السعر",
    "common.name": "الاسم",
    "common.newest": "الأحدث",
    "common.oldest": "الأقدم",
    "common.lowToHigh": "السعر: من الأقل للأعلى",
    "common.highToLow": "السعر: من الأعلى للأقل",

    // Today's Offers
    todaysOffers: "عروض اليوم",
    todaysOffersDescription: "لا تفوت هذه العروض المذهلة! عروض محدودة الوقت على مجموعة الأزياء التركية الراقية.",
    specialOffer: "عرض خاص",
    sale: "تخفيض",
    discount: "خصم",
    limitedTime: "وقت محدود",

    // Newsletter/Discover Section
    "discover.title": "اكتشف الأناقة التركية",
    "discover.subtitle": "تسوق مجموعتنا المتميزة من الأزياء التركية عالية الجودة لجميع أفراد العائلة",
    "discover.description":
      "اختبر الأفضل في حرفية الأزياء التركية مع مجموعتنا المنتقاة بعناية من الملابس الراقية للرجال والنساء والأطفال.",

    // Footer Company Description
    "footer.companyDescription":
      "أزياء تركية راقية لجميع أفراد العائلة. نصنع قطع ملابس خالدة بحرفية عالية الجودة وتصاميم عصرية وأناقة تركية تقليدية لكل مناسبة.",
    "footer.socialMedia": "تابعنا على وسائل التواصل الاجتماعي",
    "footer.instagram": "إنستغرام",
    "footer.twitter": "تويتر",
    "footer.facebook": "فيسبوك",
  "footer.designedBy": "تم الإنشاء والتصميم بواسطة",
    "footer.privacyPolicy": "سياسة الخصوصية",
    "footer.termsOfService": "شروط الخدمة",
    "footer.cookies": "ملفات تعريف الارتباط",
    "footer.allRightsReserved": "جميع الحقوق محفوظة",

    // Product Names (Dynamic translations)
    "product.classicTurkishChinos": "بنطال تشينو تركي كلاسيكي",
    "product.cottonPoloShirt": "قميص بولو قطني",
    "product.traditionalBlackAbaya": "عباءة سوداء تقليدية",
    "product.silkEveningDress": "فستان سهرة حريري",
    "product.premiumWoolJacket": "جاكيت صوف راقي",
    "product.casualSummerShirt": "قميص صيفي كاجوال",
    "product.leatherBoots": "أحذية جلدية",
    "product.comfortableSlippers": "شباشب مريحة",

    // Product Descriptions
    "product.description.premium": "قطن تركي عالي الجودة بتصميم عصري",
    "product.description.comfortable": "مريح وأنيق للارتداء اليومي",
    "product.description.elegant": "تصميم أنيق مثالي للمناسبات الخاصة",
    "product.description.traditional": "الحرفية التركية التقليدية تلتقي بالأسلوب العصري",
    "product.description.durable": "مواد متينة مع الاهتمام بالتفاصيل",

    // Collections
    "collections.title": "المجموعات",
    "collections.subtitle":
      "استكشف مجموعات الأزياء المنتقاة بعناية، كل منها تحكي قصة فريدة من الحرفية التركية وفلسفة الأسلوب العصري.",
    "collections.menCollection": "مجموعة الرجال",
    "collections.womenCollection": "مجموعة النساء",
    "collections.kidsCollection": "مجموعة الأطفال",
    "collections.premiumCollection": "المجموعة الراقية",
    "collections.casualCollection": "المجموعة الكاجوال",
    "collections.formalCollection": "المجموعة الرسمية",
    "collections.traditionalCollection": "المجموعة التقليدية",
    "collections.summerCollection": "المجموعة الصيفية",
    "collections.winterCollection": "المجموعة الشتوية",
    "collections.footwearCollection": "مجموعة الأحذية",
    "collections.pieces": "قطعة",
    "collections.dragToExplore": "اسحب لاستكشاف المجموعات",

  // Admin (Dashboard)
  "admin.title": "لوحة التحكم",
  "admin.backToStore": "العودة للمتجر",
  "admin.logout": "تسجيل الخروج",
  "admin.nav.overview": "نظرة عامة",
  "admin.nav.products": "المنتجات",
  "admin.nav.outOfStock": "نفذ من المخزون",
  "admin.nav.orders": "الطلبات",
  "admin.nav.offers": "عروض اليوم",
  "admin.nav.gallery": "المعرض",
  "admin.stats.totalProducts": "إجمالي المنتجات",
  "admin.stats.totalOrders": "إجمالي الطلبات",
  "admin.stats.pendingOrders": "الطلبات المعلقة",
  "admin.stats.totalRevenue": "إجمالي الإيرادات",
  "admin.recentOrders": "أحدث الطلبات",
  "admin.products.management": "إدارة المنتجات",
  "admin.products.add": "إضافة منتج",
  "admin.products.edit": "تعديل المنتج",
  "admin.products.addNew": "إضافة منتج جديد",
  "admin.products.name": "اسم المنتج",
  "admin.products.price": "السعر (₪)",
  "admin.products.originalPrice": "السعر الأصلي (₪)",
  "admin.products.stockQuantity": "الكمية في المخزون",
  "admin.products.category": "الفئة",
  "admin.products.subcategory": "الفئة الفرعية",
  "admin.products.selectSubcategory": "اختر فئة فرعية",
  "admin.products.description": "الوصف",
  "admin.products.images": "صور المنتج",
  "admin.products.uploadImages": "رفع الصور",
  "admin.products.availableSizes": "المقاسات المتاحة",
  "admin.products.availableColors": "الألوان المتاحة",
  "admin.products.featured": "منتج مميز",
  "admin.products.todaysOffer": "عرض اليوم",
  "admin.products.markAsLeft": "تحديد عدد متبقٍ",
  "admin.products.pcsLeft": "قطعة متبقية (وسم فقط)",
  "admin.products.clothingSizes": "مقاسات الملابس (XS-6XL)",
  "admin.products.numericSizes": "المقاسات الرقمية (20-50)",
  "admin.products.update": "تحديث المنتج",
  "admin.products.cancel": "إلغاء",
  "admin.products.imagesSelected": "صورة تم اختيارها",
  "admin.gallery.updateItem": "تحديث عنصر المعرض",
  "admin.gallery.add": "إضافة",
  "admin.gallery.update": "تحديث",
  "admin.orders.management": "إدارة الطلبات",
  "admin.orders.refresh": "تحديث الطلبات",
  "admin.orders.viewDelivered": "عرض الطلبات المُسلمة",
  "admin.orders.nonePending": "لا توجد طلبات معلقة",
  "admin.orders.nonePendingSubtitle": "ستظهر الطلبات هنا عند قيام العملاء بالشراء",
  "admin.orders.customerInfo": "معلومات العميل",
  "admin.orders.orderDetails": "تفاصيل الطلب",
  "admin.orders.totalAmount": "إجمالي المبلغ",
  "admin.orders.size": "المقاس",
  "admin.orders.color": "اللون",
  "admin.orders.qty": "الكمية",
  "admin.orders.unitPrice": "سعر الوحدة",
  "admin.orders.productId": "معرف المنتج",
  "admin.orders.subtotal": "المجموع الفرعي",
  "admin.orders.items": "المنتجات المطلوبة",
  "admin.orders.orderTotal": "إجمالي الطلب",
  "admin.offers.management": "إدارة عروض اليوم",
  "admin.offers.selectProducts": "اختر منتجات لعروض اليوم:",
  "admin.delivered.title": "الطلبات المسلمة وتحليل الأرباح",
  "admin.delivered.back": "العودة للطلبات النشطة",
  "admin.delivered.orders": "الطلبات المسلمة",
  "admin.delivered.revenue": "إجمالي الإيرادات",
  "admin.delivered.estimatedProfit": "الربح التقديري (70%)",
  "admin.delivered.none": "لا توجد طلبات مسلمة بعد",
  "admin.delivered.noneSubtitle": "ستظهر الطلبات المكتملة هنا لتحليل الأرباح",
  "admin.gallery.management": "إدارة المعرض",
  "admin.gallery.addItem": "إضافة عنصر للمعرض",
  "admin.gallery.editItem": "تعديل عنصر المعرض",
  "admin.gallery.order": "الترتيب",
  "admin.gallery.active": "نشط",
  "admin.gallery.inactive": "غير نشط",
  "admin.gallery.titleEn": "العنوان (إنجليزي)",
  "admin.gallery.titleAr": "العنوان (عربي)",
  "admin.gallery.image": "الصورة",
  "admin.status.pending": "معلق",
  "admin.status.confirmed": "مؤكد",
  "admin.status.shipped": "قيد الشحن",
  "admin.status.delivered": "مُسلم",
  "admin.deleteProduct.title": "حذف المنتج",
  "admin.deleteProduct.confirm": "هل أنت متأكد أنك تريد حذف",
  "admin.deleteProduct.irreversible": "لا يمكن التراجع عن هذا الإجراء.",
  "admin.deleteProduct.deleting": "جارٍ الحذف...",
  "admin.deleteProduct.delete": "حذف",
  "admin.deleteProduct.cancel": "إلغاء",
  // Color names
  "color.Black": "أسود",
  "color.White": "أبيض",
  "color.Navy Blue": "كحلي",
  "color.Light Blue": "أزرق فاتح",
  "color.Red": "أحمر",
  "color.Burgundy": "خمري",
  "color.Pink": "زهري",
  "color.Rose": "وردي",
  "color.Green": "أخضر",
  "color.Lime": "ليموني",
  "color.Yellow": "أصفر",
  "color.Orange": "برتقالي",
  "color.Purple": "أرجواني",
  "color.Violet": "بنفسجي",
  "color.Gray": "رمادي",
  "color.Charcoal": "فحمي",
  "color.Brown": "بني",
  "color.Tan": "أسمر فاتح",
  "color.Beige": "بيج",
  "color.Cream": "كريمي",
  "color.Olive": "زيتي",
  "color.Maroon": "ماروني",
  "color.Gold": "ذهبي",
  "color.Silver": "فضي",
  "color.Coral": "مرجاني",
  "color.Lavender": "لافندر",
  "color.Mint Green": "أخضر نعناعي",
  "color.Rust": "صدئ",
  "color.Taupe": "تاوبي",
  },
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Save language to localStorage and update document direction
    localStorage.setItem("language", language)
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = language

    if (language === "ar") {
      document.body.classList.add("arabic-text")
    } else {
      document.body.classList.remove("arabic-text")
    }
  }, [language])

  const t = (key: string): string => {
    const packs = translations as any
    const langPack = packs[language] as Record<string, string>
    return (langPack && langPack[key]) || key
  }

  const isRTL = language === "ar"

  return <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Graceful fallback to default English behavior to prevent runtime crashes
    return {
      language: "en" as const,
      setLanguage: () => {},
      t: (key: string) => (translations as any).en[key] || key,
      isRTL: false,
    }
  }
  return context
}
