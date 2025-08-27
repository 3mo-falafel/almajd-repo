"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
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
  deleteProduct: (id: string) => Promise<void>
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
  numeric: ["20", "22", "24", "26", "28", "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50"],
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
  const supabase = createClient()

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
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

      if (error) throw error

  const formattedProducts: Product[] = data.map((product: any) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.original_price,
        description: product.description,
        category: product.category,
        subcategory: product.subcategory,
        sizes: product.sizes || [],
        colors: product.colors || [],
        images: product.images || [],
        image: product.images?.[0] || "/placeholder.svg",
        materials: ["Turkish Cotton", "Premium Quality"],
        badge: product.is_todays_offer ? "Sale" : product.is_featured ? "Popular" : "",
        inStock: product.stock_quantity > 0,
        isOffer: product.is_todays_offer,
  lowStockLeft: product.low_stock_left ?? undefined,
      }))

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
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Error loading orders:", error)
        throw error
      }

      console.log("[v0] Raw orders data:", data)

  const formattedOrders: Order[] = data.map((order: any) => ({
        id: order.id,
        customerName: order.customer_name,
        phone: order.customer_phone,
        address: order.customer_address,
        city: order.customer_city || "N/A",
        notes: order.customer_notes,
        items: order.order_items || [],
        total: Number(order.total_amount),
        status: order.status,
        createdAt: new Date(order.created_at),
      }))

      console.log("[v0] Formatted orders:", formattedOrders)
      setOrders(formattedOrders)
    } catch (error) {
      console.error("[v0] Error loading orders:", error)
      setOrders([]) // Set empty array on error
    }
  }

  const addProduct = async (productData: any) => {
    try {
      const baseInsert: any = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        original_price: productData.originalPrice || productData.price,
        category: productData.category,
        subcategory: productData.subcategory,
        sizes: productData.sizes,
        colors: productData.colors,
        images: productData.images || ["/placeholder.svg"],
        stock_quantity: productData.stockQuantity || 10,
        is_featured: productData.isFeatured || false,
        is_todays_offer: productData.isTodaysOffer || false,
      }
      if (productData.lowStockEnabled) {
        baseInsert.low_stock_left = productData.lowStockLeft ?? 0
      }

      let { error } = await supabase.from("products").insert(baseInsert)
      if (error && (error as any).message?.includes("low_stock_left")) {
        // Retry without the field if column not yet created
        const retry = { ...baseInsert }
        delete (retry as any).low_stock_left
        ;({ error } = await supabase.from("products").insert(retry))
      }
      if (error) throw error
      await loadProducts()
    } catch (error) {
      console.error("Error adding product:", error)
    }
  }

  const updateProduct = async (id: string, productData: any) => {
    try {
      const baseUpdate: any = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        original_price: productData.originalPrice,
        category: productData.category,
        subcategory: productData.subcategory,
        sizes: productData.sizes,
        colors: productData.colors,
        images: productData.images,
        stock_quantity: productData.stockQuantity,
        is_featured: productData.isFeatured,
        is_todays_offer: productData.isTodaysOffer,
      }
      if (productData.lowStockEnabled) {
        baseUpdate.low_stock_left = productData.lowStockLeft ?? 0
      } else {
        baseUpdate.low_stock_left = null
      }
      let { error } = await supabase.from("products").update(baseUpdate).eq("id", id)
      if (error && (error as any).message?.includes("low_stock_left")) {
        const retry = { ...baseUpdate }
        delete (retry as any).low_stock_left
        ;({ error } = await supabase.from("products").update(retry).eq("id", id))
      }
      if (error) throw error
      await loadProducts()
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) throw error
      await loadProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)

      if (error) throw error

      // Update local state
  setOrders((prev: Order[]) => prev.map((order: Order) => (order.id === orderId ? { ...order, status } : order)))
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const setTodaysOffers = async (productIds: string[]) => {
    try {
      // First, remove all current offers
      await supabase.from("products").update({ is_todays_offer: false }).eq("is_todays_offer", true)

      // Then set new offers
      if (productIds.length > 0) {
        await supabase.from("products").update({ is_todays_offer: true }).in("id", productIds)
      }

      await loadProducts()
    } catch (error) {
      console.error("Error updating today's offers:", error)
    }
  }

  const loadGalleryItems = async () => {
    try {
      const { data, error } = await supabase.from("gallery").select("*").order("display_order", { ascending: true })

      if (error) throw error

  const formattedItems: GalleryItem[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        titleAr: item.title_ar,
        imageUrl: item.image_url,
        isActive: item.is_active,
        display_order: item.display_order,
        createdAt: new Date(item.created_at),
      }))

      setGalleryItems(formattedItems)
    } catch (error) {
      console.error("Error loading gallery items:", error)
    }
  }

  const addGalleryItem = async (itemData: Omit<GalleryItem, "id" | "createdAt">) => {
    try {
      const { error } = await supabase.from("gallery").insert({
        title: itemData.title,
        title_ar: itemData.titleAr,
        image_url: itemData.imageUrl,
        is_active: itemData.isActive,
        display_order: itemData.display_order,
      })

      if (error) throw error
      await loadGalleryItems()
    } catch (error) {
      console.error("Error adding gallery item:", error)
    }
  }

  const updateGalleryItem = async (id: string, itemData: Partial<GalleryItem>) => {
    try {
      const updateData: any = {}
      if (itemData.title !== undefined) updateData.title = itemData.title
      if (itemData.titleAr !== undefined) updateData.title_ar = itemData.titleAr
      if (itemData.imageUrl !== undefined) updateData.image_url = itemData.imageUrl
      if (itemData.isActive !== undefined) updateData.is_active = itemData.isActive
      if (itemData.display_order !== undefined) updateData.display_order = itemData.display_order

      const { error } = await supabase.from("gallery").update(updateData).eq("id", id)

      if (error) throw error
      await loadGalleryItems()
    } catch (error) {
      console.error("Error updating gallery item:", error)
    }
  }

  const deleteGalleryItem = async (id: string) => {
    try {
      const { error } = await supabase.from("gallery").delete().eq("id", id)

      if (error) throw error
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
