"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context"

interface Product {
  id: string
  name: string
  name_ar: string
  category: string
  category_ar: string
  price: number
  sale_price?: number
  description: string
  description_ar: string
  image_url: string
  gallery_images?: string[]
  materials: string[]
  badge?: string
  inStock: boolean
  isOffer: boolean
  lowStockLeft?: number
}

export default function ProductPage() {
  const params = useParams()
  const { language } = useLanguage()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!params?.id) {
          console.error("No product ID provided")
          return
        }

        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch product")
        const data = await response.json()

        setProduct(data)
      } catch (error) {
        console.error("Error loading product:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [params?.id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{language === "ar" ? "جاري التحميل..." : "Loading..."}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {language === "ar" ? "المنتج غير موجود" : "Product not found"}
          </h1>
          <p className="text-gray-600">
            {language === "ar" ? "لم يتم العثور على المنتج المطلوب" : "The requested product could not be found"}
          </p>
        </div>
      </div>
    )
  }

  const images = product.gallery_images && product.gallery_images.length > 0 
    ? product.gallery_images 
    : [product.image_url]

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const currentPrice = product.sale_price || product.price
  const originalPrice = product.sale_price ? product.price : null
  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <Image
                src={images[selectedImage]}
                alt={language === "ar" ? product.name_ar : product.name}
                fill
                className="object-cover"
                priority
              />
              {product.badge && (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                  {product.badge}
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge className="absolute top-4 right-4 bg-green-600 hover:bg-green-700">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? "border-blue-500 ring-2 ring-blue-200" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {language === "ar" ? product.name_ar : product.name}
              </h1>
              <p className="text-lg text-gray-600">
                {language === "ar" ? product.category_ar : product.category}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ${currentPrice.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <Badge variant="outline" className="text-green-700 border-green-700">
                  {language === "ar" ? "متوفر" : "In Stock"}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-700 border-red-700">
                  {language === "ar" ? "غير متوفر" : "Out of Stock"}
                </Badge>
              )}
              {product.lowStockLeft && product.lowStockLeft <= 5 && (
                <span className="text-sm text-orange-600">
                  {language === "ar" 
                    ? `فقط ${product.lowStockLeft} قطع متبقية`
                    : `Only ${product.lowStockLeft} left in stock`
                  }
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {language === "ar" ? "الوصف" : "Description"}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {language === "ar" ? product.description_ar : product.description}
              </p>
            </div>

            {/* Materials */}
            {product.materials && product.materials.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {language === "ar" ? "المواد" : "Materials"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material, index) => (
                    <Badge key={index} variant="secondary">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">
                  {language === "ar" ? "الكمية:" : "Quantity:"}
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {language === "ar" ? "أضف إلى السلة" : "Add to Cart"}
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="w-5 h-5" />
                <span>{language === "ar" ? "شحن مجاني للطلبات فوق $50" : "Free shipping on orders over $50"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-5 h-5" />
                <span>{language === "ar" ? "ضمان الجودة" : "Quality guarantee"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RotateCcw className="w-5 h-5" />
                <span>{language === "ar" ? "إرجاع مجاني خلال 30 يوم" : "30-day free returns"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
