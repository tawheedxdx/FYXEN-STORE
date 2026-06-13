import pg from 'pg';

const connectionString = 'postgres://postgres:dbehVt93SgD8kta9@db.zwqrkassfbesjfakiybh.supabase.co:6543/postgres';

async function main() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL database.');

    console.log('Dropping existing constraint orders_order_status_check...');
    await client.query('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_order_status_check;');
    console.log('Constraint dropped.');

    console.log('Adding updated constraint orders_order_status_check to include return_approved...');
    await client.query(`
      ALTER TABLE orders 
      ADD CONSTRAINT orders_order_status_check 
      CHECK (order_status IN ('pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'return_approved', 'refunded'));
    `);
    console.log('Constraint updated successfully!');

  } catch (err) {
    console.error('Error executing query:', err);
  } finally {
    await client.end();
  }
}

main();
