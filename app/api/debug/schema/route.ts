import { NextResponse } from 'next/server'
import { query } from '@/lib/database/config'

// Temporary schema + sample data + policies debug endpoint
export async function GET() {
  try {
    const [tableDef, firstRows, policies, currentDb] = await Promise.all([
      query(`SELECT column_name, data_type, is_nullable
              FROM information_schema.columns
              WHERE table_name = 'products'
              ORDER BY ordinal_position`),
      query('SELECT id, name, category, subcategory, price FROM products ORDER BY created_at DESC LIMIT 10'),
      query(`SELECT policyname, permissive, roles, cmd, qual, with_check
             FROM pg_policies WHERE tablename = 'products'`),
      query('SELECT current_database() AS db, current_schema() AS schema')
    ])

    return NextResponse.json({
      connection: currentDb.rows[0],
      columns: tableDef.rows,
      policies: policies.rows,
      sample: firstRows.rows
    })
  } catch (error: any) {
    console.error('[DEBUG/SCHEMA] error', error)
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'