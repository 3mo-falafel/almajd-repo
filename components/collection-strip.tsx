"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Reveal } from "./reveal"
import { useLanguage } from "@/contexts/language-context"

interface ProductRecord {
  id: string
  name: string
  images: string[]
  price?: number
  category?: string
  subcategory?: string
}

export function CollectionStrip() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { t, isRTL } = useLanguage()
  const [products, setProducts] = useState<ProductRecord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(5)
  const pausedRef = useRef(false)

  // Responsive items per view
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      if (w < 480) return setItemsPerView(2)
      if (w < 768) return setItemsPerView(3)
      if (w < 1024) return setItemsPerView(4)
      return setItemsPerView(5)
    }
    calc()
    window.addEventListener("resize", calc)
    return () => window.removeEventListener("resize", calc)
  }, [])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          console.error("[v0] Error loading products:", response.status)
          return
        }
        
        const data = await response.json()
        if (!data || data.length === 0) return

        // Map to expected format and shuffle for randomness
        const mappedProducts = data.map((product: any) => ({
          id: product.id,
          name: product.name,
          images: product.images,
          price: product.price,
          category: product.category,
          subcategory: product.subcategory
        }))
        
        const shuffled = [...mappedProducts].sort(() => Math.random() - 0.5)
        setProducts(shuffled.slice(0, 60)) // Limit to 60 products
      } catch (error) {
        console.error("[v0] Error in loadProducts:", error)
      }
    }
    loadProducts()
  }, [])

  // Auto advance every 4s when enough products
  useEffect(() => {
    if (products.length <= itemsPerView) return
    const id = setInterval(() => {
      if (pausedRef.current) return
      setCurrentIndex((p) => (p + 1) % products.length)
    }, 3000)
    return () => clearInterval(id)
  }, [products.length, itemsPerView])

  const visibleProducts: ProductRecord[] = []
  for (let i = 0; i < Math.min(itemsPerView, products.length); i++) {
    visibleProducts.push(products[(currentIndex + i) % products.length])
  }

  const goNext = useCallback(() => {
    if (products.length === 0) return
    setCurrentIndex((p) => (p + 1) % products.length)
  }, [products.length])
  const goPrev = useCallback(() => {
    if (products.length === 0) return
    setCurrentIndex((p) => (p - 1 + products.length) % products.length)
  }, [products.length])

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || (isRTL && e.key === "ArrowLeft")) {
      goNext()
    } else if (e.key === "ArrowLeft" || (isRTL && e.key === "ArrowRight")) {
      goPrev()
    }
  }, [goNext, goPrev, isRTL])

  return (
    <section ref={containerRef} className="py-20 lg:py-32 overflow-hidden">
      <div className="mb-12">
        <Reveal>
          <div className="container-custom text-center">
            <h2 className="text-neutral-900 mb-4 text-3xl sm:text-5xl md:text-6xl font-normal">{t("collections.title")}</h2>
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 max-w-2xl mx-auto">{t("collections.subtitle")}</p>
          </div>
        </Reveal>
      </div>
      <div className="container-custom" onMouseEnter={() => (pausedRef.current = true)} onMouseLeave={() => (pausedRef.current = false)}>
        <div className="relative" tabIndex={0} onKeyDown={onKeyDown} aria-label="Collections carousel">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
            >
              {visibleProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="group relative cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/product/${product.id}`} prefetch={false} className="block">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm">
                      <Image
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 50vw, 20vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                        <h3 className={`text-white text-sm sm:text-base font-semibold mb-1 ${!isRTL && "tracking-wide"}`}>{product.name}</h3>
                        {product.price != null && (
                          <p className="text-white/90 text-xs sm:text-sm font-medium">₪{product.price}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          {products.length > itemsPerView && (
            <>
              <button
                onClick={isRTL ? goNext : goPrev}
                aria-label="Previous"
                className="absolute top-1/2 -translate-y-1/2 left-0 -ml-4 md:-ml-6 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/80 backdrop-blur border border-neutral-200 shadow hover:bg-white transition flex items-center justify-center text-neutral-700"
              >
                <span className="text-xl">{isRTL ? '›' : '‹'}</span>
              </button>
              <button
                onClick={isRTL ? goPrev : goNext}
                aria-label="Next"
                className="absolute top-1/2 -translate-y-1/2 right-0 -mr-4 md:-mr-6 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/80 backdrop-blur border border-neutral-200 shadow hover:bg-white transition flex items-center justify-center text-neutral-700"
              >
                <span className="text-xl">{isRTL ? '‹' : '›'}</span>
              </button>
            </>
          )}

          {/* Indicators */}
          {products.length > 0 && (
            <div className="flex justify-center gap-2 mt-8">
              {products.slice(0, Math.min(products.length, 8)).map((_, i) => {
                const active = (currentIndex % products.length) === i
                return (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${active ? "bg-neutral-900 scale-110" : "bg-neutral-300"}`}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
