"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "@/types/product"

interface Order {
  id: string
  customerName: string
  phone: string
  address: string
  city: string
  notes?: string
  items: Array<{
    product: Product
    size: string
    color: string
    quantity: number
  }>
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered"
  createdAt: Date
}

interface GalleryItem {
  id: string
  title: string
  titleAr: string
  imageUrl: string
  isActive: boolean
  display_order: number
  createdAt: Date
}

interface AdminContextType {
  isAuthenticated: boolean
  products: Product[]
  orders: Order[]
  todaysOffers: Product[]
  galleryItems: GalleryItem[]
  login: (password: string) => Promise<boolean>
  logout: () => void
  addProduct: (product: any) => Promise<void>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string, force?: boolean) => Promise<void>
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void>
  setTodaysOffers: (productIds: string[]) => Promise<void>
  loadProducts: () => Promise<void>
  loadOrders: () => Promise<void>
  loadGalleryItems: () => Promise<void>
  addGalleryItem: (item: Omit<GalleryItem, "id" | "createdAt">) => Promise<void>
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => Promise<void>
  deleteGalleryItem: (id: string) => Promise<void>
}

const AdminContext = createContext<AdminContextType | null>(null)

export const AVAILABLE_SIZES = {
  clothing: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "6XL"],
  numeric: Array.from({ length: 60 }, (_, i) => (i + 1).toString()),
}

export const AVAILABLE_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff" },
  { name: "Navy Blue", hex: "#1e3a8a" },
  // Removed similar blues: Royal Blue, Sky Blue
  { name: "Light Blue", hex: "#38bdf8" },
  // Removed Teal (too close to greens)
  { name: "Red", hex: "#dc2626" },
  { name: "Burgundy", hex: "#7c2d12" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Green", hex: "#059669" },
  // Removed Emerald (similar green tone)
  { name: "Lime", hex: "#65a30d" },
  { name: "Yellow", hex: "#eab308" },
  // Removed Amber (close to Yellow/Orange)
  { name: "Orange", hex: "#f97316" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Violet", hex: "#8b5cf6" },
  // Removed Indigo (close to existing blues/purples)
  { name: "Gray", hex: "#6b7280" },
  // Removed Slate (near Gray/Navy)
  { name: "Charcoal", hex: "#374151" },
  { name: "Brown", hex: "#92400e" },
  { name: "Tan", hex: "#d2b48c" },
  { name: "Beige", hex: "#f5f5dc" },
  { name: "Cream", hex: "#fffdd0" },
  // Removed Ivory & Khaki (very close to Cream/Beige/Tan)
  { name: "Olive", hex: "#84cc16" },
  { name: "Maroon", hex: "#800000" },
  { name: "Gold", hex: "#ffd700" },
  { name: "Silver", hex: "#c0c0c0" },
  // Removed Bronze (close to Brown/Gold)

  // New distinct & popular fashion colors
  { name: "Coral", hex: "#ff6f61" },       // Vibrant warm pink-orange
  { name: "Lavender", hex: "#b57edc" },    // Soft pastel purple distinct from Violet
  { name: "Mint Green", hex: "#98ff98" },  // Fresh pastel green distinct from Lime/Green
  { name: "Rust", hex: "#b7410e" },        // Earthy red-brown distinct from Orange/Brown
  { name: "Taupe", hex: "#8b7d7b" },       // Neutral mid-tone distinct from Gray/Beige
]

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [todaysOffers, setTodaysOffersState] = useState<Product[]>([])
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])

  useEffect(() => {
    // Check if admin is already logged in
    const adminAuth = localStorage.getItem("adminAuth")
    if (adminAuth === "true") {
      setIsAuthenticated(true)
      loadProducts()
      loadOrders()
      loadGalleryItems()
    }
  }, [])

  const login = async (password: string): Promise<boolean> => {
    if (password === "8252025jibreel") {
      setIsAuthenticated(true)
      localStorage.setItem("adminAuth", "true")
      await loadProducts()
      await loadOrders()
      await loadGalleryItems()
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("adminAuth")
  }

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const formattedProducts = await response.json() as Product[]
      setProducts(formattedProducts)

      // Set today's offers
      const offers = formattedProducts.filter((p) => p.isOffer)
      setTodaysOffersState(offers)
    } catch (error) {
      console.error("Error loading products:", error)
    }
  }

  const loadOrders = async () => {
    try {
      console.log("[v0] Loading orders from database...")
      const response = await fetch('/api/orders')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const formattedOrders = await response.json()
      console.log("[v0] Formatted orders:", formattedOrders)
      setOrders(formattedOrders)
    } catch (error) {
      console.error("[v0] Error loading orders:", error)
      setOrders([]) // Set empty array on error
    }
  }

  const addProduct = async (productData: any) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      if (!response.ok) throw new Error('Failed to add product')
      await loadProducts()
    } catch (error) {
      console.error("Error adding product:", error)
    }
  }

  const updateProduct = async (id: string, productData: any) => {
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...productData })
      })
      if (!response.ok) throw new Error('Failed to update product')
      await loadProducts()
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  const deleteProduct = async (id: string, force: boolean = false) => {
    try {
      const endpoint = force ? '/api/products/force' : '/api/products'
      const url = `${endpoint}?id=${encodeURIComponent(id)}${force ? '&force=true' : ''}`
      const response = await fetch(url, { method: 'DELETE' })
      
      if (!response.ok) {
        let info: any = null
        try { info = await response.json() } catch {}
        console.error('Delete product failed:', response.status, info)
        
        // Handle specific error cases
        if (response.status === 409 && !force) {
          // Conflict - product is in cart, automatically try force delete
          console.log('Product is in cart, attempting force delete...')
          return await deleteProduct(id, true) // Recursively call with force=true
        }
        
        throw new Error(info?.error || `Failed to delete product (${response.status})`)
      }
      
      await loadProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      // Re-throw to let the UI handle the error message
      throw error
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status })
      })
      if (!response.ok) throw new Error('Failed to update order status')
      
      // Update local state
      setOrders((prev: Order[]) => prev.map((order: Order) => (order.id === orderId ? { ...order, status } : order)))
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const setTodaysOffers = async (productIds: string[]) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setTodaysOffers', productIds })
      })
      if (!response.ok) throw new Error('Failed to set todays offers')
      await loadProducts()
    } catch (error) {
      console.error("Error updating today's offers:", error)
    }
  }

  const loadGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery')
      if (!response.ok) throw new Error('Failed to fetch gallery items')
      const formattedItems = await response.json()
      setGalleryItems(formattedItems)
    } catch (error) {
      console.error("Error loading gallery items:", error)
    }
  }

  const addGalleryItem = async (itemData: Omit<GalleryItem, "id" | "createdAt">) => {
    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      })
      if (!response.ok) throw new Error('Failed to add gallery item')
      await loadGalleryItems()
    } catch (error) {
      console.error("Error adding gallery item:", error)
    }
  }

  const updateGalleryItem = async (id: string, itemData: Partial<GalleryItem>) => {
    try {
      const response = await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...itemData })
      })
      if (!response.ok) throw new Error('Failed to update gallery item')
      await loadGalleryItems()
    } catch (error) {
      console.error("Error updating gallery item:", error)
    }
  }

  const deleteGalleryItem = async (id: string) => {
    try {
      const response = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete gallery item')
      await loadGalleryItems()
    } catch (error) {
      console.error("Error deleting gallery item:", error)
    }
  }

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        products,
        orders,
        todaysOffers,
        galleryItems,
        login,
        logout,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        setTodaysOffers,
        loadProducts,
        loadOrders,
        loadGalleryItems,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
