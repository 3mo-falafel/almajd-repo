import { Pool } from 'pg'

// Database configuration
const dbConfig = {
  user: process.env.DATABASE_USER || 'almajdd_user',
  host: process.env.DATABASE_HOST || '31.97.72.28', // Your VPS IP
  database: process.env.DATABASE_NAME || 'almajdd_db',
  password: process.env.DATABASE_PASSWORD || 'Miskbo@12345',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  ssl: false, // Set to true if you want SSL connection
}

// Create a connection pool
export const pool = new Pool(dbConfig)

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}
