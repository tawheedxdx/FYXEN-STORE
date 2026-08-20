import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import ManualInvoiceForm from './ManualInvoiceForm';

export const metadata = {
  title: 'Create Manual Invoice | Admin',
};

export default async function NewManualInvoicePage() {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  // Fetch active products for optional quick select
  const { data: products } = await adminSupabase
    .from('products')
    .select('id, title, sku, price, hsn_code, tax_rate')
    .eq('is_active', true)
    .order('title');

  // Fetch store settings for default GST and seller info
  const { data: settings } = await adminSupabase
    .from('settings')
    .select('*')
    .maybeSingle();

  return (
    <ManualInvoiceForm 
      catalogProducts={products || []} 
      settings={settings || {}} 
    />
  );
}
