import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect, notFound } from 'next/navigation';
import ReturnFormClient from './ReturnFormClient';

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Request Return | Order #${id.slice(0, 8)} | Fyxen`,
  };
}

export default async function ReturnPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch order with items
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          product_images (
            image_url
          )
        )
      )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (orderError || !order) {
    notFound();
  }

  // Verify status is delivered and delivered_at exists
  if (order.order_status !== 'delivered' || !order.delivered_at) {
    redirect(`/account/orders/${id}`);
  }

  // Fetch return request if any
  const { data: returnRequest } = await supabaseAdmin
    .from('return_requests')
    .select('id')
    .eq('order_id', order.id)
    .maybeSingle();

  if (returnRequest) {
    redirect(`/account/orders/${id}`);
  }

  // Fetch settings for return validity and return fee
  const { data: settings } = await supabaseAdmin
    .from('settings')
    .select('return_validity_days, return_fee_under_1000')
    .maybeSingle();

  const validityDays = settings?.return_validity_days ?? 7;
  const returnFeeUnder1000 = settings?.return_fee_under_1000 ?? 0;

  const deliveredDate = new Date(order.delivered_at);
  const returnExpiryDate = new Date(deliveredDate.getTime() + validityDays * 24 * 60 * 60 * 1000);
  const isReturnable = new Date() <= returnExpiryDate;

  if (!isReturnable) {
    redirect(`/account/orders/${id}`);
  }

  // Fetch active questions
  const { data: questions, error: questionsError } = await supabaseAdmin
    .from('return_questions')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <ReturnFormClient order={order} questions={questions || []} returnFeeUnder1000={returnFeeUnder1000} />
    </div>
  );
}
