// @ts-nocheck
"use client"

import type React from "react"

import type { ReactElement } from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Star,
  Calendar,
  Upload,
  X,
  ArrowLeft,
  BarChart3,
  Tag,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { AdminLogin } from "@/components/admin-login"
import { useAdmin, AVAILABLE_SIZES, AVAILABLE_COLORS } from "@/contexts/admin-context"
import { useLanguage } from "@/contexts/language-context"
import { AdminProvider } from "@/contexts/admin-context"
import { CATEGORIES } from "@/types/product"
import type { Product } from "@/types/product"
import Link from "next/link"

function AdminDashboardContent(): ReactElement {
  const {
    isAuthenticated,
    products,
    orders,
    todaysOffers,
    galleryItems,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    setTodaysOffers,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
  } = useAdmin()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [orderProductDetails, setOrderProductDetails] = useState<{ [key: string]: any }>({})
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showAddGallery, setShowAddGallery] = useState(false)
  const [editingGallery, setEditingGallery] = useState<any>(null)

  // Unified nav items list (used for desktop + new mobile nav)
  const navItems = [
    { id: "overview", label: t("admin.nav.overview"), icon: BarChart3 },
    { id: "products", label: t("admin.nav.products"), icon: Package },
    { id: "orders", label: t("admin.nav.orders"), icon: ShoppingCart },
    { id: "offers", label: t("admin.nav.offers"), icon: Tag },
    { id: "gallery", label: t("admin.nav.gallery"), icon: ImageIcon },
  ] as const

  useEffect(() => {
    const fetchOrderProductDetails = async () => {
      const productIds = new Set<string>()

      orders.forEach((order) => {
        if (Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            if (item.product_id) {
              productIds.add(item.product_id)
            }
          })
        }
      })

      if (productIds.size > 0) {
        try {
          const { createBrowserClient } = await import("@supabase/ssr")
          const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          )

          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
          const validProductIds = Array.from(productIds).filter((id) => uuidRegex.test(id))

          console.log("[v0] Valid product IDs for fetching:", validProductIds)
          console.log(
            "[v0] Invalid product IDs filtered out:",
            Array.from(productIds).filter((id) => !uuidRegex.test(id)),
          )

          if (validProductIds.length === 0) {
            console.log("[v0] No valid product IDs to fetch")
            return
          }

          const { data: productDetails, error } = await supabase
            .from("products")
            .select("id, name, images, price, description")
            .in("id", validProductIds)

          if (error) {
            console.error("[v0] Error fetching product details:", error)
            return
          }

          const detailsMap: { [key: string]: any } = {}
          productDetails?.forEach((product) => {
            detailsMap[product.id] = product
          })

          setOrderProductDetails(detailsMap)
          console.log("[v0] Fetched product details for orders:", detailsMap)
        } catch (error) {
          console.error("[v0] Error fetching product details:", error)
        }
      }
    }

    if (orders.length > 0) {
      fetchOrderProductDetails()
    }
  }, [orders])

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((order) => order.status === "pending").length,
    totalRevenue: Number(orders.reduce((sum, order) => sum + order.total, 0).toFixed(1)),
  }

  const ProductForm = ({
    product,
    onSave,
    onCancel,
  }: { product?: Product; onSave: (data: any) => void; onCancel: () => void }) => {
    const [formData, setFormData] = useState({
      name: product?.name || "",
      price: product?.price || 0,
      originalPrice: product?.originalPrice || 0,
      description: product?.description || "",
      category: product?.category || "men",
      subcategory: product?.subcategory || "",
      stockQuantity: 10,
      isFeatured: product?.badge === "Popular" || false,
      isTodaysOffer: product?.isOffer || false,
  lowStockEnabled: product?.lowStockLeft ? true : false,
  lowStockLeft: product?.lowStockLeft || 0,
    })

    const [selectedSizes, setSelectedSizes] = useState<string[]>(product?.sizes || [])
    const [selectedColors, setSelectedColors] = useState<any[]>(product?.colors || [])
    const [availableSubcategories, setAvailableSubcategories] = useState<
      { id: string; name: string; nameAr: string }[]
    >([])
    const [uploadedImages, setUploadedImages] = useState<string[]>(product?.images || [])
    const [imageFiles, setImageFiles] = useState<File[]>([])

    const handleCategoryChange = (category: string) => {
      setFormData({ ...formData, category, subcategory: "" })
      const categoryData = CATEGORIES[category as keyof typeof CATEGORIES]
      setAvailableSubcategories(categoryData?.subcategories || [])
    }

    useEffect(() => {
      if (formData.category) {
        const categoryData = CATEGORIES[formData.category as keyof typeof CATEGORIES]
        setAvailableSubcategories(categoryData?.subcategories || [])
      }
    }, [formData.category])

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      // NOTE: We already push each file preview (base64) into uploadedImages in handleImageUpload.
      // Avoid re-reading and concatenating which caused duplicate images.
      const productData = {
        ...formData,
        sizes: selectedSizes,
        colors: selectedColors,
        images: uploadedImages, // use unique list only once
      }
      await onSave(productData)
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []) as File[]
      setImageFiles((prev: File[]) => [...prev, ...files])

      // Create preview URLs
      files.forEach((file: File) => {
        const reader = new FileReader()
        reader.onload = (ev: ProgressEvent<FileReader>) => {
          const result = ev.target?.result
          if (typeof result === "string") {
            setUploadedImages((prev: string[]) => [...prev, result])
          }
        }
        reader.readAsDataURL(file as Blob)
      })
    }

    const removeImage = (index: number) => {
      setUploadedImages((prev: string[]) => prev.filter((_, i) => i !== index))
      setImageFiles((prev: File[]) => prev.filter((_, i) => i !== index))
    }

    return (
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{product ? t("admin.products.edit") : t("admin.products.addNew")}</h2>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t("admin.products.name")}</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t("admin.products.price")}</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t("admin.products.originalPrice")}</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t("admin.products.stockQuantity")}</label>
                <Input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: Number.parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t("admin.products.category")}</label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(CATEGORIES).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t("admin.products.subcategory")}</label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.products.selectSubcategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubcategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name} / {sub.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t("admin.products.description")}</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t("admin.products.images")}</label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {t("admin.products.uploadImages")}
                  </label>
                  <span className="text-sm text-gray-600">{uploadedImages.length} {t("admin.products.imagesSelected")}</span>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t("admin.products.availableSizes")}</label>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t("admin.products.clothingSizes")}</p>
                  <div className="grid grid-cols-5 gap-2">
                    {AVAILABLE_SIZES.clothing.map((size) => (
                      <label key={size} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={selectedSizes.includes(size)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSizes([...selectedSizes, size])
                            } else {
                              setSelectedSizes(selectedSizes.filter((s) => s !== size))
                            }
                          }}
                        />
                        <span className="text-sm">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t("admin.products.numericSizes")}</p>
                  <div className="grid grid-cols-8 gap-2">
                    {AVAILABLE_SIZES.numeric.map((size) => (
                      <label key={size} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={selectedSizes.includes(size)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSizes([...selectedSizes, size])
                            } else {
                              setSelectedSizes(selectedSizes.filter((s) => s !== size))
                            }
                          }}
                        />
                        <span className="text-sm">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t("admin.products.availableColors")}</label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-64 overflow-y-auto">
                {AVAILABLE_COLORS.map((color) => (
                  <label
                    key={color.name}
                    className="flex items-center space-x-3 cursor-pointer p-3 border-2 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                    style={{
                      borderColor: selectedColors.some((c) => c.name === color.name) ? color.hex : "#e5e7eb",
                    }}
                  >
                    <Checkbox
                      checked={selectedColors.some((c) => c.name === color.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedColors([...selectedColors, { name: color.name, hex: color.hex }])
                        } else {
                          setSelectedColors(selectedColors.filter((c) => c.name !== color.name))
                        }
                      }}
                    />
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-sm font-medium">{t(`color.${color.name}`)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: !!checked })}
                />
                <span className="text-sm">{t("admin.products.featured")}</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={formData.isTodaysOffer}
                  onCheckedChange={(checked) => setFormData({ ...formData, isTodaysOffer: !!checked })}
                />
                <span className="text-sm">{t("admin.products.todaysOffer")}</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={formData.lowStockEnabled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, lowStockEnabled: !!checked, lowStockLeft: formData.lowStockLeft || 0 })
                  }
                />
                <span className="text-sm">{t("admin.products.markAsLeft")}</span>
              </label>
              {formData.lowStockEnabled && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-24"
                    value={formData.lowStockLeft}
                    min={0}
                    onChange={(e) => setFormData({ ...formData, lowStockLeft: Number.parseInt(e.target.value) })}
                  />
                  <span className="text-sm text-neutral-600">{t("admin.products.pcsLeft")}</span>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="bg-neutral-900 hover:bg-neutral-800 text-white">
                {product ? t("admin.products.update") : t("admin.products.add")}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                {t("admin.products.cancel")}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )
  }

  const handleDeleteProduct = async (product: Product) => {
    setDeletingProduct(product)
  }

  const confirmDelete = async () => {
    if (!deletingProduct) return

    setIsDeleting(true)
    try {
      console.log("[v0] Deleting product:", deletingProduct.id)
      await deleteProduct(deletingProduct.id)
      console.log("[v0] Product deleted successfully")
      setDeletingProduct(null)
    } catch (error) {
      console.error("[v0] Error deleting product:", error)
      alert("Error deleting product. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelDelete = () => {
    setDeletingProduct(null)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{t("admin.title")}</h1>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("admin.backToStore")}
            </Link>
          </div>
          <Button onClick={logout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            {t("admin.logout")}
          </Button>
        </div>
      </div>

      {/* Mobile top nav (horizontal tab list) */}
      <div className="md:hidden bg-white border-b px-3 py-2 overflow-x-auto sticky top-0 z-30">
        <div className="flex gap-2">
          {navItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm whitespace-nowrap border transition-colors ${
                activeTab === tab.id
                  ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                  : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Desktop side nav */}
        <div className="hidden md:block w-64 bg-white border-r min-h-screen p-4">
          <nav className="space-y-2">
            {navItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id ? "bg-neutral-900 text-white" : "hover:bg-neutral-100"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 p-4 md:p-6">
          {/* Navigation Tabs */}
          {/* <div className="flex gap-4 mb-8 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "products", label: "Products", icon: Package },
              { id: "orders", label: "Orders", icon: ShoppingCart },
              { id: "offers", label: "Today's Offers", icon: Star },
              { id: "delivered", label: "Delivered Orders", icon: Star },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? "bg-neutral-900 text-white" : "bg-white text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div> */}

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">{t("admin.stats.totalProducts")}</p>
                      <p className="text-2xl font-bold text-neutral-900">{stats.totalProducts}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">{t("admin.stats.totalOrders")}</p>
                      <p className="text-2xl font-bold text-neutral-900">{stats.totalOrders}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">{t("admin.stats.pendingOrders")}</p>
                      <p className="text-2xl font-bold text-neutral-900">{stats.pendingOrders}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">{t("admin.stats.totalRevenue")}</p>
                      <p className="text-2xl font-bold text-neutral-900">${stats.totalRevenue.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">{t("admin.recentOrders")}</h2>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-neutral-600">
                          {order.id} • ${order.total}
                        </p>
                      </div>
                      <Badge
                        variant={
                          order.status === "pending"
                            ? "secondary"
                            : order.status === "confirmed"
                              ? "default"
                              : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{t("admin.products.management")}</h2>
                <Button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t("admin.products.add")}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="aspect-[3/4] bg-neutral-100 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium mb-2">{product.name}</h3>
                    <p className="text-sm text-neutral-600 mb-2">${product.price}</p>
                    <p className="text-xs text-neutral-500 mb-3">
                      {product.category} - {product.subcategory}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProduct(product)}
                        className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{t("admin.orders.management")}</h2>
                <div className="flex gap-3">
                  <Button onClick={() => window.location.reload()} variant="outline">
                    {t("admin.orders.refresh")}
                  </Button>
                  <Button onClick={() => setActiveTab("delivered")} variant="outline">
                    {t("admin.orders.viewDelivered")}
                  </Button>
                </div>
              </div>
              {orders.filter((order) => order.status !== "delivered").length === 0 ? (
                <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                  <ShoppingCart className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600">{t("admin.orders.nonePending")}</p>
                  <p className="text-sm text-neutral-500 mt-2">{t("admin.orders.nonePendingSubtitle")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders
                    .filter((order) => order.status !== "delivered")
                    .map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-200"
                      >
                        <div className="p-6 border-b bg-gradient-to-r from-neutral-50 to-neutral-100">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-neutral-900">Order #{order.id.slice(0, 8)}</h3>
                                <Badge
                                  variant={
                                    order.status === "pending"
                                      ? "secondary"
                                      : order.status === "confirmed"
                                        ? "default"
                                        : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {order.status.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-neutral-700">Customer Information</span>
                                  </div>
                                  <p className="text-sm pl-4">
                                    <span className="font-semibold text-neutral-900">{order.customerName}</span>
                                  </p>
                                  <p className="text-sm pl-4 text-neutral-600">📞 {order.phone}</p>
                                  <p className="text-sm pl-4 text-neutral-600">
                                    📍 {order.address}, {order.city}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-neutral-700">Order Details</span>
                                  </div>
                                  <p className="text-sm pl-4 text-neutral-600">
                                    📅{" "}
                                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                                      weekday: "short",
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </p>
                                  <p className="text-sm pl-4 text-neutral-600">
                                    📦 {Array.isArray(order.items) ? order.items.length : 0} items
                                  </p>
                                  {order.notes && <p className="text-sm pl-4 text-neutral-600">�� {order.notes}</p>}
                                </div>
                              </div>
                            </div>
                            <div className="text-right space-y-3">
                              <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                                <p className="text-sm text-neutral-600 mb-1">Total Amount</p>
                                <p className="text-3xl font-bold text-green-600">${order.total.toFixed(2)}</p>
                              </div>
                              <Select
                                value={order.status}
                                onValueChange={(value) => updateOrderStatus(order.id, value as any)}
                              >
                                <SelectTrigger className="w-36 bg-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-6">
                            <Package className="w-5 h-5 text-neutral-600" />
                            <h4 className="text-lg font-semibold text-neutral-900">
                              Ordered Products ({Array.isArray(order.items) ? order.items.length : 0} items)
                            </h4>
                          </div>
                          <div className="space-y-4">
                            {Array.isArray(order.items) &&
                              order.items.map((item: any, idx: number) => {
                                const productDetails = orderProductDetails[item.product_id]
                                const productImage =
                                  productDetails?.images?.[0] ||
                                  `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(item.product_name + " Turkish clothing fashion")}`

                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-6 p-5 bg-gradient-to-r from-neutral-50 to-white rounded-lg border border-neutral-200 hover:shadow-md transition-shadow"
                                  >
                                    <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border">
                                      <img
                                        src={productImage || "/placeholder.svg"}
                                        alt={item.product_name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement
                                          target.src = `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(item.product_name + " Turkish fashion")}`
                                        }}
                                      />
                                    </div>

                                    <div className="flex-1 space-y-2">
                                      <h5 className="text-lg font-semibold text-neutral-900">{item.product_name}</h5>
                                      <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                          <span className="text-sm font-medium text-blue-700">{t("admin.orders.size")}: {item.size}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full">
                                          <div
                                            className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                                            style={{
                                              backgroundColor:
                                                item.color.toLowerCase() === "navy"
                                                  ? "#1e3a8a"
                                                  : item.color.toLowerCase() === "gray"
                                                    ? "#6b7280"
                                                    : item.color.toLowerCase() === "black"
                                                      ? "#000000"
                                                      : item.color.toLowerCase() === "white"
                                                        ? "#ffffff"
                                                        : "#6b7280",
                                            }}
                                          ></div>
                                          <span className="text-sm font-medium text-purple-700">{t("admin.orders.color")}: {t(`color.${item.color}`)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                          <span className="text-sm font-medium text-green-700">{t("admin.orders.qty")}: {item.quantity}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                                        <span>
                                          {t("admin.orders.unitPrice")}: {" "}
                                          <span className="font-semibold text-neutral-900">${item.product_price}</span>
                                        </span>
                                        <span>•</span>
                                        <span>
                                          {t("admin.orders.productId")}: {" "}
                                          <span className="font-mono text-xs">{item.product_id?.slice(0, 8)}</span>
                                        </span>
                                      </div>
                                    </div>

                                    <div className="text-right space-y-1">
                                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                        <p className="text-xs text-green-600 mb-1">{t("admin.orders.subtotal")}</p>
                                        <p className="text-xl font-bold text-green-700">${item.subtotal.toFixed(2)}</p>
                                      </div>
                                      {item.quantity > 1 && (
                                        <p className="text-xs text-neutral-500">
                                          ${item.product_price} × {item.quantity}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                          </div>

                          <div className="mt-6 pt-6 border-t border-neutral-200">
                            <div className="flex justify-between items-center bg-neutral-50 rounded-lg p-4">
                              <span className="text-lg font-semibold text-neutral-900">{t("admin.orders.orderTotal")}</span>
                              <span className="text-2xl font-bold text-green-600">${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Today's Offers Tab */}
          {activeTab === "offers" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">{t("admin.offers.management")}</h2>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-medium mb-4">{t("admin.offers.selectProducts")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <label
                      key={product.id}
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-neutral-50"
                    >
                      <input
                        type="checkbox"
                        checked={todaysOffers.some((offer) => offer.id === product.id)}
                        onChange={async (e) => {
                          const currentOfferIds = todaysOffers.map((offer) => offer.id)
                          if (e.target.checked) {
                            await setTodaysOffers([...currentOfferIds, product.id])
                          } else {
                            await setTodaysOffers(currentOfferIds.filter((id) => id !== product.id))
                          }
                        }}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-neutral-600">${product.price}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Delivered Orders Tab */}
          {activeTab === "delivered" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{t("admin.delivered.title")}</h2>
                <Button onClick={() => setActiveTab("orders")} variant="outline">
                  {t("admin.delivered.back")}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">{t("admin.delivered.orders")}</p>
                      <p className="text-2xl font-bold text-neutral-900">
                        {orders.filter((order) => order.status === "delivered").length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">{t("admin.delivered.revenue")}</p>
                      <p className="text-2xl font-bold text-neutral-900">
                        $
                        {orders
                          .filter((order) => order.status === "delivered")
                          .reduce((sum, order) => sum + order.total, 0)
                          .toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">{t("admin.delivered.estimatedProfit")}</p>
                      <p className="text-2xl font-bold text-neutral-900">
                        $
                        {(
                          orders
                            .filter((order) => order.status === "delivered")
                            .reduce((sum, order) => sum + order.total, 0) * 0.7
                        ).toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {orders.filter((order) => order.status === "delivered").length === 0 ? (
                <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                  <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600">{t("admin.delivered.none")}</p>
                  <p className="text-sm text-neutral-500 mt-2">{t("admin.delivered.noneSubtitle")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders
                    .filter((order) => order.status === "delivered")
                    .map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-200"
                      >
                        <div className="p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold text-neutral-900">
                                  Order #{order.id.slice(0, 8)}
                                </h3>
                                <Badge className="bg-green-100 text-green-800 border-green-200">✅ DELIVERED</Badge>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm">
                                  <span className="font-medium">Customer:</span>{" "}
                                  <span className="text-green-700 font-semibold">{order.customerName}</span>
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Completed:</span>{" "}
                                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right space-y-2">
                              <div className="bg-white rounded-lg p-3 shadow-sm border border-green-200">
                                <p className="text-sm text-neutral-600">Revenue</p>
                                <p className="text-xl font-bold text-green-600">${order.total.toFixed(1)}</p>
                              </div>
                              <div className="bg-green-100 rounded-lg p-2 border border-green-200">
                                <p className="text-xs text-green-700">Est. Profit: ${(order.total * 0.7).toFixed(1)}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="space-y-3">
                            {Array.isArray(order.items) &&
                              order.items.map((item: any, idx: number) => {
                                const productDetails = orderProductDetails[item.product_id]
                                const productImage =
                                  productDetails?.images?.[0] ||
                                  `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(item.product_name + " Turkish fashion delivered")}`

                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100"
                                  >
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-green-200">
                                      <img
                                        src={productImage || "/placeholder.svg"}
                                        alt={item.product_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement
                                          target.src = `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(item.product_name + " Turkish fashion")}`
                                        }}
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-semibold text-sm text-neutral-900">{item.product_name}</p>
                                      <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                          {item.size}
                                        </span>
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                          {item.color}
                                        </span>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                          Qty: {item.quantity}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-sm text-green-600">${item.subtotal.toFixed(2)}</p>
                                      <p className="text-xs text-green-500">
                                        ~${(item.subtotal * 0.7).toFixed(1)} profit
                                      </p>
                                    </div>
                                  </div>
                                )
                              })}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{t("admin.gallery.management")}</h2>
                <Button
                  onClick={() => setShowAddGallery(true)}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t("admin.gallery.addItem")}
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-3 sm:p-4 shadow-sm flex flex-col border border-neutral-100 hover:shadow-md transition"
                  >
                    <div className="relative w-full mb-3 overflow-hidden rounded-lg bg-neutral-100" style={{paddingTop:'65%'}}>
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-medium text-sm sm:text-base mb-1 line-clamp-2 min-h-[2.25rem]">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-600 mb-2 text-right line-clamp-2" dir="rtl">
                      {item.titleAr}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] sm:text-xs text-neutral-500">#{item.display_order}</span>
                      <span
                        className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-medium ${
                          item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="mt-auto flex gap-1.5 sm:gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingGallery(item)} className="h-8 px-2">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteGalleryItem(item.id)}
                        className="h-8 px-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {showAddProduct && (
        <ProductForm
          onSave={async (data) => {
            await addProduct(data)
            setShowAddProduct(false)
          }}
          onCancel={() => setShowAddProduct(false)}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSave={async (data) => {
            await updateProduct(editingProduct.id, data)
            setEditingProduct(null)
          }}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      {deletingProduct && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Delete Product</h3>
                <p className="text-neutral-600">
                  Are you sure you want to delete "{deletingProduct.name}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={cancelDelete}
                  variant="outline"
                  className="flex-1 bg-transparent"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Gallery Form Modals */}
      {showAddGallery && (
        <GalleryForm
          galleryItems={galleryItems}
          onSave={async (data) => {
            await addGalleryItem(data)
            setShowAddGallery(false)
          }}
          onCancel={() => setShowAddGallery(false)}
        />
      )}

      {editingGallery && (
        <GalleryForm
          galleryItems={galleryItems}
          item={editingGallery}
          onSave={async (data) => {
            await updateGalleryItem(editingGallery.id, data)
            setEditingGallery(null)
          }}
          onCancel={() => setEditingGallery(null)}
        />
      )}
    </div>
  )
}

const GalleryForm = ({
  item,
  onSave,
  onCancel,
  galleryItems,
}: {
  item?: any
  onSave: (data: any) => Promise<void>
  onCancel: () => void
  galleryItems: any[]
}) => {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    titleAr: item?.titleAr || "",
    imageUrl: item?.imageUrl || "",
    isActive: item?.isActive ?? true,
    display_order: item?.display_order || galleryItems.length + 1,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState(item?.imageUrl || "")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewUrl(result)
        setFormData({ ...formData, imageUrl: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h2 className="text-xl font-semibold mb-4">{item ? "Edit Gallery Item" : "Add Gallery Item"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title (English)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title (Arabic)</label>
              <input
                type="text"
                value={formData.titleAr}
                onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                className="w-full p-3 border rounded-lg text-right"
                dir="rtl"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="gallery-image-upload"
                />
                <label
                  htmlFor="gallery-image-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </label>
              </div>

              {previewUrl && (
                <div className="relative">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) })}
                className="w-full p-3 border rounded-lg"
                min="1"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Active
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white">
              {item ? "Update" : "Add"} Gallery Item
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function AdminPage() {
  return (
    <AdminProvider>
      <AdminDashboardContent />
    </AdminProvider>
  )
}
