"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, CreditCard, Truck, Shield } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context"
import { formatCurrency } from "@/lib/utils"
import { Reveal } from "@/components/reveal"

interface CheckoutForm {
  name: string
  phone: string
  address: string
  city: string
  notes: string
}

export default function CheckoutPage() {
  const { state, getTotalPrice, clearCart } = useCart()
  const { t, isRTL } = useLanguage()
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [shippingMethod, setShippingMethod] = useState<"pickup" | "village" | "westbank" | "jerusalem" | "occupied" | "">("")

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderItems = state.items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      }))

      // Shipping fee mapping
      const shippingFees: Record<string, number> = {
        pickup: 0,
        village: 5,
        westbank: 20,
        jerusalem: 30,
        occupied: 70,
      }
      const shippingFee = shippingFees[shippingMethod] ?? 0

      const customerInfo = {
        name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        notes: (form.notes ? form.notes + "\n" : "") + `Shipping Method: ${shippingMethod || "not_selected"} | Shipping Fee: ${shippingFee}`
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerInfo,
          items: state.items,
          shipping_method: shippingMethod,
          total_amount: getTotalPrice() + shippingFee
        })
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const data = await response.json()
      console.log("[v0] Order saved successfully:", data)

      // Clear the cart after successful order
      await clearCart()
      setOrderPlaced(true)
    } catch (error) {
      console.error("Error placing order:", error)
      alert("There was an error placing your order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const requireAddress = shippingMethod !== "pickup"
  const isFormValid =
    form.name &&
    form.phone &&
    shippingMethod &&
    (requireAddress ? form.address && form.city : true)

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <Header />
        <div className="pt-20 lg:pt-24">
          <div className="container-custom py-12">
            <div className="max-w-md mx-auto text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-4">{t("checkout.orderSuccess")}</h1>
              <p className="text-neutral-600 mb-8">{t("checkout.orderSuccessMessage")}</p>
              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-neutral-900 hover:bg-neutral-800 text-white"
              >
                {t("checkout.continueShopping")}
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (state.items.length === 0) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <Header />
        <div className="pt-20 lg:pt-24">
          <div className="container-custom py-12">
            <div className="max-w-md mx-auto text-center">
              <h1 className="text-2xl font-bold text-neutral-900 mb-4">{t("checkout.cartEmpty")}</h1>
              <p className="text-neutral-600 mb-8">{t("checkout.cartEmptyMessage")}</p>
              <Button
                onClick={() => (window.location.href = "/products")}
                className="bg-neutral-900 hover:bg-neutral-800 text-white"
              >
                {t("checkout.browseProducts")}
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <Header />

      <div className="pt-20 lg:pt-24">
        <div className="container-custom py-12">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900">{t("checkout.title")}</h1>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Order Summary */}
            <div>
              <Reveal>
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-6">{t("checkout.orderSummary")}</h2>
                  <div className="space-y-4">
                    {state.items.map((item, index) => (
                      <div key={`${item.product.id}-${item.size}-${item.color}-${index}`} className="flex gap-4">
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-neutral-900">{item.product.name}</h3>
                          <p className="text-sm text-neutral-600">
                            {t("products.size")}: {item.size} • {t("products.color")}: {item.color}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-neutral-600">{t("cart.quantity")} {item.quantity}</span>
                            <span className="font-semibold">{formatCurrency(item.product.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-neutral-200 mt-6 pt-6 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">{t("shipping.subtotal")}</span>
                      <span>{formatCurrency(getTotalPrice())}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">{t("shipping.fee")}</span>
                      <span>
                        {shippingMethod
                          ? (() => {
                              const fees: Record<string, number> = { pickup: 0, village: 5, westbank: 20, jerusalem: 30, occupied: 70 }
                              const fee = fees[shippingMethod] ?? 0
                              return fee === 0 ? t("shipping.free") : formatCurrency(fee)
                            })()
                          : "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-neutral-100">
                      <span>{t("shipping.total")}</span>
                      <span>
                        {formatCurrency(
                          getTotalPrice() +
                            (shippingMethod
                              ? { pickup: 0, village: 5, westbank: 20, jerusalem: 30, occupied: 70 }[shippingMethod]
                              : 0),
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Delivery Info */}
              <Reveal delay={0.1}>
                <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">{t("checkout.deliveryInfo")}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-green-500" />
            <span className="text-sm text-neutral-600">{t("checkout.freeDelivery")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-neutral-600">{t("checkout.cashOnDelivery")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-amber-500" />
            <span className="text-sm text-neutral-600">{t("checkout.qualityGuarantee")}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Checkout Form */}
            <div>
              <Reveal delay={0.2}>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-6">{t("checkout.deliveryDetails")}</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Shipping Method */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t("shipping.method")} *
                      </label>
                      <div className="grid gap-3">
                        {[
                          { key: "pickup", title: t("shipping.pickup"), desc: t("shipping.pickupDescription") },
                          { key: "village", title: t("shipping.village"), desc: t("shipping.villageDescription") },
                          { key: "westbank", title: t("shipping.westbank"), desc: t("shipping.westbankDescription") },
                          { key: "jerusalem", title: t("shipping.jerusalem"), desc: t("shipping.jerusalemDescription") },
                          { key: "occupied", title: t("shipping.occupied"), desc: t("shipping.occupiedDescription") },
                        ].map((opt) => {
                          const selected = shippingMethod === opt.key
                          return (
                            <button
                              type="button"
                              key={opt.key}
                              onClick={() => setShippingMethod(opt.key as any)}
                              className={`text-left p-4 border rounded-xl transition-all ${
                                selected
                                  ? "border-neutral-900 bg-neutral-900 text-white shadow"
                                  : "border-neutral-300 hover:border-neutral-500 bg-white"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className={`font-medium mb-1 ${selected ? "text-white" : "text-neutral-900"}`}>{
                                    opt.title
                                  }</p>
                                  <p className={`text-xs leading-relaxed ${selected ? "text-white/80" : "text-neutral-600"}`}>{
                                    opt.desc
                                  }</p>
                                </div>
                                <div
                                  className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                                    selected
                                      ? "bg-white border-white"
                                      : "border-neutral-400 group-hover:border-neutral-600"
                                  }`}
                                >
                                  {selected && <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">{t("checkout.fullName")} *</label>
                      <Input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder={t("checkout.fullName")}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">{t("checkout.phoneNumber")} *</label>
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder={t("checkout.phoneNumber")}
                        required
                      />
                    </div>

                    {requireAddress && (
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          {t("checkout.deliveryAddress")} *
                        </label>
                        <Textarea
                          value={form.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder={t("checkout.deliveryAddress")}
                          rows={3}
                          required={requireAddress}
                        />
                      </div>
                    )}

                    {requireAddress && (
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">{t("checkout.city")} *</label>
                        <Input
                          type="text"
                          value={form.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder={t("checkout.city")}
                          required={requireAddress}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t("checkout.orderNotes")} ({t("common.optional") || "Optional"})
                      </label>
                      <Textarea
                        value={form.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        placeholder={t("checkout.orderNotesPlaceholder")}
                        rows={2}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-3 mt-6"
                    >
                      {isSubmitting ? t("checkout.placingOrder") : t("checkout.placeOrder")}
                    </Button>
                  </form>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
