'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitReturnRequest({ orderId, items, answers }) {
  if (!orderId || !items || items.length === 0 || !answers) {
    return { error: 'Invalid return request payload.' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized. Please log in.' };

  // Fetch order and verify ownership and deliver status
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, user_id, order_status, delivered_at, grand_total')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single();

  if (orderError || !order) {
    return { error: 'Order not found or you do not have permission to return it.' };
  }

  if (order.order_status !== 'delivered' || !order.delivered_at) {
    return { error: 'Only delivered orders can be returned.' };
  }

  // Check if a return request already exists
  const { data: existingRequest } = await supabase
    .from('return_requests')
    .select('id')
    .eq('order_id', orderId)
    .maybeSingle();

  if (existingRequest) {
    return { error: 'A return request has already been submitted for this order.' };
  }

  // Check validity days and return fee setting
  const { data: settings } = await supabase
    .from('settings')
    .select('return_validity_days, return_fee_under_1000')
    .maybeSingle();
  const validityDays = settings?.return_validity_days ?? 7;
  const returnFeeSetting = settings?.return_fee_under_1000 ?? 0;

  const deliveredDate = new Date(order.delivered_at);
  const expiryDate = new Date(deliveredDate.getTime() + validityDays * 24 * 60 * 60 * 1000);
  if (new Date() > expiryDate) {
    return { error: 'The return validity period for this order has expired.' };
  }

  // Prepare insert payload
  const payload = {
    order_id: orderId,
    user_id: user.id,
    status: 'pending',
    items,
    answers,
    return_fee: order.grand_total < 1000 ? returnFeeSetting : 0,
    updated_at: new Date().toISOString()
  };

  const { error: insertError } = await supabase
    .from('return_requests')
    .insert(payload);

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath(`/account/orders/${orderId}`);
  revalidatePath('/admin/returns');
  return { success: true };
}
