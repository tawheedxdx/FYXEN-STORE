'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function checkAdmin(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return null;

  return user;
}

export async function processReturnRequest(id, status, adminNotes) {
  if (!['approved', 'rejected'].includes(status)) {
    return { error: 'Invalid status' };
  }

  const supabase = await createClient();
  const adminUser = await checkAdmin(supabase);
  if (!adminUser) return { error: 'Unauthorized' };

  // Fetch the request to get the order_id
  const { data: request, error: fetchError } = await supabase
    .from('return_requests')
    .select('order_id')
    .eq('id', id)
    .single();

  if (fetchError || !request) {
    return { error: 'Return request not found' };
  }

  // Start process
  const { error: updateRequestError } = await supabase
    .from('return_requests')
    .update({
      status,
      admin_notes: adminNotes,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (updateRequestError) {
    return { error: updateRequestError.message };
  }

  // If approved, update order status to return_approved
  if (status === 'approved') {
    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({
        order_status: 'return_approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', request.order_id);

    if (updateOrderError) {
      return { error: `Return request status updated, but updating order failed: ${updateOrderError.message}` };
    }
  }

  revalidatePath(`/admin/returns/${id}`);
  revalidatePath('/admin/returns');
  revalidatePath(`/admin/orders/${request.order_id}`);
  return { success: true };
}

export async function refundReturnOrder(id) {
  const supabase = await createClient();
  const adminUser = await checkAdmin(supabase);
  if (!adminUser) return { error: 'Unauthorized' };

  // Fetch the request to get the order_id
  const { data: request, error: fetchError } = await supabase
    .from('return_requests')
    .select('order_id, status')
    .eq('id', id)
    .single();

  if (fetchError || !request) {
    return { error: 'Return request not found' };
  }

  if (request.status !== 'approved') {
    return { error: 'Return request must be approved first.' };
  }

  const { error: updateOrderError } = await supabase
    .from('orders')
    .update({
      order_status: 'refunded',
      payment_status: 'refunded',
      updated_at: new Date().toISOString()
    })
    .eq('id', request.order_id);

  if (updateOrderError) {
    return { error: updateOrderError.message };
  }

  revalidatePath(`/admin/returns/${id}`);
  revalidatePath('/admin/returns');
  revalidatePath(`/admin/orders/${request.order_id}`);
  return { success: true };
}
