'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCart } from '@/app/(store)/cart/actions';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

function generateOrderNumber() {
  return `FYX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export async function createCheckoutSession(formData) {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { items, subtotal } = await getCart();
  if (items.length === 0) {
    return { error: 'Cart is empty' };
  }

  // Calculate totals (shipping fixed at 100 if subtotal < 2000)
  const shipping = subtotal >= 2000 ? 0 : 100;
  const grandTotal = subtotal + shipping;

  // Extract address info
  const shippingInfo = {
    full_name: formData.get('fullName'),
    phone: formData.get('phone'),
    line1: formData.get('line1'),
    city: formData.get('city'),
    state: formData.get('state'),
    postal_code: formData.get('postalCode'),
    country: 'India',
  };

  // 1. Create Order in DB (Pending)
  const orderNumber = generateOrderNumber();
  
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      subtotal,
      shipping_amount: shipping,
      grand_total: grandTotal,
      payment_status: 'pending',
      order_status: 'pending',
      shipping_full_name: shippingInfo.full_name,
      shipping_phone: shippingInfo.phone,
      shipping_line1: shippingInfo.line1,
      shipping_city: shippingInfo.city,
      shipping_state: shippingInfo.state,
      shipping_postal_code: shippingInfo.postal_code,
      shipping_country: shippingInfo.country,
    })
    .select('id')
    .single();

  if (orderError || !order) {
    console.error('Create Order Error:', orderError);
    return { error: 'Failed to create order' };
  }

  // 2. Insert Order Items
  const orderItemsData = items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    product_title_snapshot: item.title,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
  }));

  await supabaseAdmin.from('order_items').insert(orderItemsData);

  // 3. Create Razorpay Order
  try {
    const rzpOrder = await razorpay.orders.create({
      amount: grandTotal * 100, // in paise
      currency: 'INR',
      receipt: order.id,
      notes: { orderNumber }
    });

    // Update our DB order with RZP Order ID
    await supabaseAdmin
      .from('orders')
      .update({ razorpay_order_id: rzpOrder.id })
      .eq('id', order.id);

    return { 
      success: true, 
      orderId: order.id, 
      rzpOrderId: rzpOrder.id, 
      amount: rzpOrder.amount,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      userEmail: user.email,
      shippingInfo
    };
  } catch (error) {
    console.error('Razorpay Error:', error);
    return { error: 'Failed to initialize payment gateway' };
  }
}

export async function verifyPayment(paymentData) {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId
  } = paymentData;

  const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
  
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generatedSignature === razorpay_signature) {
    // Payment verified
    
    // Update Order Status
    await supabaseAdmin
      .from('orders')
      .update({ 
        payment_status: 'paid', 
        order_status: 'confirmed',
        razorpay_payment_id,
        razorpay_signature,
        placed_at: new Date().toISOString()
      })
      .eq('id', orderId);

    // Save Payment Record
    await supabaseAdmin
      .from('payments')
      .insert({
        order_id: orderId,
        provider_order_id: razorpay_order_id,
        provider_payment_id: razorpay_payment_id,
        status: 'captured',
        amount: 0, // Should be fetched from RZP strictly
      });

    // Clear Cart
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('carts').delete().eq('user_id', user.id);
    }

    revalidatePath('/cart');
    revalidatePath('/account');
    return { success: true };
  } else {
    // Invalid signature
    await supabaseAdmin
      .from('orders')
      .update({ payment_status: 'failed' })
      .eq('id', orderId);
      
    return { error: 'Payment verification failed' };
  }
}
