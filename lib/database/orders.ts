import { query } from './config'
import { updateProductStock } from './products'

export async function getOrders() {
  try {
    const result = await query(`
      SELECT 
        id,
        customer_name,
        customer_phone,
        customer_address,
        customer_city,
        customer_notes,
        order_items,
        total_amount,
        status,
        created_at
      FROM orders 
      ORDER BY created_at DESC
    `)

    return result.rows.map((order: any) => ({
      id: order.id.toString(),
      customerName: order.customer_name,
      phone: order.customer_phone,
      address: order.customer_address,
      city: order.customer_city || "N/A",
      notes: order.customer_notes,
      items: order.order_items || [],
      total: parseFloat(order.total_amount),
      status: order.status,
      createdAt: new Date(order.created_at),
    }))
  } catch (error) {
    console.error('Error loading orders:', error)
    return []
  }
}

export async function createOrder(orderData: any) {
  try {
    // Start a transaction-like approach by creating the order first
    const result = await query(`
      INSERT INTO orders (
        customer_name, customer_phone, customer_address, customer_city,
        customer_notes, order_items, total_amount, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [
      orderData.customerName,
      orderData.phone,
      orderData.address,
      orderData.city,
      orderData.notes,
      JSON.stringify(orderData.items),
      orderData.total,
      orderData.status || 'pending'
    ])
    
    const orderId = result.rows[0].id
    
    // Update stock for each product in the order
    for (const item of orderData.items) {
      const productId = item.productId
      const quantity = item.quantity
      
      if (productId && quantity > 0) {
        console.log(`[Stock] Reducing stock for product ${productId} by ${quantity}`)
        await updateProductStock(productId, quantity)
      }
    }
    
    console.log(`[Order] Created order ${orderId} and updated stock for ${orderData.items.length} items`)
    return result.rows[0]
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await query('UPDATE orders SET status = $1 WHERE id = $2', [status, orderId])
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}
