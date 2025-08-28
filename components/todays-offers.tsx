"use client"
import { useState, useEffect } from "react"
import { ProductCard } from "./product-card"
import { QuickLookModal } from "./quick-look-modal"
import { Reveal } from "./reveal"
import { useLanguage } from "@/contexts/language-context"
import { createClient } from "@/lib/supabase/client"
import type { Product } from "@/types/product"

export function TodaysOffers() {
  const { language, t } = useLanguage()
  const [offers, setOffers] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadTodaysOffers()
  }, [])

  const loadTodaysOffers = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").eq("is_todays_offer", true).limit(8)

      if (error) throw error

      const formattedOffers: Product[] = data.map((item) => ({
        id: item.id, // Now using UUID from Supabase
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
      }))

      setOffers(formattedOffers)
    } catch (error) {
      console.error("Error loading today's offers:", error)
    } finally {
      setLoading(false)
    }
  }

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
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t("common.loading")}</p>
          </div>
        </div>
      </section>
    )
  }

  if (offers.length === 0) {
    return null
  }

  return (
    <>
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t("todaysOffers")}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("todaysOffersDescription")}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-8">
            {offers.map((product, index) => (
              <Reveal key={product.id} delay={index * 0.1}>
                <div className="relative">
                  {/* Special offer badge */}
                  <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {t("specialOffer")}
                  </div>
                  <ProductCard product={product} onQuickLook={handleQuickLook} />
                </div>
              </Reveal>
            ))}
          </div>

          {/* Full-width button to view all offers */}
          <div className="mt-12">
            <a
              href="/offers"
              className="block w-full text-center py-5 rounded-xl font-semibold tracking-wide bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {t("viewAllOffers") || "View All Offers"}
            </a>
          </div>
        </div>
      </section>

      <QuickLookModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}
