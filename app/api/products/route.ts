import { NextRequest, NextResponse } from 'next/server'
import { getProducts, addProduct, updateProduct, deleteProduct, setTodaysOffers } from '@/lib/database/products'

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()
    
    if (productData.action === 'setTodaysOffers') {
      await setTodaysOffers(productData.productIds)
      return NextResponse.json({ success: true })
    }
    
    const result = await addProduct(productData)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error adding product:', error)
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...productData } = await request.json()
    await updateProduct(id, productData)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawId = searchParams.get('id')
    const id = rawId?.trim()

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    console.log('[DELETE /api/products] Attempting to delete product ID:', id)

    let deleted: boolean | undefined
    try {
      deleted = await deleteProduct(id)
    } catch (dbErr: any) {
      const msg = dbErr?.message || String(dbErr)
      console.error('[DELETE /api/products] Database error:', {
        id,
        error: msg,
        code: dbErr?.code,
        detail: dbErr?.detail
      })

      // Check if it's a foreign key constraint violation (product is in cart)
      if (dbErr?.code === '23503') {
        return NextResponse.json({ 
          error: 'Cannot delete product', 
          message: 'This product is currently in someone\'s cart and cannot be deleted. Please try again later or clear cart items first.',
          id 
        }, { status: 409 }) // 409 Conflict
      }

      return NextResponse.json({ 
        error: 'Database error deleting product', 
        message: msg, 
        id 
      }, { status: 500 })
    }

    if (!deleted) {
      return NextResponse.json({ error: 'Product not found', id }, { status: 404 })
    }
    
    console.log('[DELETE /api/products] Product deleted successfully:', id)
    return NextResponse.json({ success: true, id })
  } catch (error: any) {
    console.error('Error deleting product:', error?.message || error)
    return NextResponse.json({ error: 'Failed to delete product', details: error?.message }, { status: 500 })
  }
}
