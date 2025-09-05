"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { Reveal } from "./reveal"
import Link from "next/link"

const categories = [
  {
    id: "men",
    nameKey: "categories.men",
    image: "/elegant-men-s-turkish-jacket.png",
    subcategories: ["pants", "summerShirts", "winterShirts", "jackets", "boots", "underwear", "hats", "slippers", "pajamaSets"],
  },
  {
    id: "women",
    nameKey: "categories.women",
    image: "/elegant-turkish-women-s-dress.png",
    subcategories: ["dress", "abaya", "pants", "summerShirts", "winterShirts", "jackets", "boots", "slippers", "pajamaSets"],
  },
  {
    id: "boys",
    nameKey: "categories.boys",
    image: "/boys-turkish-outfit.png",
    subcategories: ["pants", "summerShirts", "winterShirts", "jackets", "boots", "underwear", "hats", "slippers", "pajamaSets"],
  },
  {
    id: "girls",
    nameKey: "categories.girls",
    image: "/girls-turkish-dress.png",
    subcategories: ["dress", "pants", "summerShirts", "winterShirts", "jackets", "boots", "slippers", "pajamaSets"],
  },
]

export function MainCategories() {
  const { t, isRTL } = useLanguage()

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t("categories.title")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("categories.subtitle")}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 0.1}>
              <Link href={`/products?category=${category.id}`}>
                <motion.div
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="aspect-[3/4] sm:aspect-[4/5] relative overflow-hidden">
                    <motion.img
                      src={category.image}
                      alt={t(category.nameKey)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 text-white">
                    <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">{t(category.nameKey)}</h3>
                    <p className="text-white/80 text-[11px] sm:text-sm">
                      {category.subcategories.length} {t("categories.subcategories")}
                    </p>
                  </div>

                  <motion.div
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
