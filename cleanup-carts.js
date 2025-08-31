// Clean up orphaned cart items and old sessions
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

async function cleanupCartItems() {
  console.log('🧹 Starting cart cleanup...');
  
  try {
    const client = await pool.connect();
    
    // 1. Remove orphaned cart items (referencing non-existent products)
    console.log('1. Removing orphaned cart items...');
    const orphanedResult = await client.query(`
      DELETE FROM cart_items 
      WHERE product_id NOT IN (SELECT id FROM products)
    `);
    console.log(`✅ Removed ${orphanedResult.rowCount} orphaned cart items`);
    
    // 2. Remove old cart items (older than 7 days)
    console.log('2. Removing old cart items (7+ days)...');
    const oldItemsResult = await client.query(`
      DELETE FROM cart_items 
      WHERE created_at < NOW() - INTERVAL '7 days'
    `);
    console.log(`✅ Removed ${oldItemsResult.rowCount} old cart items`);
    
    // 3. Show remaining cart items summary
    console.log('3. Remaining cart items summary...');
    const summary = await client.query(`
      SELECT 
        ci.product_id,
        p.name as product_name,
        COUNT(*) as cart_count,
        STRING_AGG(DISTINCT ci.session_id, ', ') as sessions
      FROM cart_items ci
      LEFT JOIN products p ON ci.product_id = p.id
      GROUP BY ci.product_id, p.name
      ORDER BY cart_count DESC
    `);
    
    console.log('📋 Current cart items by product:');
    if (summary.rowCount === 0) {
      console.log('  - No cart items remaining');
    } else {
      summary.rows.forEach(row => {
        console.log(`  - Product ${row.product_id} (${row.product_name || 'MISSING'}): ${row.cart_count} items in carts`);
        console.log(`    Sessions: ${row.sessions.substring(0, 100)}${row.sessions.length > 100 ? '...' : ''}`);
      });
    }
    
    client.release();
    console.log('\n✅ Cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await pool.end();
  }
}

cleanupCartItems().catch(console.error);
