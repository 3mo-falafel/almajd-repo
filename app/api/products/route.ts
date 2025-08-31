import { NextRequest, NextResponse } from 'next/server'
import { getProducts, addProduct, updateProduct, deleteProduct, setTodaysOffers } from '@/lib/database/products'
import { validate as validateUUID } from 'uuid'

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

    // Allow legacy non-UUID IDs (numeric or short strings) instead of rejecting.
    const isUUID = validateUUID(id)
    const idDebug = {
      id,
      length: id.length,
      isUUID,
      charCodes: Array.from(id).map(c => c.charCodeAt(0))
    }
    console.log('[DELETE /api/products] Incoming id diagnostics:', idDebug)

    let deleted: boolean | undefined
    try {
      deleted = await deleteProduct(id)
    } catch (dbErr: any) {
      // Common case: invalid input syntax for type uuid if legacy numeric IDs exist in DB with text/uuid mismatch
      const msg = dbErr?.message || String(dbErr)
      return NextResponse.json({ error: 'Database error deleting product', message: msg, id, hint: 'If this is a legacy non-UUID ID, adjust schema or remove UUID validation.' }, { status: 500 })
    }

    if (!deleted) {
      return NextResponse.json({ error: 'Product not found', id }, { status: 404 })
    }
    return NextResponse.json({ success: true, id })
  } catch (error: any) {
    console.error('Error deleting product:', error?.message || error)
    return NextResponse.json({ error: 'Failed to delete product', details: error?.message }, { status: 500 })
  }
}
