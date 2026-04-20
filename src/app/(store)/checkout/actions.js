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

export async function validateCoupon(code, currentSubtotal) {
  const supabase = await createClient();
  const upperCode = code.toUpperCase();

  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', upperCode)
    .eq('active', true)
    .single();

  if (error || !coupon) {
    return { error: 'Invalid or inactive coupon code.' };
  }

  // 1. Check Date Validity
  const now = new Date();
  if (coupon.starts_at && new Date(coupon.starts_at) > now) {
    return { error: 'This coupon is not active yet.' };
  }
  if (coupon.ends_at && new Date(coupon.ends_at) < now) {
    return { error: 'This coupon has expired.' };
  }

  // 2. Check Usage Limit
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    return { error: 'This coupon usage limit has been reached.' };
  }

  // 3. Check Minimum Order Amount
  if (currentSubtotal < coupon.min_order_amount) {
    return { error: `Minimum order amount of ₹${coupon.min_order_amount} required.` };
  }

  // 4. Calculate Discount
  let discountAmount = 0;
  if (coupon.discount_type === 'percentage') {
    discountAmount = (currentSubtotal * coupon.discount_value) / 100;
    if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
      discountAmount = coupon.max_discount_amount;
    }
  } else {
    discountAmount = coupon.discount_value;
  }

  return { 
    success: true, 
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discountAmount: Math.min(discountAmount, currentSubtotal)
    } 
  };
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

  // Check for coupon in formData
  const couponCode = formData.get('couponCode');
  let discount = 0;
  let couponId = null;

  if (couponCode) {
    const vRes = await validateCoupon(couponCode, subtotal);
    if (!vRes.error) {
      discount = vRes.coupon.discountAmount;
      couponId = vRes.coupon.id;
    }
  }

  // Calculate totals
  const shipping = subtotal >= 2000 ? 0 : 100;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

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
      discount_amount: discount,
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
      amount: Math.round(grandTotal * 100), // in paise, must be integer
      currency: 'INR',
      receipt: order.id,
      notes: { orderNumber, couponCode: couponCode || 'none' }
    });

    // Update our DB order with RZP Order ID and Coupon ID
    // We do this in a try-catch or check result to avoid crashing if column is somehow missing
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ 
        razorpay_order_id: rzpOrder.id,
        coupon_id: couponId
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Update Order with RZP ID Error:', updateError);
      // We don't necessarily want to fail here if the order was created, 
      // but if the column is missing it will fail.
    }

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
    const { data: updatedOrder } = await supabaseAdmin
      .from('orders')
      .update({ 
        payment_status: 'paid', 
        order_status: 'confirmed',
        razorpay_payment_id,
        razorpay_signature,
        placed_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select('coupon_id')
      .single();

    // If a coupon was used, increment its count
    if (updatedOrder?.coupon_id) {
      await supabaseAdmin.rpc('increment_coupon_usage', { coupon_uuid: updatedOrder.coupon_id });
    }

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

export async function retryPayment(orderId) {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // 1. Fetch order details
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single();

  if (orderError || !order) {
    return { error: 'Order not found' };
  }

  if (order.payment_status === 'paid') {
    return { error: 'Order already paid' };
  }

  // 2. Create Razorpay Order
  try {
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(order.grand_total * 100),
      currency: 'INR',
      receipt: order.id,
      notes: { orderNumber: order.order_number }
    });

    // Update our DB order with NEW RZP Order ID
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
      shippingInfo: {
        full_name: order.shipping_full_name,
        phone: order.shipping_phone,
      }
    };
  } catch (error) {
    console.error('Razorpay Retry Error:', error);
    return { error: 'Failed to re-initialize payment gateway' };
  }
}

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `FYX-${timestamp}-${random}`;
}
