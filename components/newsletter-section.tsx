"use client"
import { motion } from "framer-motion"
import { Reveal } from "./reveal"
import { useLanguage } from "@/contexts/language-context"

export function NewsletterSection() {
  const { t } = useLanguage()

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5" />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("discover.title")}</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t("discover.subtitle")}</p>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
