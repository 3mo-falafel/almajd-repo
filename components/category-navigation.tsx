"use client"

import React, { useMemo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { CATEGORIES } from "@/types/product"
import { useLanguage } from "@/contexts/language-context"

interface CategoryNavigationProps {
  selectedCategory: string | null
  selectedSubcategory: string | null
  onCategorySelect: (category: string | null) => void
  onSubcategorySelect: (subcategory: string | null) => void
}

// Inline minimalist icon set (consistent stroke + size) to avoid external dependency.
// Each icon intentionally abstract for a clean unified look.
const baseIconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "w-6 h-6 sm:w-7 sm:h-7",
}

const PantsIcon = () => (
  <svg {...baseIconProps}>
    <path d="M8 3h8l2 8-3 10-3-6-3 6-3-10 2-8Z" />
  </svg>
)
const SunIcon = () => (
  <svg {...baseIconProps}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l-1.5-1.5M19.5 19.5 18 18M5 19l-1.5 1.5M19.5 4.5 18 6" />
  </svg>
)
const SnowIcon = () => (
  <svg {...baseIconProps}>
    <path d="M12 2v20M4 6l16 12M4 18 20 6M2 12h20" />
  </svg>
)
const JacketIcon = () => (
  <svg {...baseIconProps}>
    <path d="M9 3 5 6v12l4 3 3-8 3 8 4-3V6l-4-3H9Z" />
  </svg>
)
const BootsIcon = () => (
  <svg {...baseIconProps}>
    <path d="M7 3v10h10V7l-4-4H7Zm10 6 3 3v3H4v-3l3-3" />
  </svg>
)
const PackageIcon = () => (
  <svg {...baseIconProps}>
    <path d="M3 9 12 4l9 5v6l-9 5-9-5V9Z" />
    <path d="M12 4v6l9 5M12 10 3 15" />
  </svg>
)
const HatIcon = () => (
  <svg {...baseIconProps}>
    <path d="M3 15c3 2 7 3 9 3s6-1 9-3c0-3-4-6-9-6s-9 3-9 6Z" />
    <path d="M7 11c1-.7 3-1 5-1s4 .3 5 1" />
  </svg>
)
const SlippersIcon = () => (
  <svg {...baseIconProps}>
    <path d="M7 4c2 0 3 1 3 3v11c0 1.1-.9 2-2 2H6c-1.7 0-3-1.3-3-3v-5c0-5 2-8 4-8Zm10 0c2 0 4 3 4 8v5c0 1.7-1.3 3-3 3h-2c-1.1 0-2-.9-2-2V7c0-2 1-3 3-3Z" />
  </svg>
)
const DressIcon = () => (
  <svg {...baseIconProps}>
    <path d="M9 3h6l1 4-3 3 4 10H7l4-10-3-3 1-4Z" />
  </svg>
)
const AbayaIcon = () => (
  <svg {...baseIconProps}>
    <path d="M10 3h4l3 5-3 13H10L7 8l3-5Z" />
  </svg>
)
const FallbackIcon = () => (
  <svg {...baseIconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9h6v6H9Z" />
  </svg>
)

const SUBCATEGORY_ICONS: Record<string, React.FC> = {
  pants: PantsIcon,
  "summer-shirts": SunIcon,
  "winter-shirts": SnowIcon,
  jackets: JacketIcon,
  boots: BootsIcon,
  underwear: PackageIcon,
  hats: HatIcon,
  slippers: SlippersIcon,
  dress: DressIcon,
  abaya: AbayaIcon,
}

export function CategoryNavigation({
  selectedCategory,
  selectedSubcategory,
  onCategorySelect,
  onSubcategorySelect,
}: CategoryNavigationProps) {
  const { t, language, isRTL } = useLanguage()

  // Active category only when explicitly selected; no implicit fallback so switching always reflects user choice
  const firstCategoryKey = Object.keys(CATEGORIES)[0]
  const activeCategoryKey = selectedCategory ?? null
  const activeCategory = activeCategoryKey ? (CATEGORIES as any)[activeCategoryKey] : null

  const subcategories = useMemo(() => (activeCategory ? activeCategory.subcategories : []), [activeCategory])

  const translateSub = (id: string, name: string, nameAr?: string) => {
    const camelKey = id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    const translated = t(`subcategories.${camelKey}`)
    if (!translated || translated.startsWith("subcategories.")) {
      return language === "ar" ? nameAr || name : name
    }
    return translated
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-neutral-900 mb-5 flex items-center gap-2">
        {t("categories.title")}
      </h3>

      {/* Main category filter bar */}
      <div className={cn("flex flex-wrap gap-2 mb-6", isRTL && "justify-end")}>
  {Object.keys(CATEGORIES).map((key) => {
          const active = key === activeCategoryKey
          return (
            <button
              key={key}
              onClick={() => {
    onCategorySelect(key)
    onSubcategorySelect(null)
              }}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all border flex items-center gap-2",
                active
                  ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50",
              )}
            >
              <span>{t(`categories.${key}`)}</span>
            </button>
          )
        })}
      </div>

      {/* Subcategory cards grid (only shown when a category is active) */}
      {activeCategory && (
  <div className="grid grid-cols-3 gap-3 sm:gap-4 sm:grid-cols-3">
          {/* All (no subcategory) */}
          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSubcategorySelect(null)}
            className={cn(
              "group relative rounded-xl aspect-square border flex flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-700",
              selectedSubcategory === null && "ring-2 ring-neutral-900 border-neutral-900",
            )}
          >
            <div className="flex flex-col items-center gap-1 px-2 text-center">
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">All</span>
              <span className="text-[10px] text-white/60 uppercase tracking-wide">
                {t(`categories.${activeCategoryKey}`)}
              </span>
            </div>
          </motion.button>

          {subcategories.map((sub: any) => {
            const active = selectedSubcategory === sub.id
            const Icon = SUBCATEGORY_ICONS[sub.id] || FallbackIcon
            return (
              <motion.button
                key={sub.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSubcategorySelect(active ? null : sub.id)}
                className={cn(
                  "group relative rounded-xl aspect-square border flex flex-col items-center justify-center gap-2 overflow-hidden bg-white transition-shadow",
                  active
                    ? "ring-2 ring-neutral-900 border-neutral-900 shadow-sm"
                    : "border-neutral-200 hover:border-neutral-300",
                )}
              >
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-neutral-50 via-white to-neutral-100" />
                <div className="relative flex flex-col items-center justify-center gap-2 px-2 w-full h-full">
                  <div className={cn(
                    "flex items-center justify-center rounded-xl w-12 h-12 sm:w-16 sm:h-16 md:w-16 md:h-16 bg-neutral-900 text-white shadow-inner transition-colors",
                    active ? "bg-neutral-800" : "group-hover:bg-neutral-900/90",
                  )}>
                    <Icon />
                  </div>
                  <div className="text-center leading-tight">
                    <div className="font-semibold text-neutral-800 line-clamp-2 text-[11px] sm:text-[12px]">
                      {translateSub(sub.id, sub.name, sub.nameAr)}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-wide mt-0.5">
                      {t(`categories.${activeCategoryKey}`)}
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Clear filters */}
  {(selectedCategory || selectedSubcategory) && (
        <button
          onClick={() => {
            onCategorySelect(null)
            onSubcategorySelect(null)
          }}
          className="w-full mt-6 p-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          {t("categories.clearFilters")}
        </button>
      )}
    </div>
  )
}

export default CategoryNavigation
