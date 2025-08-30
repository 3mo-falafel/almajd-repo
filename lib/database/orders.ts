import { query } from './config'

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
      items: (order.order_items || []).map((it: any) => ({
        ...it,
        image: it.image || (Array.isArray(it.images) ? it.images[0] : null) || null,
        images: it.images || (it.image ? [it.image] : [])
      })),
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
    // Basic validation & logging for diagnostics
    if (!orderData) {
      console.error('[orders] createOrder called with empty orderData')
      throw new Error('Empty order payload')
    }
    const required = ['customerName','phone','address','city','items','total']
    const missing = required.filter(k => !orderData[k] && orderData[k] !== 0)
    if (missing.length) {
      console.error('[orders] Missing required fields:', missing)
    }
    console.log('[orders] Inserting order:', {
      customerName: orderData.customerName,
      phone: orderData.phone,
      itemsCount: Array.isArray(orderData.items) ? orderData.items.length : 'n/a',
      total: orderData.total
    })
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
      JSON.stringify((orderData.items || []).map((it: any) => ({
        product_id: it.product_id,
        product_name: it.product_name,
        product_price: it.product_price,
        size: it.size,
        color: it.color,
        quantity: it.quantity,
        subtotal: it.subtotal,
        image: it.image || null,
        images: it.images || []
      }))),
      orderData.total,
      orderData.status || 'pending'
    ])
    
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
