const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Database migration script
// This script helps you migrate from your current PostgreSQL to a free permanent solution

class DatabaseMigrator {
  constructor() {
    this.oldClient = null;
    this.newClient = null;
  }

  // Connect to your current database
  async connectToOldDatabase() {
    const oldConfig = {
      connectionString: process.env.OLD_DATABASE_URL || process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    };
    
    this.oldClient = new Client(oldConfig);
    await this.oldClient.connect();
    console.log('✅ Connected to old database');
  }

  // Connect to new database (Neon, Supabase, etc.)
  async connectToNewDatabase() {
    const newConfig = {
      connectionString: process.env.NEW_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    };
    
    this.newClient = new Client(newConfig);
    await this.newClient.connect();
    console.log('✅ Connected to new database');
  }

  // Export database schema
  async exportSchema() {
    try {
      const query = `
        SELECT 
          schemaname,
          tablename,
          attname,
          attnum,
          typname,
          attnotnull,
          adsrc as default_value
        FROM pg_attribute a
        JOIN pg_class c ON a.attrelid = c.oid
        JOIN pg_type t ON a.atttypid = t.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        LEFT JOIN pg_attrdef ad ON a.attrelid = ad.adrelid AND a.attnum = ad.adnum
        WHERE n.nspname = 'public'
        AND a.attnum > 0
        AND NOT a.attisdropped
        ORDER BY c.relname, a.attnum;
      `;
      
      const result = await this.oldClient.query(query);
      
      // Group by table
      const tables = {};
      result.rows.forEach(row => {
        if (!tables[row.tablename]) {
          tables[row.tablename] = [];
        }
        tables[row.tablename].push(row);
      });

      // Generate CREATE TABLE statements
      let schema = '';
      for (const [tableName, columns] of Object.entries(tables)) {
        schema += `\n-- Table: ${tableName}\n`;
        schema += `CREATE TABLE IF NOT EXISTS "${tableName}" (\n`;
        
        const columnDefs = columns.map(col => {
          let def = `  "${col.attname}" ${col.typname}`;
          if (col.attnotnull) def += ' NOT NULL';
          if (col.default_value) def += ` DEFAULT ${col.default_value}`;
          return def;
        });
        
        schema += columnDefs.join(',\n');
        schema += '\n);\n';
      }

      // Save schema to file
      const schemaPath = path.join(__dirname, '..', 'database-schema.sql');
      fs.writeFileSync(schemaPath, schema);
      console.log(`✅ Schema exported to ${schemaPath}`);
      
      return schema;
    } catch (error) {
      console.error('❌ Error exporting schema:', error.message);
      throw error;
    }
  }

  // Export data from all tables
  async exportData() {
    try {
      // Get all table names
      const tablesQuery = `
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'strapi_%'
        ORDER BY tablename;
      `;
      
      const tablesResult = await this.oldClient.query(tablesQuery);
      const tables = tablesResult.rows.map(row => row.tablename);
      
      let dataExport = '';
      
      for (const tableName of tables) {
        console.log(`📤 Exporting data from ${tableName}...`);
        
        const dataQuery = `SELECT * FROM "${tableName}";`;
        const dataResult = await this.oldClient.query(dataQuery);
        
        if (dataResult.rows.length > 0) {
          dataExport += `\n-- Data for table: ${tableName}\n`;
          
          // Generate INSERT statements
          const columns = Object.keys(dataResult.rows[0]);
          const insertQuery = `INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES\n`;
          
          const values = dataResult.rows.map(row => {
            const rowValues = columns.map(col => {
              const value = row[col];
              if (value === null) return 'NULL';
              if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
              if (typeof value === 'boolean') return value;
              if (value instanceof Date) return `'${value.toISOString()}'`;
              return `'${String(value).replace(/'/g, "''")}'`;
            });
            return `(${rowValues.join(', ')})`;
          });
          
          dataExport += insertQuery + values.join(',\n') + ';\n';
        }
      }
      
      // Save data to file
      const dataPath = path.join(__dirname, '..', 'database-data.sql');
      fs.writeFileSync(dataPath, dataExport);
      console.log(`✅ Data exported to ${dataPath}`);
      
      return dataExport;
    } catch (error) {
      console.error('❌ Error exporting data:', error.message);
      throw error;
    }
  }

  // Import schema to new database
  async importSchema(schema) {
    try {
      await this.newClient.query(schema);
      console.log('✅ Schema imported to new database');
    } catch (error) {
      console.error('❌ Error importing schema:', error.message);
      throw error;
    }
  }

  // Import data to new database
  async importData(data) {
    try {
      await this.newClient.query(data);
      console.log('✅ Data imported to new database');
    } catch (error) {
      console.error('❌ Error importing data:', error.message);
      throw error;
    }
  }

  // Close connections
  async closeConnections() {
    if (this.oldClient) await this.oldClient.end();
    if (this.newClient) await this.newClient.end();
    console.log('✅ Database connections closed');
  }

  // Full migration process
  async migrate() {
    try {
      console.log('🚀 Starting database migration...\n');
      
      // Step 1: Connect to old database
      await this.connectToOldDatabase();
      
      // Step 2: Export schema and data
      console.log('\n📋 Exporting database...');
      const schema = await this.exportSchema();
      const data = await this.exportData();
      
      // Step 3: Connect to new database
      console.log('\n🔄 Connecting to new database...');
      await this.connectToNewDatabase();
      
      // Step 4: Import schema and data
      console.log('\n📥 Importing to new database...');
      await this.importSchema(schema);
      await this.importData(data);
      
      console.log('\n🎉 Migration completed successfully!');
      console.log('\n📝 Next steps:');
      console.log('1. Update your .env file with the new database URL');
      console.log('2. Test your application with the new database');
      console.log('3. Update your deployment environment variables');
      
    } catch (error) {
      console.error('\n❌ Migration failed:', error.message);
      throw error;
    } finally {
      await this.closeConnections();
    }
  }
}

// Run migration if called directly
if (require.main === module) {
  const migrator = new DatabaseMigrator();
  migrator.migrate().catch(console.error);
}

module.exports = DatabaseMigrator;
