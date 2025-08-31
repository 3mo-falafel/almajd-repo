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
    const id = searchParams.get('id')?.trim()

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }
    if (!validateUUID(id)) {
      return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 })
    }

    const deleted = await deleteProduct(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting product:', error?.message || error)
    return NextResponse.json({ error: 'Failed to delete product', details: error?.message }, { status: 500 })
  }
}
