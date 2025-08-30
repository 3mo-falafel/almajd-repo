"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { Product, CartItem } from "@/types/product"

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: { product: Product; size: string; color: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addItem: (product: Product, size: string, color: string, quantity: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
} | null>(null)

function getSessionId(): string {
  if (typeof window === "undefined") return "server-session"

  let sessionId = localStorage.getItem("cart_session_id")
  if (!sessionId) {
    sessionId = "session_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
    localStorage.setItem("cart_session_id", sessionId)
  }
  return sessionId
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_ITEMS":
      return { ...state, items: action.payload }

    case "ADD_ITEM": {
      const { product, size, color, quantity } = action.payload
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === product.id && item.size === size && item.color === color,
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += quantity
        return { ...state, items: updatedItems }
      }

      const newItem: CartItem = { product, size, color, quantity }
      return { ...state, items: [...state.items, newItem] }
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((_, index) => index.toString() !== action.payload),
      }
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((_, index) => index.toString() !== id),
        }
      }

      const updatedItems = state.items.map((item, index) => (index.toString() === id ? { ...item, quantity } : item))
      return { ...state, items: updatedItems }
    }

    case "CLEAR_CART":
      return { ...state, items: [] }

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen }

    case "OPEN_CART":
      return { ...state, isOpen: true }

    case "CLOSE_CART":
      return { ...state, isOpen: false }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    isLoading: false,
  })

  useEffect(() => {
    loadCartFromDatabase()
  }, [])

  useEffect(() => {
    if (state.items.length > 0) {
      saveCartToDatabase()
    }
  }, [state.items])

  const loadCartFromDatabase = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const sessionId = getSessionId()

      const response = await fetch(`/api/cart?sessionId=${sessionId}`)
      if (!response.ok) throw new Error('Failed to fetch cart items')
      const formattedItems = await response.json() as CartItem[]
      dispatch({ type: "SET_ITEMS", payload: formattedItems })
    } catch (error) {
      console.error("[v0] Error loading cart:", error)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const saveCartToDatabase = async () => {
    try {
      const sessionId = getSessionId()
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, cartItems: state.items })
      })
      if (!response.ok) throw new Error('Failed to save cart items')
    } catch (error) {
      console.error("[v0] Error saving cart:", error)
    }
  }

  const addItem = async (product: Product, size: string, color: string, quantity: number) => {
    dispatch({ type: "ADD_ITEM", payload: { product, size, color, quantity } })
  }

  const removeItem = async (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = async (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = async () => {
    try {
      const sessionId = getSessionId()
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, action: 'clear' })
      })
      if (!response.ok) throw new Error('Failed to clear cart')
      dispatch({ type: "CLEAR_CART" })
    } catch (error) {
      console.error("[v0] Error clearing cart:", error)
    }
  }

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" })
  }

  const openCart = () => {
    dispatch({ type: "OPEN_CART" })
  }

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" })
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
