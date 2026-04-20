'use server';

import { createClient } from '@/lib/supabase/server';

export async function trackOrder(formData) {
  const orderNumber = formData.get('orderNumber')?.toString().trim().toUpperCase();
  const email = formData.get('email')?.toString().trim().toLowerCase();

  if (!orderNumber || !email) {
    return { error: 'Please fill in both fields.' };
  }

  const supabase = await createClient();

  // Fetch the order by order number + verify by matching user email via profiles
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      order_status,
      payment_status,
      grand_total,
      shipping_amount,
      subtotal,
      placed_at,
      created_at,
      shipping_full_name,
      shipping_line1,
      shipping_city,
      shipping_state,
      shipping_postal_code,
      shipping_country,
      shipping_phone,
      order_items (
        id,
        product_title_snapshot,
        quantity,
        unit_price,
        total_price
      ),
      profiles ( email )
    `)
    .ilike('order_number', orderNumber)
    .single();

  if (error || !order) {
    return { error: 'Order not found. Please check your Order ID and try again.' };
  }

  // Verify email matches
  const profileEmail = order.profiles?.email?.toLowerCase();
  if (profileEmail !== email) {
    return { error: 'The email address does not match this order. Please check your details.' };
  }

  // Remove sensitive profile data before returning
  const { profiles, ...safeOrder } = order;
  return { order: safeOrder };
}
