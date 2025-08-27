import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency formatting (default to Israeli Shekel - ILS)
export function formatCurrency(
  value: number,
  locale: string = typeof navigator !== "undefined" ? navigator.language : "en-US",
  currency: string = "ILS",
) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    // Fallback simple formatting with symbol ₪
    return `₪${value.toFixed(2)}`
  }
}
