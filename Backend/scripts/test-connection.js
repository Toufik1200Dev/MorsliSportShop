// Test script for your Neon database connection
const { Client } = require('pg');

console.log('🧪 Testing Your Neon Database Connection');
console.log('========================================\n');

// Replace this with your actual connection string from Neon dashboard
const connectionString = 'postgresql://neondb_owner:npg_1vLK2jlJEfFD@ep-misty-cell-adec1wqm-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

if (connectionString === 'YOUR_CONNECTION_STRING_HERE') {
  console.log('❌ Please replace the connection string with your actual Neon connection string');
  console.log('\n📋 To get your connection string:');
  console.log('1. In Neon dashboard, click "Connect" button');
  console.log('2. Select "Connection string"');
  console.log('3. Copy the connection string');
  console.log('4. Replace YOUR_CONNECTION_STRING_HERE in this file');
  console.log('5. Run: node scripts/test-connection.js');
  process.exit(1);
}

async function testConnection() {
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔌 Connecting to your Neon database...');
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

    console.log('\n🎉 All tests passed! Your database is ready for Strapi!');
    console.log('\n📋 Your connection string:');
    console.log(connectionString);
    console.log('\n🔧 Next steps:');
    console.log('1. Update your Render environment variables');
    console.log('2. Deploy your application');
    console.log('3. Your database will be permanent and free!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('- Check your connection string format');
    console.log('- Verify SSL settings');
    console.log('- Check network connectivity');
    console.log('- Make sure the database is active');
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed.');
  }
}

testConnection();
