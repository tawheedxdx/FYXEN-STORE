const { Client } = require('pg');

const connectionString = 'postgresql://postgres:dbehVt93SgD8kta9@db.zwqrkassfbesjfakiybh.supabase.co:5432/postgres';

async function migrate() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL database.');

    // 1. Add min_purchase_amount to offers
    console.log('Adding min_purchase_amount to offers...');
    await client.query(`
      ALTER TABLE offers 
      ADD COLUMN IF NOT EXISTS min_purchase_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL;
    `);

    // 2. Add opted_in_offers to orders
    console.log('Adding opted_in_offers to orders...');
    await client.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS opted_in_offers UUID[] DEFAULT '{}'::UUID[] NOT NULL;
    `);

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
