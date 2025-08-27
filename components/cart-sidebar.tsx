"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { formatCurrency } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

export function CartSidebar() {
  const { state, closeCart, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart()
  const { t } = useLanguage()

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">{t("cart.title")}</h2>
                  {getTotalItems() > 0 && (
                    <span className="bg-neutral-900 text-white text-xs px-2 py-1 rounded-full">{getTotalItems()}</span>
                  )}
                </div>
                <button onClick={closeCart} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {state.items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-600 mb-2">{t("cart.empty")}</p>
                    <p className="text-sm text-neutral-500">{t("cart.emptySubtitle")}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {state.items.map((item, index) => (
                      <motion.div
                        key={`${item.product.id}-${item.size}-${item.color}-${index}`}
                        className="flex gap-4 p-4 bg-neutral-50 rounded-xl"
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        {/* Product Image */}
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-neutral-900 truncate">{item.product.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-neutral-600">{t("products.size")}: {item.size}</span>
                            <span className="text-xs text-neutral-600">•</span>
                            <span className="text-xs text-neutral-600">{t("products.color")}: {item.color}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-semibold text-neutral-900">{formatCurrency(item.product.price)}</span>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(index.toString(), item.quantity - 1)}
                                className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(index.toString(), item.quantity + 1)}
                                className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(index.toString())}
                          className="p-1 hover:bg-neutral-200 rounded-lg transition-colors self-start"
                        >
                          <X className="w-4 h-4 text-neutral-500" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {state.items.length > 0 && (
                <div className="border-t border-neutral-200 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{t("cart.total")}</span>
                    <span className="text-xl font-bold">{formatCurrency(getTotalPrice())}</span>
                  </div>
                  <Button
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-3"
                    onClick={() => {
                      closeCart()
                      // Navigate to checkout
                      window.location.href = "/checkout"
                    }}
                  >
                    {t("cart.checkout")}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
