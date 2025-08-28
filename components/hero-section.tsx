"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { Truck, Clock, Shield, MapPin } from "lucide-react"
import { Reveal } from "./reveal"
import { BlurPanel } from "./blur-panel"
import { useLanguage } from "@/contexts/language-context"
import { AnimatedText } from "./animated-text"

// Hero background rotation images.
// Updated: kept original 1st & 3rd; replaced former 2nd & 4th with two new remote Shopify images; removed extras.
const backgroundImages = [
  "https://i.pinimg.com/1200x/07/7e/41/077e412eacf813cfe27ae9061f36f228.jpg", // newly added as first
  "/elegant-fashion-boutique-interior-with-turkish-clo.png", // original kept
  "https://cdn.shopify.com/s/files/1/1915/8837/files/How_to_look_stylish_affordably_1024x1024.jpg?v=1531232169", // Shopify
  "/turkish-women-fashion-showcase.png", // original kept
  "https://cdn.shopify.com/s/files/1/1249/2451/files/WEBSITE_EMAIL_BANNER_2048x1024_1_480x480.svg?v=1698280691", // Shopify banner
]

export function HeroSection() {
  const { t, isRTL } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.95])
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // (Per-character animation moved to shared AnimatedText; Arabic handled there to preserve glyph shaping.)

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Background Images with Rotation */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: imageScale, y: imageY }}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        {backgroundImages.map((image, index) => (
          <motion.div
            key={image}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentImageIndex ? 1 : 0,
              scale: index === currentImageIndex ? 1 : 1.1,
            }}
            transition={{
              duration: 1.5,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Almajd Turkey Clothes - Premium Turkish fashion ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex items-center justify-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="container-custom text-center text-white">
          <Reveal>
            <h1
              className={`text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-none tracking-tight mb-6 ${isRTL ? "font-arabic" : ""}`}
            >
              <AnimatedText text={t("hero.title1")} delay={0.5} />
              <br />
              <span className="italic font-light">
                <AnimatedText text={t("")} delay={1.1} />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <motion.p
              className={`text-lg md:text-xl text-white/90 mb-12 leading-relaxed ${isRTL ? "font-arabic" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              {t("hero.subtitle")}
            </motion.p>
          </Reveal>
          <Reveal delay={0.3}>
            <motion.div
              className={`inline-flex px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm md:text-base mb-8 border border-white/20 shadow-lg ${isRTL ? "font-arabic" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=31.9252722,35.0683865"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center text-center no-underline cursor-pointer hover:bg-white/5 rounded-full px-2 py-1 transition-colors ${isRTL ? "" : ""}`}
              >
                <span className="text-[11px] md:text-xs mb-1 underline decoration-dotted decoration-white/60 hover:decoration-white transition">
                  {t("location.directions")}
                </span>
                <span className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span>{t("location.address")}</span>
                </span>
              </a>
            </motion.div>
          </Reveal>
        </div>
      </motion.div>

      {/* Info Strip */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <BlurPanel className="mx-6 mb-6 px-6 py-4 bg-black/24 backdrop-blur-md border-white/20">
          <div className={`flex items-center justify-center gap-6 text-white/90 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-green-400" />
              <span className={`text-sm ${isRTL ? "font-arabic" : ""}`}>{t("hero.freeShipping")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className={`text-sm ${isRTL ? "font-arabic" : ""}`}>{t("hero.fastDelivery")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className={`text-sm ${isRTL ? "font-arabic" : ""}`}>{t("hero.qualityGuarantee")}</span>
            </div>
          </div>
        </BlurPanel>
      </motion.div>
    </section>
  )
}
