"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { CartButton } from "./cart-button"
import { LanguageToggle } from "./language-toggle"
import { Facebook } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { t, isRTL } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "backdrop-blur-md border-b border-white/[0.02]",
        isScrolled ? "bg-white/[0.02]" : "bg-white/[0.02]",
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-12 lg:h-16 relative">
          {/* Logo */}
          <motion.div className="flex-shrink-0" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <a
              href="/"
              className={cn(
                "text-xl lg:text-2xl font-bold tracking-tight transition-colors",
                isScrolled ? "text-neutral-900 hover:text-neutral-700" : "text-white hover:text-white/80",
              )}
              aria-label="Almajd Turkey Clothes Home"
            >
              <div className="text-center">
                <div className="text-lg lg:text-xl">ALMAJD</div>
                <div className="text-xs lg:text-sm opacity-90">المجد للألبسة التركية</div>
              </div>
            </a>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="/products"
              className={cn(
                "text-sm font-medium transition-colors",
                isScrolled ? "text-neutral-700 hover:text-neutral-900" : "text-white/90 hover:text-white",
              )}
            >
              {t("header.products")}
            </a>
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            <LanguageToggle
              className={cn(isScrolled ? "text-neutral-700 hover:bg-neutral-100" : "text-white hover:bg-white/10")}
            />
            <CartButton
              className={cn(isScrolled ? "text-neutral-700 hover:bg-neutral-100" : "text-white hover:bg-white/10")}
            />
            {/* Social Icons */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <a
                href="https://www.facebook.com/share/1M7vp9JFma/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors",
                  isScrolled ? "bg-[#1877F2] hover:bg-[#145cc0]" : "bg-[#1877F2]/90 hover:bg-[#1877F2]",
                )}
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://wa.me/972598403676"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors",
                  isScrolled ? "bg-[#25D366] hover:bg-[#1da851]" : "bg-[#25D366]/90 hover:bg-[#25D366]",
                )}
                aria-label="WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M16.72 13.88c-.27-.14-1.62-.8-1.87-.89-.25-.09-.43-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.46-.16 0-.34-.02-.52-.02-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.34.98 2.64 1.12 2.82.14.18 1.93 2.95 4.73 4.14.66.28 1.18.45 1.58.58.66.21 1.26.18 1.73.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.11-.25-.18-.52-.32Z" />
                  <path d="M12 22c-1.82 0-3.6-.49-5.14-1.43L2 22l1.5-4.73A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10 2.67 0 5.18 1.04 7.07 2.93A9.93 9.93 0 0 1 22 12c0 5.52-4.48 10-10 10Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
