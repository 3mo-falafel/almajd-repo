import { NextResponse } from 'next/server'
import { query } from '@/lib/database/config'

// Temporary debug endpoint to inspect product IDs exactly as stored
export async function GET() {
  try {
    const result = await query('SELECT id, name, category, subcategory, price FROM products ORDER BY created_at DESC LIMIT 50')
    return NextResponse.json({
      count: result.rowCount,
      products: result.rows.map(r => ({ id: r.id, name: r.name, category: r.category, subcategory: r.subcategory, price: r.price }))
    })
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to load products debug info', message: e?.message }, { status: 500 })
  }
}
