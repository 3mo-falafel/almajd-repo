import { NextRequest, NextResponse } from 'next/server'
import { deleteProduct } from '@/lib/database/products'
import { removeProductFromAllCarts } from '@/lib/database/cart'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawId = searchParams.get('id')
    const force = searchParams.get('force') === 'true'
    const id = rawId?.trim()

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    console.log('[DELETE /api/products/force] Attempting to force delete product ID:', id)

    try {
      if (force) {
        // First remove product from all carts
        const removedCartItems = await removeProductFromAllCarts(id)
        console.log(`[DELETE /api/products/force] Removed product from ${removedCartItems} cart items`)
      }

      // Now delete the product
      const deleted = await deleteProduct(id)
      
      if (!deleted) {
        return NextResponse.json({ error: 'Product not found', id }, { status: 404 })
      }
      
      console.log('[DELETE /api/products/force] Product deleted successfully:', id)
      return NextResponse.json({ 
        success: true, 
        id,
        removedFromCarts: force ? true : false 
      })
    } catch (dbErr: any) {
      const msg = dbErr?.message || String(dbErr)
      console.error('[DELETE /api/products/force] Database error:', {
        id,
        error: msg,
        code: dbErr?.code,
        detail: dbErr?.detail
      })

      // Check if it's a foreign key constraint violation
      if (dbErr?.code === '23503' && !force) {
        return NextResponse.json({ 
          error: 'Cannot delete product', 
          message: 'This product is currently in someone\'s cart. Use force=true to remove it from all carts first.',
          id,
          canForceDelete: true
        }, { status: 409 }) // 409 Conflict
      }

      return NextResponse.json({ 
        error: 'Database error deleting product', 
        message: msg, 
        id 
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Error deleting product:', error?.message || error)
    return NextResponse.json({ error: 'Failed to delete product', details: error?.message }, { status: 500 })
  }
}
