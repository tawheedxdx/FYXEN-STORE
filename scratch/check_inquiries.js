import { createClient } from './src/lib/supabase/server.js';

async function checkColumns() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('inquiries').select('*').limit(1);
  if (error) {
    console.error('Error fetching inquiries:', error);
    return;
  }
  console.log('Columns in inquiries:', Object.keys(data[0] || {}));
}

checkColumns();
