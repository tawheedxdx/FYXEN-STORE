const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  host: 'db.zwqrkassfbesjfakiybh.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'dbehVt93SgD8kta9',
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  await client.connect();
  console.log('Connected to PostgreSQL database');
  
  try {
    const migrationPath = path.join(__dirname, '../supabase/migrations/00000000000029_add_offers.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log('Reading migration file...');
    
    await client.query(sql);
    console.log('Migration executed successfully!');
  } catch (err) {
    console.error('Error executing migration:', err);
  } finally {
    await client.end();
    console.log('Disconnected from database');
  }
}

main();
