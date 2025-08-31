"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { BlurPanel } from "./blur-panel"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context"
import { cn, formatCurrency } from "@/lib/utils"
import type { Product } from "@/types/product"

interface QuickLookModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function QuickLookModal({ product, isOpen, onClose }: QuickLookModalProps) {
  const { addItem, openCart } = useCart()
  const { t, isRTL } = useLanguage()
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    if (product) {
      console.log("[v0] QuickLookModal product data:", product) // Debug log
      console.log("[v0] Product sizes:", product.sizes)
      console.log("[v0] Product colors:", product.colors)
      setSelectedSize(product.sizes?.[0] || "")
      setSelectedColor(product.colors?.[0]?.name || "")
      setQuantity(1)
  setCurrentImage(0)
    }
  }, [product])

  if (!product) return null

  const handleAddToCart = () => {
    console.log("[v0] Adding to cart:", { selectedSize, selectedColor, quantity })
    if (selectedSize && selectedColor) {
      addItem(product, selectedSize, selectedColor, quantity)
      openCart()
      onClose()
    }
  }

  const selectedColorObj = product.colors?.find((c) => c.name === selectedColor)
  const displayPrice = product.originalPrice ? product.price : product.price
  const hasDiscount = product.originalPrice && product.originalPrice > product.price

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <BlurPanel className="bg-white/95 backdrop-blur-md">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Image Gallery with Carousel */}
                <div className="relative">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-4 group">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={currentImage + (selectedColorObj?.image ? "color" : "base")}
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={
                            // Priority: explicit color image -> images array -> fallback image field -> placeholder
                            selectedColorObj?.image ||
                            product.images?.[currentImage] ||
                            product.image ||
                            "/placeholder.svg"
                          }
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    {product.images && product.images.length > 1 && !selectedColorObj?.image && (
                      <>
                        <button
                          aria-label="Previous image"
                          onClick={() => setCurrentImage((i) => (i - 1 + product.images.length) % product.images.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-neutral-900 p-2 rounded-full shadow transition-opacity opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          aria-label="Next image"
                          onClick={() => setCurrentImage((i) => (i + 1) % product.images.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-neutral-900 p-2 rounded-full shadow transition-opacity opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Dots Indicator (only when not using color override image) */}
                    {product.images && product.images.length > 1 && !selectedColorObj?.image && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {product.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImage(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              currentImage === idx ? "bg-white scale-110" : "bg-white/50 hover:bg-white/70"
                            }`}
                            aria-label={`Go to image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Thumbnails (hidden if color image selected) */}
                  {product.images && product.images.length > 1 && !selectedColorObj?.image && (
                    <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImage(idx)}
                          className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border transition-all ${
                            currentImage === idx
                              ? "ring-2 ring-neutral-900 border-neutral-900"
                              : "border-neutral-200 hover:border-neutral-400"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img || "/placeholder.svg"}
                            alt={product.name + " thumbnail " + (idx + 1)}
                            className="object-cover w-full h-full"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col min-h-[500px]">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className={cn("text-3xl font-bold text-neutral-900 mb-2", isRTL && "text-right")}>
                        {product.name}
                      </h2>
                      <p className={cn("text-lg text-neutral-600", isRTL && "text-right")}>
                        {product.materials?.join(", ") || "Premium Quality"}
                      </p>
                    </div>
                    <button
                      className="p-2 hover:bg-neutral-100 rounded-full transition-colors duration-200"
                      onClick={onClose}
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-6 flex-1">
                    {/* Price */}
                    <div className={cn("flex items-center gap-2", isRTL && "justify-end")}>
                      <span className="text-2xl font-bold text-neutral-900">{formatCurrency(displayPrice)}</span>
                      {hasDiscount && (
                        <span className="text-lg text-neutral-500 line-through">{formatCurrency(product.originalPrice || 0)}</span>
                      )}
                    </div>

                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div>
                        <h4 className={cn("text-sm font-medium text-neutral-900 mb-3", isRTL && "text-right")}>
                          {t("products.size")}
                        </h4>
                        <div className="flex gap-2 flex-wrap">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => {
                                console.log("[v0] Selected size:", size)
                                setSelectedSize(size)
                              }}
                              className={cn(
                                "px-4 py-2 text-sm rounded-lg border transition-colors",
                                selectedSize === size
                                  ? "bg-neutral-900 text-white border-neutral-900"
                                  : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400",
                              )}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Color Selection */}
                    {product.colors && product.colors.length > 0 && (
                      <div>
                        <h4 className={cn("text-sm font-medium text-neutral-900 mb-3", isRTL && "text-right")}>
                          {t("products.color")}
                        </h4>
                        <div className="flex gap-3 flex-wrap">
                          {product.colors.map((color) => (
                            <button
                              key={color.name}
                              onClick={() => {
                                console.log("[v0] Selected color:", color.name)
                                setSelectedColor(color.name)
                              }}
                              className={cn(
                                "w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center",
                                selectedColor === color.name
                                  ? "border-neutral-900 scale-110 ring-2 ring-neutral-900 ring-offset-2"
                                  : "border-neutral-300 hover:border-neutral-400",
                              )}
                              style={{ backgroundColor: (color as any).hex || color.color }}
                              title={color.name}
                            >
                              {selectedColor === color.name && <div className="w-2 h-2 bg-white rounded-full" />}
                            </button>
                          ))}
                        </div>
                        <p className="text-sm text-neutral-600 mt-2">Selected: {selectedColor}</p>
                      </div>
                    )}

                    {/* Quantity Selection */}
                    <div>
                      <h4 className={cn("text-sm font-medium text-neutral-900 mb-3", isRTL && "text-right")}>
                        {t("products.quantity")}
                      </h4>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            const newQty = Math.max(1, quantity - 1)
                            console.log("[v0] Quantity decreased to:", newQty)
                            setQuantity(newQty)
                          }}
                          className="w-10 h-10 rounded-lg border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                        <button
                          onClick={() => {
                            const newQty = quantity + 1
                            console.log("[v0] Quantity increased to:", newQty)
                            setQuantity(newQty)
                          }}
                          className="w-10 h-10 rounded-lg border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Product Description */}
                    {product.description && (
                      <div>
                        <h4 className={cn("text-sm font-medium text-neutral-900 mb-3", isRTL && "text-right")}>
                          {t("products.description") || "Description"}
                        </h4>
                        <p className={cn("text-sm text-neutral-600 leading-relaxed", isRTL && "text-right")}>
                          {product.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Get Now Button */}
                  <div className="mt-8 pt-6 border-t border-neutral-200">
                    <motion.div whileHover={{ scale: product.inStock ? 1.02 : 1 }} whileTap={{ scale: product.inStock ? 0.98 : 1 }}>
                      <Button
                        onClick={handleAddToCart}
                        className={`w-full py-4 rounded-full font-medium text-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                          product.inStock 
                            ? "bg-neutral-900 text-white hover:bg-neutral-800" 
                            : "bg-gray-400 text-gray-600 cursor-not-allowed"
                        }`}
                        disabled={!product.inStock || !selectedSize || !selectedColor}
                      >
                        <ShoppingCart size={20} />
                        {product.inStock 
                          ? `${t("products.getNow")} - ${formatCurrency(displayPrice * quantity)}`
                          : "Out of Stock"
                        }
                      </Button>
                    </motion.div>
                    {product.inStock && (!selectedSize || !selectedColor) && (
                      <p className="text-sm text-red-500 text-center mt-2">
                        {t("products.selectSizeAndColor") || "Please select size and color"}
                      </p>
                    )}
                    {!product.inStock && (
                      <p className="text-sm text-red-500 text-center mt-2">
                        This product is currently out of stock
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </BlurPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
