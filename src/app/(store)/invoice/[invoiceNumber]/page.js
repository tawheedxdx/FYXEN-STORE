import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { notFound, redirect } from 'next/navigation';
import InvoicePrintView from './InvoicePrintView';

export async function generateMetadata({ params }) {
  const { invoiceNumber } = await params;
  return {
    title: `Tax Invoice ${decodeURIComponent(invoiceNumber)} | FYXEN`,
  };
}

export default async function InvoicePage({ params }) {
  const { invoiceNumber } = await params;
  const decodedNumber = decodeURIComponent(invoiceNumber);
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch invoice
  const { data: invoice, error } = await adminSupabase
    .from('invoices')
    .select('*')
    .eq('invoice_number', decodedNumber)
    .single();

  if (error || !invoice) {
    notFound();
  }

  // Security check: If invoice is linked to an order, verify admin or order owner
  if (invoice.order_id) {
    const { data: profile } = user
      ? await supabase.from('profiles').select('role').eq('id', user.id).single()
      : { data: null };

    const isAdmin = profile?.role === 'admin';

    if (!isAdmin) {
      // Check if user owns the order
      const { data: order } = await adminSupabase
        .from('orders')
        .select('user_id')
        .eq('id', invoice.order_id)
        .single();

      if (order?.user_id && (!user || order.user_id !== user.id)) {
        redirect('/login');
      }
    }
  }

  return <InvoicePrintView invoice={invoice} />;
}
