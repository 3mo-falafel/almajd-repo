import { query } from './config'

export async function getCartItems(sessionId: string) {
  try {
    const result = await query(`
      SELECT 
        ci.id,
        ci.size,
        ci.color,
        ci.quantity,
        p.id as product_id,
        p.name,
        p.price,
        p.original_price,
        p.images,
        p.category,
        p.subcategory,
        p.sizes,
        p.colors,
        p.stock_quantity,
        p.description
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.session_id = $1
    `, [sessionId])

    return result.rows.map((item: any) => ({
      product: {
        id: item.product_id.toString(),
        name: item.name,
        price: parseFloat(item.price),
        originalPrice: item.original_price ? parseFloat(item.original_price) : undefined,
        image: item.images?.[0] || "/diverse-clothing-rack.png",
        category: item.category,
        subcategory: item.subcategory,
        sizes: item.sizes,
        colors: item.colors,
        inStock: item.stock_quantity > 0,
        description: item.description,
      },
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    }))
  } catch (error) {
    console.error('Error loading cart:', error)
    return []
  }
}

export async function saveCartItems(sessionId: string, cartItems: any[]) {
  try {
    // Clear existing cart items for this session
    await query('DELETE FROM cart_items WHERE session_id = $1', [sessionId])

    // Insert new cart items
    if (cartItems.length > 0) {
      const values = cartItems.map((item, index) => {
        const baseIndex = index * 5
        return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`
      }).join(',')

      const params = cartItems.flatMap(item => [
        sessionId,
        item.product.id,
        item.size,
        item.color,
        item.quantity
      ])

      await query(`
        INSERT INTO cart_items (session_id, product_id, size, color, quantity)
        VALUES ${values}
      `, params)
    }
  } catch (error) {
    console.error('Error saving cart:', error)
    throw error
  }
}

export async function clearCart(sessionId: string) {
  try {
    await query('DELETE FROM cart_items WHERE session_id = $1', [sessionId])
  } catch (error) {
    console.error('Error clearing cart:', error)
    throw error
  }
}
