// @ts-nocheck
"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { QuickLookModal } from "@/components/quick-look-modal"
import { Reveal } from "@/components/reveal"
import { useLanguage } from "@/contexts/language-context"
import type { Product } from "@/types/product"
import { motion } from "framer-motion"

const CATEGORY_FILTERS = [
  { key: "men", label: "Men" },
  { key: "women", label: "Women" },
  { key: "girls", label: "Girls" },
  { key: "boys", label: "Boys" },
]

export default function OffersPage() {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Price filter state (fixed 0 - 1000)
  const priceBounds = { min: 0, max: 1000 }
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>(priceBounds)
  // Removed Supabase: use internal API

  useEffect(() => {
    loadOffers()
  }, [])

  const loadOffers = async () => {
    try {
  const res = await fetch('/api/products', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load offers')
  const all = await res.json()
  const offerItems = Array.isArray(all) ? all.filter((p:any)=>p.isOffer) : []
  const formatted: Product[] = offerItems.map((item:any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.original_price,
        description: item.description,
        category: item.category,
        subcategory: item.subcategory,
        sizes: item.sizes || [],
        colors: item.colors || [],
        images: item.images || [],
        image: item.images?.[0] || "/placeholder.svg",
        materials: ["Turkish Cotton", "Premium Quality"],
        badge: "Sale",
        inStock: item.stock_quantity > 0,
        isOffer: true,
        lowStockLeft: typeof item.low_stock_left === "number" ? item.low_stock_left : undefined,
      }))

      setProducts(formatted)

  // Reset to full fixed bounds
  setPriceRange({ ...priceBounds })
    } catch (err) {
      console.error("Error loading offers", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory && p.category !== selectedCategory) return false
      if (priceBounds.max > priceBounds.min) {
        if (p.price < priceRange.min || p.price > priceRange.max) return false
      }
      return true
    })
  }, [products, selectedCategory, priceRange, priceBounds])

  const resetPriceFilter = () => setPriceRange({ ...priceBounds })

  const handleQuickLook = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <Header />
      <div className="pt-20 lg:pt-24">
        <div className="container-custom py-12">
          <Reveal>
            <div className="text-center mb-10">
              <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 mb-4">
                {t("todaysOffers") || "Today's Offers"}
              </h1>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                {t("todaysOffersDescription") || "Explore all current limited-time deals."}
              </p>
            </div>
          </Reveal>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all border backdrop-blur-md shadow-sm ${
                !selectedCategory
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white/70 hover:bg-white text-neutral-700 border-neutral-300"
              }`}
            >
              {t("all") || "All"}
            </button>
            {CATEGORY_FILTERS.map((cat) => {
              const active = selectedCategory === cat.key
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-6 py-3 rounded-full text-sm font-semibold transition-all border backdrop-blur-md shadow-sm ${
                    active
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-amber-500/40"
                      : "bg-white/70 hover:bg-white text-neutral-700 border-neutral-300"
                  }`}
                >
                  {t(cat.key) || cat.label}
                </button>
              )
            })}
          </div>

          {/* Price Filter */}
          {priceBounds.max > priceBounds.min && (
            <div className="max-w-xl mx-auto mb-12 bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-neutral-800 tracking-wide uppercase">{t('price') || 'Price'}</h4>
                {(priceRange.min !== priceBounds.min || priceRange.max !== priceBounds.max) && (
                  <button onClick={resetPriceFilter} className="text-xs text-neutral-500 hover:text-neutral-800">{t('reset') || 'Reset'}</button>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-[11px] text-neutral-500 mb-1">{t('min') || 'Min'}</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      min={priceBounds.min}
                      max={priceRange.max}
                      onChange={e => setPriceRange(r => ({ ...r, min: Math.min(Number(e.target.value), r.max) }))}
                      className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] text-neutral-500 mb-1">{t('max') || 'Max'}</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      min={priceRange.min}
                      max={priceBounds.max}
                      onChange={e => setPriceRange(r => ({ ...r, max: Math.max(Number(e.target.value), r.min) }))}
                      className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                  </div>
                </div>
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

          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-neutral-900"></div>
            </div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 md:gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.08 },
                  },
                }}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
                      },
                    }}
                  >
                    <Reveal delay={index * 0.05}>
                      <div className="relative">
                        <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          {t("specialOffer")}
                        </div>
                        <ProductCard product={product} onQuickLook={handleQuickLook} />
                      </div>
                    </Reveal>
                  </motion.div>
                ))}
              </motion.div>
              {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-16">
                  <p className="text-neutral-600">{t("products.noProducts") || "No offers found."}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
      <QuickLookModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
    </main>
  )
}
