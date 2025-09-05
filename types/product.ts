export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  badge?: "New" | "Popular" | "Limited" | "Sale"
  materials: string[]
  description: string
  category: "men" | "women" | "boys" | "girls"
  subcategory: string
  sizes: string[]
  colors: { name: string; color: string; image?: string }[]
  inStock: boolean
  isOffer?: boolean
  /** Current stock quantity (automatically decreases with purchases) */
  stockQuantity: number
  /** Optional label-only remaining stock number (does NOT auto-decrease) */
  lowStockLeft?: number
}

export interface CartItem {
  product: Product
  size: string
  color: string
  quantity: number
}

export const CATEGORIES = {
  men: {
    name: "Men",
    nameAr: "رجال",
    subcategories: [
      { id: "pants", name: "Pants", nameAr: "بناطيل" },
      { id: "summer-shirts", name: "Summer Shirts", nameAr: "قمصان صيفية" },
      { id: "winter-shirts", name: "Winter Shirts", nameAr: "قمصان شتوية" },
      { id: "jackets", name: "Jackets", nameAr: "جاكيتات" },
      { id: "boots", name: "Boots", nameAr: "أحذية" },
      { id: "underwear", name: "Underwear", nameAr: "ملابس داخلية" },
      { id: "hats", name: "Hats", nameAr: "قبعات" },
      { id: "slippers", name: "Slippers", nameAr: "شباشب" },
      { id: "pajama-sets", name: "Pajama Sets", nameAr: "بيجامات" },
    ],
  },
  women: {
    name: "Women",
    nameAr: "نساء",
    subcategories: [
      { id: "dress", name: "Dress", nameAr: "فساتين" },
      { id: "abaya", name: "Abaya", nameAr: "عباءة" },
      { id: "pants", name: "Pants", nameAr: "بناطيل" },
      { id: "summer-shirts", name: "Summer Shirts", nameAr: "قمصان صيفية" },
      { id: "winter-shirts", name: "Winter Shirts", nameAr: "قمصان شتوية" },
      { id: "jackets", name: "Jackets", nameAr: "جاكيتات" },
      { id: "boots", name: "Boots", nameAr: "أحذية" },
      { id: "slippers", name: "Slippers", nameAr: "شباشب" },
      { id: "pajama-sets", name: "Pajama Sets", nameAr: "بيجامات" },
    ],
  },
  boys: {
    name: "Boys",
    nameAr: "أولاد",
    subcategories: [
      { id: "pants", name: "Pants", nameAr: "بناطيل" },
      { id: "summer-shirts", name: "Summer Shirts", nameAr: "قمصان صيفية" },
      { id: "winter-shirts", name: "Winter Shirts", nameAr: "قمصان شتوية" },
      { id: "jackets", name: "Jackets", nameAr: "جاكيتات" },
      { id: "boots", name: "Boots", nameAr: "أحذية" },
      { id: "underwear", name: "Underwear", nameAr: "ملابس داخلية" },
      { id: "hats", name: "Hats", nameAr: "قبعات" },
      { id: "slippers", name: "Slippers", nameAr: "شباشب" },
      { id: "pajama-sets", name: "Pajama Sets", nameAr: "بيجامات" },
    ],
  },
  girls: {
    name: "Girls",
    nameAr: "بنات",
    subcategories: [
      { id: "dress", name: "Dress", nameAr: "فساتين" },
      { id: "pants", name: "Pants", nameAr: "بناطيل" },
      { id: "summer-shirts", name: "Summer Shirts", nameAr: "قمصان صيفية" },
      { id: "winter-shirts", name: "Winter Shirts", nameAr: "قمصان شتوية" },
      { id: "jackets", name: "Jackets", nameAr: "جاكيتات" },
      { id: "boots", name: "Boots", nameAr: "أحذية" },
      { id: "slippers", name: "Slippers", nameAr: "شباشب" },
      { id: "pajama-sets", name: "Pajama Sets", nameAr: "بيجامات" },
    ],
  },
} as const
