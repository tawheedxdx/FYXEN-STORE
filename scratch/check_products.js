import { createClient } from './src/lib/supabase/server.js';

async function checkColumns() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  console.log('Columns in products:', Object.keys(data[0] || {}));
}

checkColumns();
