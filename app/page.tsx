"use client"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { MainCategories } from "@/components/main-categories"
import { TodaysOffers } from "@/components/todays-offers"
import { CollectionStrip } from "@/components/collection-strip"
import { MaterialsSection } from "@/components/materials-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
  <Header />
      <HeroSection />
      <MainCategories />
      <TodaysOffers />
      <CollectionStrip />
      <MaterialsSection />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
