// Check cart items that might prevent deletion
const { Pool } = require('pg');

const dbConfig = {
  user: process.env.DATABASE_USER || 'almajdd_user',
  host: process.env.DATABASE_HOST || '31.97.72.28',
  database: process.env.DATABASE_NAME || 'almajdd_db',
  password: process.env.DATABASE_PASSWORD || 'Miskbo@12345',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  ssl: false,
};

const pool = new Pool(dbConfig);

async function checkCartItems() {
  try {
    const client = await pool.connect();
    
    // Check cart_items table structure
    console.log('🛒 Checking cart_items table structure...');
    const cartTableInfo = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'cart_items' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    console.log('Cart items table columns:');
    cartTableInfo.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

    // Check existing cart items
    console.log('\n🛒 Checking existing cart items...');
    const cartItems = await client.query('SELECT id, product_id, session_id FROM cart_items LIMIT 10');
    console.log(`Found ${cartItems.rowCount} cart items:`);
    cartItems.rows.forEach(row => {
      console.log(`  - Cart ID: ${row.id}, Product ID: ${row.product_id} (type: ${typeof row.product_id}), Session: ${row.session_id}`);
    });

    // Check if there are orphaned cart items (referencing non-existent products)
    console.log('\n🔍 Checking for orphaned cart items...');
    const orphaned = await client.query(`
      SELECT ci.id, ci.product_id, ci.session_id 
      FROM cart_items ci 
      LEFT JOIN products p ON ci.product_id = p.id 
      WHERE p.id IS NULL
    `);
    console.log(`Found ${orphaned.rowCount} orphaned cart items:`);
    orphaned.rows.forEach(row => {
      console.log(`  - Orphaned Cart ID: ${row.id}, Missing Product ID: ${row.product_id}, Session: ${row.session_id}`);
    });

    client.release();
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

checkCartItems().catch(console.error);
