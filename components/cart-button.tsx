"use client"

import { motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

interface CartButtonProps {
  className?: string
  variant?: "header" | "floating"
}

export function CartButton({ className, variant = "header" }: CartButtonProps) {
  const { toggleCart, getTotalItems } = useCart()
  const { t } = useLanguage()
  const totalItems = getTotalItems()

  if (variant === "floating") {
    return (
      <motion.button
        onClick={toggleCart}
        className={cn(
          "fixed bottom-6 right-6 z-40 bg-neutral-900 text-white p-4 rounded-full shadow-lg",
          "hover:bg-neutral-800 transition-colors",
          className,
        )}
        aria-label={t("header.cart")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <ShoppingBag className="w-6 h-6" />
        {totalItems > 0 && (
          <motion.span
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {totalItems > 99 ? "99+" : totalItems}
          </motion.span>
        )}
      </motion.button>
    )
  }

  return (
    <button
      onClick={toggleCart}
      className={cn("relative p-2 hover:bg-white/10 rounded-lg transition-colors", className)}
      aria-label={t("header.cart")}
    >
      <ShoppingBag className="w-5 h-5" />
      {totalItems > 0 && (
        <motion.span
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {totalItems > 9 ? "9+" : totalItems}
        </motion.span>
      )}
    </button>
  )
}
