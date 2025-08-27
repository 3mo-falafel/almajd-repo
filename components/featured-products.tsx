"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ProductCard } from "./product-card"
import { QuickLookModal } from "./quick-look-modal"
import { Reveal } from "./reveal"
import type { Product } from "@/types/product"

const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Premium Men's Jacket",
    price: 89,
    originalPrice: 120,
    image: "/elegant-men-s-turkish-jacket.png",
    images: ["/elegant-men-s-turkish-jacket.png", "/men-s-jacket-detail-view.png", "/men-s-jacket-back-view.png"],
    badge: "Sale",
    materials: ["Premium Cotton", "Turkish Craftsmanship"],
    description: "Elegant Turkish-made jacket with premium cotton fabric and exceptional craftsmanship.",
    category: "men",
    subcategory: "jackets",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Navy Blue", color: "#1e3a8a" },
      { name: "Charcoal", color: "#374151" },
      { name: "Brown", color: "#92400e" },
    ],
    inStock: true,
    isOffer: true,
  },
  {
    id: "2",
    name: "Elegant Women's Dress",
    price: 75,
    image: "/elegant-turkish-women-s-dress.png",
    images: ["/elegant-turkish-women-s-dress.png", "/women-s-dress-detail-view.png", "/women-s-dress-side-view.png"],
    badge: "Popular",
    materials: ["Silk Blend", "Hand-finished Details"],
    description: "Beautiful Turkish dress with silk blend fabric and hand-finished details.",
    category: "women",
    subcategory: "dress",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Burgundy", color: "#7c2d12" },
      { name: "Emerald", color: "#065f46" },
      { name: "Navy", color: "#1e3a8a" },
    ],
    inStock: true,
  },
  {
    id: "3",
    name: "Boys' Summer Shirt",
    price: 35,
    image: "/turkish-boys-summer-shirt.png",
    images: ["/turkish-boys-summer-shirt.png", "/boys-shirt-detail-view.png", "/boys-shirt-back-view.png"],
    badge: "New",
    materials: ["Cotton Blend", "Breathable Fabric"],
    description: "Comfortable summer shirt for boys with breathable cotton blend fabric.",
    category: "boys",
    subcategory: "summer-shirts",
    sizes: ["4-6Y", "8-10Y", "12-14Y"],
    colors: [
      { name: "Sky Blue", color: "#0ea5e9" },
      { name: "White", color: "#ffffff" },
      { name: "Light Green", color: "#22c55e" },
    ],
    inStock: true,
  },
]

export function FeaturedProducts() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleQuickLook = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleAddToCart = (product: Product, size: string, color: string, quantity: number) => {
    // TODO: Implement cart functionality
    console.log("Add to cart:", { product: product.name, size, color, quantity })
  }

  return (
    <section className="py-20 lg:py-32" id="featured-products">
      <div className="container-custom">
        <Reveal>
          <div className="text-left mb-16">
            <h2 className="text-4xl text-neutral-900 mb-4 lg:text-6xl">
              Featured <span className="italic font-light">Fashion</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl">
              Discover our most popular Turkish fashion pieces, each crafted with premium materials and attention to
              detail for the whole family.
            </p>
          </div>
        </Reveal>

        <motion.div
          className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
        >
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  },
                },
              }}
            >
              <Reveal delay={index * 0.1}>
                <ProductCard product={product} onQuickLook={handleQuickLook} onAddToCart={handleAddToCart} />
              </Reveal>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <QuickLookModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
    </section>
  )
}
