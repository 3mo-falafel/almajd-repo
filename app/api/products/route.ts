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
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }
    
    await deleteProduct(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
