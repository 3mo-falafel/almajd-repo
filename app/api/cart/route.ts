import { NextRequest, NextResponse } from 'next/server'
import { getCartItems, saveCartItems, clearCart } from '@/lib/database/cart'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }
    
    const cartItems = await getCartItems(sessionId)
    return NextResponse.json(cartItems)
  } catch (error) {
    console.error('Error fetching cart items:', error)
    return NextResponse.json({ error: 'Failed to fetch cart items' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, cartItems, action } = await request.json()
    
    if (action === 'clear') {
      await clearCart(sessionId)
      return NextResponse.json({ success: true })
    }
    
    await saveCartItems(sessionId, cartItems)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving cart items:', error)
    return NextResponse.json({ error: 'Failed to save cart items' }, { status: 500 })
  }
}
