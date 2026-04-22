'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const fullName = formData.get('fullName');
  const phone = formData.get('phone');

  const { error } = await supabase
    .from('profiles')
    .update({ 
      full_name: fullName,
      phone: phone,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/account');
  return { success: true };
}

export async function cancelOrder(orderId) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // 1. Fetch order to verify ownership and status
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('order_status, user_id')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !order) {
    return { error: 'Order not found' };
  }

  // 2. Verify status allows cancellation
  const cancellableStatuses = ['pending', 'confirmed', 'packed'];
  if (!cancellableStatuses.includes(order.order_status)) {
    return { error: `Order cannot be cancelled as it is already ${order.order_status}` };
  }

  // 3. Update status to cancelled
  const { error: updateError } = await supabase
    .from('orders')
    .update({ 
      order_status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath('/account/orders');
  revalidatePath(`/account/orders/${orderId}`);
  return { success: true };
}
