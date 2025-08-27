import type React from "react";
import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { LanguageProvider } from "@/contexts/language-context";
import { AdminProvider } from "@/contexts/admin-context";
import { CartSidebar } from "@/components/cart-sidebar";
import { CartButton } from "@/components/cart-button";
import { LanguageToggle } from "@/components/language-toggle";

// Load fonts via next/font/google
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Almajd Turkey Clothes | المجد للألبسة التركية",
  description: "Premium Turkish fashion for the whole family - Men, Women, Boys, Girls",
  generator: "v0.app",
  alternates: {
    canonical: "https://almajd-turkey-clothes.example/",
  },
  openGraph: {
    siteName: "Almajd Turkey Clothes",
    title: "Premium Turkish Fashion | Almajd Turkey Clothes | المجد للألبسة التركية",
    description: "Premium Turkish fashion for the whole family - Men, Women, Boys, Girls",
    type: "website",
    url: "https://almajd-turkey-clothes.example/",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/opengraph-katachi.jpg-7vz2r3hxZA6woukGOmH115Fg7Piyjs.jpeg",
        alt: "Almajd Turkey Clothes — Premium Turkish fashion for the whole family",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Turkish Fashion | Almajd Turkey Clothes | المجد للألبسة التركية",
    description: "Premium Turkish fashion for the whole family - Men, Women, Boys, Girls",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/opengraph-katachi.jpg-7vz2r3hxZA6woukGOmH115Fg7Piyjs.jpeg",
        alt: "Almajd Turkey Clothes — Premium Turkish fashion for the whole family",
      },
    ],
    site: "@almajdturkey",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cairo.variable} antialiased`}>
      <body className="font-sans bg-neutral-50 text-neutral-900 overflow-x-hidden">
        <LanguageProvider>
          <AdminProvider>
            <CartProvider>
              {children}
              <CartSidebar />
              <CartButton variant="floating" />
              <LanguageToggle variant="floating" />
            </CartProvider>
          </AdminProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
