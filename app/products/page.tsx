// @ts-nocheck
"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { CategoryNavigation } from "@/components/category-navigation"
import { QuickLookModal } from "@/components/quick-look-modal"
import { Reveal } from "@/components/reveal"
import { useLanguage } from "@/contexts/language-context"
import type { Product } from "@/types/product"
import { cn } from "@/lib/utils"

export default function ProductsPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => searchParams.get("category"))
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(() => searchParams.get("subcategory"))
  const initialPage = (() => {
    const p = parseInt(searchParams.get("page") || "1", 10)
    return isNaN(p) || p < 1 ? 1 : p
  })()
  const [currentPage, setCurrentPage] = useState<number>(initialPage)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const pageSize = 16
  const productsRef = useRef<HTMLDivElement | null>(null)
  // Price filter (fixed bounds 0 - 1000 as requested)
  const priceBounds = { min: 0, max: 1000 }
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>(priceBounds)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      
      const data = await response.json()
      setProducts(data)

      // Reset range to full fixed bounds
      setPriceRange({ ...priceBounds })
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  // Sync URL (shallow) when filters change (no navigation) so page doesn't revert due to old params navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (selectedCategory) params.set("category", selectedCategory)
    else params.delete("category")
    if (selectedSubcategory) params.set("subcategory", selectedSubcategory)
    else params.delete("subcategory")
    if (currentPage > 1) params.set("page", String(currentPage))
    else params.delete("page")
    const newQs = params.toString()
    const newUrl = `${window.location.pathname}${newQs ? `?${newQs}` : ""}`
    window.history.replaceState(null, "", newUrl)
  }, [selectedCategory, selectedSubcategory, currentPage])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory && product.category !== selectedCategory) return false
      if (selectedSubcategory && product.subcategory !== selectedSubcategory) return false
      if (product.price < priceRange.min || product.price > priceRange.max) return false
      return true
    })
  }, [products, selectedCategory, selectedSubcategory, priceRange])

  // Adjust current page if filters reduce product count
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
    setCurrentPage((p) => (p > totalPages ? totalPages : p))
  }, [filteredProducts])

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, currentPage])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredProducts.length / pageSize)), [filteredProducts])

  const goToPage = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of products on page change
    requestAnimationFrame(() => {
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  // Reset to page 1 when category/subcategory/price range changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, selectedSubcategory, priceRange])

  const handleSubcategorySelect = (sub: string | null) => {
    setSelectedSubcategory(sub)
    // scroll after state update (next frame)
    requestAnimationFrame(() => {
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  const resetPriceFilter = () => setPriceRange({ ...priceBounds })

  const handleQuickLook = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <Header />
        <div className="pt-20 lg:pt-24">
          <div className="container-custom py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neutral-900"></div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <Header />

      <div className="pt-20 lg:pt-24">
        <div className="container-custom py-12">
          <Reveal>
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 mb-4">{t("products.title")}</h1>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">{t("products.subtitle")}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Category Navigation */}
            <div className="lg:col-span-1 space-y-6">
              <CategoryNavigation
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                onCategorySelect={(c) => {
                  setSelectedCategory(c)
                  requestAnimationFrame(() => {
                    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                  })
                }}
                onSubcategorySelect={handleSubcategorySelect}
              />
              {/* Price Filter */}
        {priceBounds.max > priceBounds.min && (
                <div className="bg-white rounded-2xl shadow-lg p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-neutral-800 tracking-wide uppercase">Price</h4>
      {(priceRange.min !== priceBounds.min || priceRange.max !== priceBounds.max) && (
                      <button
            onClick={resetPriceFilter}
                        className="text-xs text-neutral-500 hover:text-neutral-800"
                      >Reset</button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-[11px] text-neutral-500 mb-1">Min</label>
                        <input
                          type="number"
                          value={priceRange.min}
                          min={priceBounds.min}
                          max={priceRange.max}
                          onChange={e => setPriceRange(r => ({ ...r, min: Math.min(Number(e.target.value), r.max) }))}
                          className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[11px] text-neutral-500 mb-1">Max</label>
                        <input
                          type="number"
                          value={priceRange.max}
                          min={priceRange.min}
                          max={priceBounds.max}
                          onChange={e => setPriceRange(r => ({ ...r, max: Math.max(Number(e.target.value), r.min) }))}
                          className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
                        />
                      </div>
                    </div>
                    {/* Dual range sliders */}
                    <div className="relative pt-4">
                      <div className="h-1 bg-neutral-200 rounded-full" />
                      <div
                        className="absolute h-1 bg-neutral-800 rounded-full top-4"
                        style={{
                          left: `${((priceRange.min - priceBounds.min) / (priceBounds.max - priceBounds.min)) * 100}%`,
                          right: `${100 - ((priceRange.max - priceBounds.min) / (priceBounds.max - priceBounds.min)) * 100}%`,
                        }}
                      />
                      <input
                        type="range"
                        min={priceBounds.min}
                        max={priceBounds.max}
                        value={priceRange.min}
                        onChange={e => {
                          const raw = Number(e.target.value)
                          const clamped = Math.min(raw, priceRange.max - 1)
                          setPriceRange(r => ({ ...r, min: clamped }))
                        }}
                        className="absolute top-3 w-full appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-900 cursor-pointer"
                      />
                      <input
                        type="range"
                        min={priceBounds.min}
                        max={priceBounds.max}
                        value={priceRange.max}
                        onChange={e => {
                          const raw = Number(e.target.value)
                          const clamped = Math.max(raw, priceRange.min + 1)
                          setPriceRange(r => ({ ...r, max: clamped }))
                        }}
                        className="absolute top-3 w-full appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-900 cursor-pointer"
                      />
                      <div className="flex justify-between mt-6 text-[11px] text-neutral-500">
                        <span>{priceBounds.min}</span>
                        <span>{priceBounds.max}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Size filter removed */}
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3" ref={productsRef} id="products-grid">
              <motion.div
                // Mobile: 2 columns, tighter gaps; scale up progressively
                className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 md:gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {paginatedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.6,
                          ease: [0.21, 0.47, 0.32, 0.98],
                        },
                      },
                    }}
                  >
                    <Reveal delay={index * 0.05}>
                      <ProductCard product={product} onQuickLook={handleQuickLook} />
                    </Reveal>
                  </motion.div>
                ))}
              </motion.div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-neutral-600">{t("products.noProducts")}</p>
                </div>
              )}

              {/* Pagination */}
              {filteredProducts.length > 0 && totalPages > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={cn(
                      "px-3 h-10 rounded-md border text-sm font-medium",
                      currentPage === 1
                        ? "cursor-not-allowed opacity-40 border-neutral-200"
                        : "hover:bg-neutral-100 border-neutral-200"
                    )}
                  >
                    {t("common.prev") || "Prev"}
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const active = p === currentPage
                    // Only show near pages when many pages (window of 2 around current + first/last)
                    if (totalPages > 7) {
                      const window = Math.abs(p - currentPage) <= 2
                      const boundary = p === 1 || p === totalPages
                      if (!window && !boundary) {
                        if (p === 2 || p === totalPages - 1) return <span key={p} className="px-2">…</span>
                        return null
                      }
                    }
                    return (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={cn(
                          "w-10 h-10 rounded-md border text-sm font-medium transition-all",
                          active
                            ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                            : "hover:bg-neutral-100 border-neutral-200"
                        )}
                      >
                        {p}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={cn(
                      "px-3 h-10 rounded-md border text-sm font-medium",
                      currentPage === totalPages
                        ? "cursor-not-allowed opacity-40 border-neutral-200"
                        : "hover:bg-neutral-100 border-neutral-200"
                    )}
                  >
                    {t("common.next") || "Next"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <QuickLookModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
    </main>
  )
}
