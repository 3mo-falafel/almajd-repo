import { NextRequest, NextResponse } from 'next/server'
import { getGalleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem } from '@/lib/database/gallery'

export async function GET() {
  try {
    const galleryItems = await getGalleryItems()
    return NextResponse.json(galleryItems)
  } catch (error) {
    console.error('Error fetching gallery items:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const itemData = await request.json()
    const result = await addGalleryItem(itemData)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error adding gallery item:', error)
    return NextResponse.json({ error: 'Failed to add gallery item' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...itemData } = await request.json()
    await updateGalleryItem(id, itemData)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating gallery item:', error)
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID is required' }, { status: 400 })
    }
    
    await deleteGalleryItem(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting gallery item:', error)
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 })
  }
}
