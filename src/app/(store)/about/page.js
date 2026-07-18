import { createClient } from '@/lib/supabase/server';
import AboutClient from './AboutClient';

export const metadata = {
  title: 'About Us | Fyxen',
  description: 'Discover the vision, mission, values, and story behind Fyxen — premium minimalist shopping.',
};

export const revalidate = 300; // Cache for 5 minutes

export default async function AboutPage() {
  const supabase = await createClient();

  const [productsRes, settingsRes] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('settings').select('*').single(),
  ]);

  const productCount = productsRes.count || 0;
  const settings = settingsRes.data || {};

  return (
    <AboutClient 
      productCount={productCount} 
      parentCompany={settings.parent_company_name}
      gstNumber={settings.gst_number}
    />
  );
}
