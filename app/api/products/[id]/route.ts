import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database/config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      WHERE id = $1
    `, [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    const row = result.rows[0]
    const product = {
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
            // Parse the JSON string to get the color object
            const parsed = JSON.parse(color)
            // Ensure it has the expected structure
            if (parsed && typeof parsed === 'object' && parsed.name && parsed.hex) {
              return parsed
            }
            // Fallback for malformed data
            return { name: parsed || color, hex: '#ffffff' }
          } catch {
            // If parsing fails, treat as a simple color name
            return { name: color, hex: '#ffffff' }
          }
        }
        // If it's already an object, return as is
        return color
      }) : [],
      images: row.images || [],
      image: row.images?.[0] || "/placeholder.svg",
      materials: ["Turkish Cotton", "Premium Quality"],
      badge: row.is_todays_offer ? "Sale" : row.is_featured ? "Popular" : "",
      inStock: row.stock_quantity > 0,
      isOffer: row.is_todays_offer,
      lowStockLeft: row.low_stock_left,
    }
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
