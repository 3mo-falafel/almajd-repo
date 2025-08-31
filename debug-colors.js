// Debug script to check color data structure
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

async function debugColors() {
  console.log('🎨 Debugging color data structure...');
  
  try {
    const client = await pool.connect();
    
    // Check color data for all products
    console.log('1. Checking color data structure...');
    const products = await client.query('SELECT id, name, colors FROM products LIMIT 5');
    
    console.log('📋 Products and their color data:');
    products.rows.forEach(row => {
      console.log(`\n  Product ${row.id} - ${row.name}:`);
      console.log(`    Raw colors data:`, row.colors);
      console.log(`    Type:`, typeof row.colors);
      console.log(`    Is Array:`, Array.isArray(row.colors));
      
      if (Array.isArray(row.colors)) {
        row.colors.forEach((color, idx) => {
          console.log(`    Color ${idx}:`, color);
          console.log(`      Type:`, typeof color);
          console.log(`      Keys:`, Object.keys(color));
        });
      }
    });
    
    client.release();
    console.log('\n✅ Color debug complete!');
    
  } catch (error) {
    console.error('❌ Error during color debug:', error);
  } finally {
    await pool.end();
  }
}

debugColors().catch(console.error);
