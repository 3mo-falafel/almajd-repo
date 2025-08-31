import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database/config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    if (!name) return NextResponse.json({ error: 'name param required' }, { status: 400 })
    const res = await query('SELECT id, name, created_at FROM products WHERE name ILIKE $1 ORDER BY created_at DESC LIMIT 20', [name])
    return NextResponse.json({ matches: res.rows })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'