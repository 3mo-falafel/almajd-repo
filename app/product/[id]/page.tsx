// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Plus, Minus, ShoppingCart, Heart, Share2, Star, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem, openCart } = useCart()
  const { t, isRTL } = useLanguage()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    loadProduct()
  }, [params.id])

  const loadProduct = async () => {
    try {
      const productId = params.id as string

      const response = await fetch(`/api/products/${productId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          console.error("Product not found:", productId)
          setProduct(null)
          setLoading(false)
          return
        }
        throw new Error('Failed to fetch product')
      }

      const data = await response.json()
      setProduct(data)
      setSelectedSize(data.sizes?.[0] || "")
      setSelectedColor(data.colors?.[0]?.name || "")
    } catch (error) {
      console.error("Error loading product:", error)
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return

    addItem(product, selectedSize, selectedColor, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
    openCart()
  }

  const selectedColorObj = product?.colors.find((c) => c.name === selectedColor)
  const hasDiscount = product?.originalPrice && product.originalPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neutral-900"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => router.push("/products")}>Back to Products</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("common.back")}
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-neutral-900">{product.name}</h1>
              <p className="text-sm text-neutral-600">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)} •{" "}
                {product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1).replace("-", " ")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsFavorite(!isFavorite)}>
                <Heart className={cn("w-4 h-4", isFavorite && "fill-red-500 text-red-500")} />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4 -mx-6 sm:mx-0">
            {/* Main Image */}
            <motion.div
              className="relative h-[70vh] sm:h-auto sm:aspect-[3/4] bg-white rounded-none sm:rounded-2xl overflow-hidden shadow-lg"
              layoutId={`product-image-${product.id}`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <Image
                    src={product.images[selectedImageIndex] || product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge
                    className={cn(
                      "text-white font-medium",
                      product.badge === "New" && "bg-green-500",
                      product.badge === "Popular" && "bg-blue-500",
                      product.badge === "Limited" && "bg-amber-500",
                      product.badge === "Sale" && "bg-red-500",
                    )}
                  >
                    {product.badge}
                    {hasDiscount && ` -${discountPercentage}%`}
                  </Badge>
                </div>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 px-6 sm:px-0" aria-label="Product image thumbnails">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "relative flex-shrink-0 w-28 h-36 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all",
                      selectedImageIndex === index
                        ? "border-neutral-900"
                        : "border-neutral-200 hover:border-neutral-400",
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">{product.name}</h1>
              <p className="text-neutral-600 mb-4">{product.description}</p>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-neutral-900">${product.price}</span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-neutral-500 line-through">${product.originalPrice}</span>
                    <Badge className="bg-red-500 text-white">Save ${product.originalPrice! - product.price}</Badge>
                  </>
                )}
              </div>

              {/* Materials */}
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm text-neutral-600">{product.materials.join(" • ")}</span>
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-3">
                {t("products.size")}: <span className="font-normal text-neutral-600">{selectedSize}</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <motion.button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "px-4 py-2 rounded-lg border-2 font-medium transition-all",
                      selectedSize === size
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400",
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-3">
                {t("products.color")}: <span className="font-normal text-neutral-600">{selectedColor}</span>
              </label>
              <div className="flex gap-3 flex-wrap">
                {product.colors.map((color) => (
                  <motion.button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={cn(
                      "relative w-12 h-12 rounded-full border-4 transition-all",
                      selectedColor === color.name
                        ? "border-neutral-900 scale-110"
                        : "border-neutral-300 hover:border-neutral-400",
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {selectedColor === color.name && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Check className="w-5 h-5 text-white drop-shadow-lg" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-3">{t("products.quantity")}</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-neutral-300 rounded-lg">
                  <motion.button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-neutral-100 transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="px-4 py-3 font-medium min-w-[3rem] text-center">{quantity}</span>
                  <motion.button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-neutral-100 transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
                <span className="text-sm text-neutral-600">
                  Total: <span className="font-bold">${(product.price * quantity).toFixed(2)}</span>
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.div className="pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || !selectedSize || !selectedColor}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-4 text-lg font-medium rounded-xl"
                size="lg"
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.div
                      key="added"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Added to Cart!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="add"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {product.inStock ? "Get Now" : t("products.outOfStock")}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              {(!selectedSize || !selectedColor) && (
                <p className="text-sm text-red-500 mt-2 text-center">
                  Please select size and color before adding to cart
                </p>
              )}
            </motion.div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 pt-2">
              <div className={cn("w-2 h-2 rounded-full", product.inStock ? "bg-green-500" : "bg-red-500")} />
              <span className="text-sm text-neutral-600">
                {product.inStock ? "In Stock - Ready to Ship" : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
