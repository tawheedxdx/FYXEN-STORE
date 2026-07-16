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
      SELECT policyname, cmd, roles, qual, with_check 
      FROM pg_policies 
      WHERE tablename = 'offers';
    `);
    console.log('Policies for offers table:', res.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
