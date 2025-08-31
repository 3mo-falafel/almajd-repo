// Clean up orphaned order items and cart items
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

async function cleanupOrphanedReferences() {
  console.log('🧹 Starting orphaned references cleanup...');
  
  try {
    const client = await pool.connect();
    
    // 1. Check what product IDs are referenced in orders but don't exist
    console.log('1. Checking orphaned product references in orders...');
    const orphanedInOrders = await client.query(`
      SELECT DISTINCT
        jsonb_array_elements(order_items) ->> 'productId' as product_id,
        COUNT(*) as order_count
      FROM orders 
      WHERE jsonb_array_elements(order_items) ->> 'productId' NOT IN (
        SELECT id::text FROM products
      )
      GROUP BY jsonb_array_elements(order_items) ->> 'productId'
    `);
    
    console.log('📋 Orphaned product references in orders:');
    if (orphanedInOrders.rowCount === 0) {
      console.log('  - No orphaned product references in orders');
    } else {
      orphanedInOrders.rows.forEach(row => {
        console.log(`  - Product ID ${row.product_id}: referenced in ${row.order_count} orders`);
      });
    }
    
    // 2. Remove orphaned cart items (already implemented but let's check)
    console.log('\n2. Removing orphaned cart items...');
    const orphanedCartResult = await client.query(`
      DELETE FROM cart_items 
      WHERE product_id::text NOT IN (SELECT id::text FROM products)
    `);
    console.log(`✅ Removed ${orphanedCartResult.rowCount} orphaned cart items`);
    
    // 3. Show current cart status
    console.log('\n3. Current cart status...');
    const cartSummary = await client.query(`
      SELECT 
        ci.product_id,
        p.name as product_name,
        COUNT(*) as cart_count
      FROM cart_items ci
      LEFT JOIN products p ON ci.product_id = p.id
      GROUP BY ci.product_id, p.name
      ORDER BY cart_count DESC
    `);
    
    console.log('📋 Current cart items by product:');
    if (cartSummary.rowCount === 0) {
      console.log('  - No cart items remaining');
    } else {
      cartSummary.rows.forEach(row => {
        console.log(`  - Product ${row.product_id} (${row.product_name || 'MISSING'}): ${row.cart_count} items`);
      });
    }
    
    // 4. Show existing products
    console.log('\n4. Current products in database...');
    const existingProducts = await client.query('SELECT id, name FROM products ORDER BY id');
    console.log('📦 Existing products:');
    existingProducts.rows.forEach(row => {
      console.log(`  - ID ${row.id}: ${row.name}`);
    });
    
    client.release();
    console.log('\n✅ Cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await pool.end();
  }
}

cleanupOrphanedReferences().catch(console.error);
