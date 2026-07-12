import { createClient } from '../src/lib/supabase/server.js';

async function checkColumns() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('categories').select('*').limit(1);
  if (error) {
    console.error('Error fetching categories:', error);
    return;
  }
  if (data && data.length > 0) {
    console.log('Columns in categories table:', Object.keys(data[0]));
  } else {
    console.log('No categories found to check columns.');
    // Try to get columns from information_schema if possible, but simpler to just try inserting a dummy row or something.
    // Actually, if it's empty, I'll just assume it might not have it.
  }
}

checkColumns();
