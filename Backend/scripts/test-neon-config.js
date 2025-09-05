// Test script to verify Neon database configuration
const { Client } = require('pg');

console.log('🧪 Testing Neon Database Configuration for Strapi');
console.log('==================================================\n');

// Your Neon connection string
const connectionString = 'postgresql://neondb_owner:npg_1vLK2jlJEfFD@ep-muddy-mud-adlz7y69-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function testConnection() {
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔌 Connecting to Neon database...');
    await client.connect();
    console.log('✅ Connection successful!\n');

    // Test basic query
    console.log('📊 Testing database query...');
    const result = await client.query('SELECT version()');
    console.log('✅ Query successful!');
    console.log('PostgreSQL version:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);

    // Test if we can create a table (simulating Strapi)
    console.log('\n🏗️  Testing table creation...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_strapi_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table creation successful!');

    // Test insert
    await client.query(`
      INSERT INTO test_strapi_table (name) VALUES ('test') 
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Insert operation successful!');

    // Test select
    const selectResult = await client.query('SELECT * FROM test_strapi_table LIMIT 1');
    console.log('✅ Select operation successful!');
    console.log('Sample data:', selectResult.rows[0]);

    // Clean up test table
    await client.query('DROP TABLE IF EXISTS test_strapi_table');
    console.log('✅ Cleanup successful!');

    console.log('\n🎉 All tests passed! Your Neon database is ready for Strapi!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your Render environment variables');
    console.log('2. Deploy your application');
    console.log('3. Your database will be permanent and free!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('- Check your connection string');
    console.log('- Verify SSL settings');
    console.log('- Check network connectivity');
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed.');
  }
}

testConnection();
