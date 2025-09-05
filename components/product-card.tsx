// @ts-nocheck
"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  onQuickLook: (product: Product) => void
}

export function ProductCard({ product, onQuickLook }: ProductCardProps) {
  const { t } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)

  const displayPrice = product.originalPrice ? product.price : product.price
  const hasDiscount = product.originalPrice && product.originalPrice > product.price

  return (
    <motion.div
      className="group relative bg-white overflow-hidden text-[13px] sm:text-[14px]"
      style={{ borderRadius: "24px", boxShadow: "rgba(0,0,0,0.1) 0 10px 50px" }}
      layout
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-20">
          <span
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full",
              product.badge === "New" && "bg-green-500/90 text-white",
              product.badge === "Popular" && "bg-blue-500/90 text-white",
              product.badge === "Limited" && "bg-amber-500/90 text-white",
              product.badge === "Sale" && "bg-red-500/90 text-white",
            )}
          >
            {product.badge}
          </span>
        </div>
      )}

      {/* Image */}
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
          <div className="relative w-full h-full">
            <motion.div className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}>
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          </div>
        </div>
      </Link>

      {/* Info (no blur, simple gradient) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div className="relative z-10">
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 drop-shadow-sm line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="hidden sm:block text-xs sm:text-sm text-white/90 mb-2 drop-shadow-sm">
            {product.materials?.join(", ") || "Premium Quality"}
          </p>
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-1.5">
            <span className="text-base sm:text-lg md:text-xl font-bold text-white drop-shadow-sm">{formatCurrency(displayPrice)}</span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-white/70 line-through drop-shadow-sm">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>
          {product.inStock && product.stockQuantity < 5 && (
            <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-red-300 md:text-red-400 mb-2">
              Only {product.stockQuantity} left
            </p>
          )}
          {!product.inStock && (
            <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-red-300 md:text-red-400 mb-2">
              Out of Stock
            </p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (product.inStock) {
                  onQuickLook(product)
                }
              }}
              disabled={!product.inStock}
              className={`w-full border border-white/25 text-[11px] sm:text-xs md:text-sm py-1.5 md:py-2 h-auto transition-all duration-200 ${
                product.inStock 
                  ? "bg-white/15 hover:bg-white/25 text-white" 
                  : "bg-gray-500/50 text-gray-300 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              {product.inStock ? (t("products.quickShop") || "Quick Shop") : "Out of Stock"}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
