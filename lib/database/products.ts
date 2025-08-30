import { query } from './config'
// NOTE: Keep server-side color metadata (duplicate of client list) so we can
// round-trip color names -> objects with hex for the UI without importing any
// client-only files.
const COLOR_METADATA: { name: string; hex: string }[] = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Light Blue', hex: '#38bdf8' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Burgundy', hex: '#7c2d12' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Green', hex: '#059669' },
  { name: 'Lime', hex: '#65a30d' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Purple', hex: '#7c3aed' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Gray', hex: '#6b7280' },
  { name: 'Charcoal', hex: '#374151' },
  { name: 'Brown', hex: '#92400e' },
  { name: 'Tan', hex: '#d2b48c' },
  { name: 'Beige', hex: '#f5f5dc' },
  { name: 'Cream', hex: '#fffdd0' },
  { name: 'Olive', hex: '#84cc16' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Gold', hex: '#ffd700' },
  { name: 'Silver', hex: '#c0c0c0' },
  { name: 'Coral', hex: '#ff6f61' },
  { name: 'Lavender', hex: '#b57edc' },
  { name: 'Mint Green', hex: '#98ff98' },
  { name: 'Rust', hex: '#b7410e' },
  { name: 'Taupe', hex: '#8b7d7b' }
]

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
      // Convert stored color names back to objects with hex (fallback to name as hex if unknown)
      colors: (row.colors || []).map((c: string) => {
        const meta = COLOR_METADATA.find(m => m.name === c)
        return meta ? { name: meta.name, hex: meta.hex } : { name: c, hex: c }
      }),
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
    // Normalize colors to array of names for storage (DB column is text[])
    const colorNames = Array.isArray(productData.colors)
      ? productData.colors.map((c: any) => typeof c === 'string' ? c : (c?.name || c?.color || '')).filter(Boolean)
      : []
    console.log('[products] addProduct: name=%s images=%d colors=%d', productData.name, (productData.images||[]).length, colorNames.length)
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
      colorNames,
      (productData.images && productData.images.length > 0) ? productData.images : ["/placeholder.svg"],
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
    const colorNames = Array.isArray(productData.colors)
      ? productData.colors.map((c: any) => typeof c === 'string' ? c : (c?.name || c?.color || '')).filter(Boolean)
      : []
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
      colorNames,
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
