import { createClient } from '@supabase/supabase-js';
import pkg from '@next/env';
const { loadEnvConfig } = pkg;
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
loadEnvConfig(join(__dirname, '..'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Error fetching buckets:', error);
    process.exit(1);
  }
  
  console.log('Buckets:', buckets.map(b => b.name));

  const requiredBuckets = ['product-images', 'category-images', 'banners', 'brand-assets'];
  
  for (const bucket of requiredBuckets) {
    if (!buckets.find(b => b.name === bucket)) {
      console.log(`Creating bucket: ${bucket}`);
      const { data, error } = await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      if (error) {
        console.error(`Failed to create bucket ${bucket}:`, error);
      } else {
        console.log(`Successfully created bucket ${bucket}`);
      }
    }
  }
}

main();
