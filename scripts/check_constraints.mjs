import pg from 'pg';

const connectionString = 'postgres://postgres:dbehVt93SgD8kta9@db.zwqrkassfbesjfakiybh.supabase.co:6543/postgres';

async function main() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase.');
    const res = await client.query(`
      SELECT conname, pg_get_constraintdef(oid) 
      FROM pg_constraint 
      WHERE conrelid = 'orders'::regclass;
    `);
    console.log('Constraints on orders:');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
