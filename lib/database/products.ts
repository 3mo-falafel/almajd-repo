import { query } from './config'
import type { Product } from '@/types/product'

// Products functions
export async function getProducts() {
  try {
    const result = await query(`
      SELECT 
        id,
        name,
        description,
        price,
        original_price,
        category,
        subcategory,
        sizes,
        colors,
        images,
        stock_quantity,
        is_featured,
        is_todays_offer,
        low_stock_left,
        created_at
      FROM products 
      ORDER BY created_at DESC
    `)
    
    return result.rows.map((row: any) => ({
      id: row.id.toString(),
      name: row.name,
      price: parseFloat(row.price),
      originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
      description: row.description,
      category: row.category,
      subcategory: row.subcategory,
      sizes: row.sizes || [],
      colors: Array.isArray(row.colors) ? row.colors.map((color: any) => {
        if (typeof color === 'string') {
          try {
            const parsed = JSON.parse(color)
            // If the parsed result is an object with name and hex, return it
            if (parsed && typeof parsed === 'object' && parsed.name && parsed.hex) {
              return parsed
            }
            // If the parsed result is a string (double-encoded JSON), parse again
            if (typeof parsed === 'string') {
              return JSON.parse(parsed)
            }
            return parsed
          } catch {
            return { name: color, hex: '#ffffff' }
          }
        }
        return color
      }) : [],
      images: row.images || [],
      image: row.images?.[0] || "/placeholder.svg",
      materials: ["Turkish Cotton", "Premium Quality"],
      badge: row.is_todays_offer ? "Sale" : row.is_featured ? "Popular" : "",
      inStock: row.stock_quantity > 0,
      isOffer: row.is_todays_offer,
      lowStockLeft: row.low_stock_left,
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function addProduct(productData: any) {
  try {
    const result = await query(`
      INSERT INTO products (
        name, description, price, original_price, category, subcategory,
        sizes, colors, images, stock_quantity, is_featured, is_todays_offer, low_stock_left
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id
    `, [
      productData.name,
      productData.description,
      productData.price,
      productData.originalPrice || productData.price,
      productData.category,
      productData.subcategory,
      productData.sizes,
      productData.colors,
      productData.images || ["/placeholder.svg"],
      productData.stockQuantity || 10,
      productData.isFeatured || false,
      productData.isTodaysOffer || false,
      productData.lowStockEnabled ? (productData.lowStockLeft ?? 0) : null
    ])
    
    return result.rows[0]
  } catch (error) {
    console.error('Error adding product:', error)
    throw error
  }
}

export async function updateProduct(id: string, productData: any) {
  try {
    await query(`
      UPDATE products SET
        name = $1,
        description = $2,
        price = $3,
        original_price = $4,
        category = $5,
        subcategory = $6,
        sizes = $7,
        colors = $8,
        images = $9,
        stock_quantity = $10,
        is_featured = $11,
        is_todays_offer = $12,
        low_stock_left = $13
      WHERE id = $14
    `, [
      productData.name,
      productData.description,
      productData.price,
      productData.originalPrice,
      productData.category,
      productData.subcategory,
      productData.sizes,
      productData.colors,
      productData.images,
      productData.stockQuantity,
      productData.isFeatured,
      productData.isTodaysOffer,
      productData.lowStockEnabled ? (productData.lowStockLeft ?? 0) : null,
      id
    ])
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export async function deleteProduct(id: string) {
  try {
    await query('DELETE FROM products WHERE id = $1', [id])
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

export async function setTodaysOffers(productIds: string[]) {
  try {
    // Remove all current offers
    await query('UPDATE products SET is_todays_offer = false WHERE is_todays_offer = true')
    
    // Set new offers
    if (productIds.length > 0) {
      const placeholders = productIds.map((_, i) => `$${i + 1}`).join(',')
      await query(`UPDATE products SET is_todays_offer = true WHERE id IN (${placeholders})`, productIds)
    }
  } catch (error) {
    console.error('Error setting todays offers:', error)
    throw error
  }
}
