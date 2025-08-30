"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Reveal } from "./reveal"
import { AnimatedText } from "./animated-text"
import { useLanguage } from "@/contexts/language-context"

interface GalleryItem {
  id: string
  title: string
  titleAr: string
  imageUrl: string
  display_order: number
  isActive: boolean
}

export function MaterialsSection() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const { language } = useLanguage()

  useEffect(() => {
    const loadGalleryItems = async () => {
      try {
        const response = await fetch('/api/gallery')
        if (!response.ok) {
          throw new Error('Failed to fetch gallery items')
        }
        
        const data = await response.json()
        const activeItems = data.filter((item: GalleryItem) => item.isActive)
        
        if (activeItems.length > 0) {
          setGalleryItems(activeItems)
        }
      } catch (error) {
        console.error("Error loading gallery items:", error)
      }
    }

    loadGalleryItems()
  }, [])

  // Auto-cycle logic with reset capability
  const startAutoCycle = useCallback(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current)
    if (galleryItems.length === 0) return
    autoTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryItems.length)
    }, 5000)
  }, [galleryItems.length])

  useEffect(() => {
    startAutoCycle()
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current)
    }
  }, [startAutoCycle])

  const goTo = useCallback((idx: number) => {
    setCurrentIndex((idx + galleryItems.length) % galleryItems.length)
    startAutoCycle() // restart timer after manual navigation
  }, [galleryItems.length, startAutoCycle])

  const handlePrev = () => goTo(currentIndex - 1)
  const handleNext = () => goTo(currentIndex + 1)

  // Touch swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStartRef.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStartRef.current.x
    const dy = t.clientY - touchStartRef.current.y
    if (Math.abs(dx) > 50 && Math.abs(dy) < 80) {
      if (dx > 0) handlePrev()
      else handleNext()
    }
    touchStartRef.current = null
  }

  // Keyboard accessibility (left/right arrows) when section focused
  const sectionRef = useRef<HTMLElement | null>(null)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault(); handlePrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault(); handleNext()
    }
  }

  if (galleryItems.length === 0) {
    return (
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-100"
        id="gallery"
      >
        <div className="text-center">
          <p className="text-gray-500">Loading gallery...</p>
        </div>
      </section>
    )
  }

  const currentItem = galleryItems[currentIndex]

  // Character-splitting animation removed; shared AnimatedText handles Arabic shaping safely.

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative flex justify-center py-16 sm:py-20 bg-white"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Materials Gallery"
    >
      {/* Wrapper makes gallery smaller than full screen and adds borders */}
  <div className="relative mx-auto w-full sm:w-[92%] md:w-[85%] lg:w-[70%] max-w-5xl aspect-[4/3] md:aspect-[16/9] max-h-[85vh] min-h-[260px] border border-neutral-200 rounded-2xl shadow-lg overflow-hidden bg-white">
        {/* Slide background */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              <Image
                src={currentItem.imageUrl || "/placeholder.svg"}
                alt={language === "ar" ? currentItem.titleAr : currentItem.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 70vw, 900px"
              />
            </motion.div>
          </AnimatePresence>
          {/* Light overlay to brighten image (was dark/black) */}
          <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]" />
          {/* Subtle light ring */}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-neutral-200/70" />
        </div>

        {/* Title */}
  <div className="absolute top-6 sm:top-10 left-0 right-0 z-10 pointer-events-none px-4">
          <Reveal>
            <div className="text-center text-neutral-900">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={currentItem.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="font-bold tracking-tight mb-2 sm:mb-4 text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
                >
                  <AnimatedText text={language === "ar" ? currentItem.titleAr : currentItem.title} delay={0.15} />
                </motion.h2>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        {/* Navigation buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 z-20">
          <button
            onClick={handlePrev}
            aria-label="Previous"
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-black/35 hover:bg-black/55 text-white backdrop-blur-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button
            onClick={handleNext}
            aria-label="Next"
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-black/35 hover:bg-black/55 text-white backdrop-blur-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-30">
          <Reveal delay={0.05}>
            <div className="flex justify-center gap-1.5 sm:gap-2">
              {galleryItems.map((_, index) => (
                <motion.button
                  key={index}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-white" : "bg-white/35"}`}
                  onClick={() => goTo(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
