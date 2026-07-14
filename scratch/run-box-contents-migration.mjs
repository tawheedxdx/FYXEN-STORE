import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbUrl = 'postgresql://postgres:dbehVt93SgD8kta9@db.zwqrkassfbesjfakiybh.supabase.co:5432/postgres';
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '00000000000025_add_product_box_contents.sql');

async function main() {
  console.log('Reading migration file...', migrationPath);
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log('Connecting to database...');
  const client = new pg.Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Executing migration SQL...');
    await client.query(sql);
    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Error running migration:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
