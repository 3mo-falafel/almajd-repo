"use client"

import { motion } from "framer-motion"
import { Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

interface LanguageToggleProps {
  className?: string
  variant?: "header" | "floating"
}

export function LanguageToggle({ className, variant = "header" }: LanguageToggleProps) {
  const { language, setLanguage, isRTL } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en")
  }

  if (variant === "floating") {
    return (
      <motion.button
        onClick={toggleLanguage}
        className={cn(
          "fixed bottom-6 left-6 z-40 bg-neutral-900 text-white p-3 rounded-full shadow-lg",
          "hover:bg-neutral-800 transition-colors flex items-center gap-2",
          className,
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{language === "en" ? "عربي" : "EN"}</span>
      </motion.button>
    )
  }

  return (
    <button
      onClick={toggleLanguage}
      className={cn("flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-colors", className)}
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">{language === "en" ? "عربي" : "EN"}</span>
    </button>
  )
}
