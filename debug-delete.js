// Debug script to test product deletion
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

async function debugDelete() {
  console.log('🔍 Debugging product deletion...');
  
  try {
    // 1. Check if we can connect to database
    console.log('1. Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    
    // 2. Check the products table structure
    console.log('\n2. Checking products table structure...');
    const tableInfo = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    console.log('📋 Products table columns:');
    tableInfo.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

    // 3. Check existing products and their ID types
    console.log('\n3. Checking existing products...');
    const products = await client.query('SELECT id, name FROM products LIMIT 5');
    console.log(`📦 Found ${products.rowCount} products (showing first 5):`);
    products.rows.forEach(row => {
      console.log(`  - ID: ${row.id} (type: ${typeof row.id}, length: ${String(row.id).length})`);
      console.log(`    Name: ${row.name}`);
    });

    // 4. Check for foreign key constraints
    console.log('\n4. Checking foreign key constraints...');
    const constraints = await client.query(`
      SELECT 
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND (ccu.table_name = 'products' OR tc.table_name = 'products');
    `);
    console.log('🔗 Foreign key constraints affecting products:');
    if (constraints.rowCount === 0) {
      console.log('  - No foreign key constraints found');
    } else {
      constraints.rows.forEach(row => {
        console.log(`  - ${row.table_name}.${row.column_name} -> ${row.foreign_table_name}.${row.foreign_column_name}`);
      });
    }

    // 5. Check RLS policies
    console.log('\n5. Checking RLS policies...');
    const policies = await client.query(`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
      FROM pg_policies 
      WHERE tablename = 'products';
    `);
    console.log('🛡️ RLS policies on products table:');
    if (policies.rowCount === 0) {
      console.log('  - No RLS policies found');
    } else {
      policies.rows.forEach(row => {
        console.log(`  - ${row.policyname}: ${row.cmd} (permissive: ${row.permissive})`);
        console.log(`    Condition: ${row.qual || 'None'}`);
      });
    }

    // 6. Check if RLS is enabled
    console.log('\n6. Checking RLS status...');
    const rlsStatus = await client.query(`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE tablename = 'products' AND schemaname = 'public';
    `);
    console.log('🔒 RLS status:');
    rlsStatus.rows.forEach(row => {
      console.log(`  - Table: ${row.tablename}, RLS enabled: ${row.rowsecurity}`);
    });

    // 7. Test a simple delete query (if there are products)
    if (products.rowCount > 0) {
      const testId = products.rows[0].id;
      console.log(`\n7. Testing delete query simulation for ID: ${testId}...`);
      
      // First, let's just try a SELECT to see if we can find the product
      const selectTest = await client.query('SELECT id FROM products WHERE id = $1', [testId]);
      console.log(`✅ SELECT test: Found ${selectTest.rowCount} product(s) with ID ${testId}`);
      
      // Check what would be deleted (without actually deleting)
      console.log('🔍 Products that would be affected by DELETE:');
      const wouldDelete = await client.query('SELECT id, name FROM products WHERE id = $1', [testId]);
      wouldDelete.rows.forEach(row => {
        console.log(`  - Would delete: ${row.id} - ${row.name}`);
      });
    }

    client.release();
    console.log('\n✅ Debug complete! Check the output above for any issues.');
    
  } catch (error) {
    console.error('❌ Error during debug:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint
    });
  } finally {
    await pool.end();
  }
}

debugDelete().catch(console.error);
