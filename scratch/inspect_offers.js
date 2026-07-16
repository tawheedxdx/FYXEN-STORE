const { Client } = require('pg');

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
  try {
    const res = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'offers'
      ORDER BY ordinal_position;
    `);
    console.log('Columns for offers table:', res.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
