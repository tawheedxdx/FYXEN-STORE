import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import InvoicesClient from './InvoicesClient';

export const metadata = {
  title: 'Invoice Manager | Admin',
};

export default async function AdminInvoicesPage() {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  // Fetch all invoices ordered newest first
  const { data: invoices } = await adminSupabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  return <InvoicesClient initialInvoices={invoices || []} />;
}
