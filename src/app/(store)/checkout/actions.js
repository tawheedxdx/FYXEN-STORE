'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCart } from '@/app/(store)/cart/actions';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { validateCheckoutSession, invalidateCheckoutSession } from '@/services/checkout/session';

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

  // Strictly enforce 5-minute temporary session validity
  const sessionId = formData.get('session_id') || formData.get('sessionId');
  if (!sessionId) {
    return { error: 'Checkout session is missing or invalid. Please refresh and try again.' };
  }

  const sessionValidation = await validateCheckoutSession(sessionId, user.id);
  if (!sessionValidation.valid) {
    return { error: 'Your checkout session has expired (valid for 5 minutes). Please renew your session to place the order.' };
  }

  const acceptPolicies = formData.get('acceptPolicies') === 'on' || formData.get('acceptPolicies') === 'true';
  if (!acceptPolicies) {
    return { error: 'Please accept the Terms & Conditions before placing your order.' };
  }

  const headerList = await headers();
  const userIp = headerList.get('x-forwarded-for')?.split(',')[0].trim() || 
                 headerList.get('x-real-ip') || 
                 '127.0.0.1';

  const { data: settings } = await supabaseAdmin
    .from('settings')
    .select('*')
    .single();

  const { items, subtotal, totalTax } = await getCart();
  if (items.length === 0) {
    return { error: 'Cart is empty' };
  }

  // 1. Stock Check
  for (const item of items) {
    if (item.quantity > item.stockQuantity) {
      return { error: `Insufficient stock for ${item.title}. Only ${item.stockQuantity} available.` };
    }
  }

  const paymentMethod = formData.get('paymentMethod') || 'ONLINE';
  const deliveryType = formData.get('deliveryType') || 'standard';

  // Extract address info
  const houseNo = formData.get('houseNo');
  const street = formData.get('street');
  const landmark = formData.get('landmark');
  const line1 = houseNo ? `${houseNo}, ${street}` : (street || '');
  const line2 = landmark || '';

  const shippingInfo = {
    full_name: formData.get('fullName'),
    phone: formData.get('phone'),
    line1,
    line2,
    city: formData.get('city') || '',
    state: formData.get('state') || '',
    postal_code: formData.get('postalCode') || '',
    country: 'India',
  };

  // 2. Delivery Type & Kolkata Verification
  let deliveryFee = 0;
  const founderEnabled = settings?.founder_delivery_enabled ?? true;
  const founderFee = Number(settings?.founder_delivery_fee ?? 10000);
  const stdFee = Number(settings?.standard_delivery_fee ?? 30);
  const freeThreshold = Number(settings?.standard_delivery_free_threshold ?? 499);
  const expFee = Number(settings?.express_delivery_fee ?? 50);
  const codComplianceFee = Number(settings?.cod_compliance_fee ?? 15);

  if (deliveryType === 'founder') {
    if (!founderEnabled) {
      return { error: 'Hand Delivered By Founder is currently unavailable. Please choose Standard or Express Delivery.' };
    }

    // West Bengal check: state, PIN code (70-74), or WB districts/cities
    const cityStr = (shippingInfo.city || '').toLowerCase().trim();
    const stateStr = (shippingInfo.state || '').toLowerCase().trim();
    const pinStr = (shippingInfo.postal_code || '').trim();

    const isPinInWB = pinStr.length >= 2 && ['70', '71', '72', '73', '74'].includes(pinStr.slice(0, 2));
    const isStateWB = stateStr.includes('west bengal') || stateStr.includes('bengal') || stateStr.includes('paschim banga') || stateStr.includes('wb');

    const wbKeywords = [
      'kolkata', 'calcutta', 'howrah', 'hooghly', 'north 24', 'south 24', 'parganas',
      'darjeeling', 'siliguri', 'asansol', 'durgapur', 'nadia', 'burdwan', 'bardhaman',
      'bankura', 'birbhum', 'purulia', 'murshidabad', 'malda', 'jalpaiguri', 'alipurduar',
      'cooch behar', 'dinajpur', 'jhargram', 'medinipur', 'midnapore', 'kalimpong',
      'kharagpur', 'haldia', 'bolpur', 'santiniketan', 'baharampur', 'krishnanagar',
      'raiganj', 'balurghat', 'barasat', 'barrackpore', 'bidhannagar', 'salt lake', 'new town'
    ];
    const isCityInWB = wbKeywords.some((kw) => cityStr.includes(kw));

    const isWestBengal = isPinInWB || isStateWB || isCityInWB;

    if (!isWestBengal) {
      return { 
        error: 'Hand Delivered By Founder is strictly available across West Bengal only (including all districts & cities). Please select Standard/Express Delivery or provide a West Bengal delivery address.' 
      };
    }

    if (paymentMethod === 'COD') {
      return {
        error: 'Hand Delivered By Founder requires Prepaid (Online) payment. COD is not available for this service.'
      };
    }

    deliveryFee = founderFee;
  } else if (deliveryType === 'express') {
    deliveryFee = expFee;
  } else {
    // Standard delivery
    deliveryFee = subtotal >= freeThreshold ? 0 : stdFee;
  }

  // 3. COD Fee
  let codFee = 0;
  if (paymentMethod === 'COD') {
    codFee = codComplianceFee;
  }

  // 4. Coupon validation
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

  // 5. Wallet balance logic
  const useWallet = formData.get('useWallet') === 'true';
  let walletAmountUsed = 0;
  
  if (useWallet) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('wallet_balance')
      .eq('id', user.id)
      .single();

    if (profile && profile.wallet_balance > 0) {
      const remainingAfterCoupons = Math.max(0, subtotal - discount + deliveryFee + totalTax + codFee);
      walletAmountUsed = Math.min(profile.wallet_balance, remainingAfterCoupons);
    }
  }

  // 6. Calculate grand total
  const tax = totalTax;
  let grandTotal = Math.max(0, subtotal - discount - walletAmountUsed + deliveryFee + tax + codFee);

  // Potential cashback
  const walletCashbackAmount = Math.floor(grandTotal / 100) * 2;

  // Validate opted offers
  const optedOffers = formData.getAll('opted_offers') || [];
  let validatedOptedOffers = [];

  if (optedOffers.length > 0) {
    const nowStr = new Date().toISOString();
    const { data: dbOffers } = await supabaseAdmin
      .from('offers')
      .select('*')
      .in('id', optedOffers)
      .eq('active', true)
      .lte('starts_at', nowStr)
      .gte('ends_at', nowStr);

    if (dbOffers) {
      for (const offer of dbOffers) {
        const minAmount = Number(offer.min_purchase_amount || 0);
        if (subtotal >= minAmount) {
          const isSiteWide = !offer.eligible_product_ids || offer.eligible_product_ids.length === 0;
          const isProductEligible = isSiteWide || items.some(item => offer.eligible_product_ids.includes(item.product_id));
          if (isProductEligible) {
            validatedOptedOffers.push(offer.id);
          }
        }
      }
    }
  }

  // 7. Create Order in Database
  const orderNumber = generateOrderNumber();
  
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      subtotal,
      discount_amount: discount,
      shipping_amount: deliveryFee,
      delivery_type: deliveryType,
      delivery_fee: deliveryFee,
      cod_fee: codFee,
      tax_amount: tax,
      grand_total: grandTotal,
      payment_status: paymentMethod === 'COD' ? 'cod' : 'pending',
      order_status: paymentMethod === 'COD' ? 'confirmed' : 'pending',
      payment_method: paymentMethod,
      shipping_full_name: shippingInfo.full_name,
      shipping_phone: shippingInfo.phone,
      shipping_line1: shippingInfo.line1,
      shipping_line2: shippingInfo.line2,
      shipping_landmark: shippingInfo.line2,
      shipping_city: shippingInfo.city,
      shipping_state: shippingInfo.state,
      shipping_postal_code: shippingInfo.postal_code,
      shipping_country: shippingInfo.country,
      placed_at: paymentMethod === 'COD' ? new Date().toISOString() : null,
      coupon_id: couponId,
      wallet_amount_used: walletAmountUsed,
      wallet_cashback_amount: walletCashbackAmount,
      partial_payment_amount: 0,
      cod_balance_amount: paymentMethod === 'COD' ? grandTotal : 0,
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
      terms_version: 'v1.0',
      user_ip: userIp,
      opted_in_offers: validatedOptedOffers
    })
    .select('id')
    .single();

  if (orderError || !order) {
    console.error('Create Order Error:', orderError);
    return { error: 'Failed to create order. Please try again.' };
  }

  // 8. Insert Order Items
  const orderItemsData = items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    variant_id: item.variantId,
    product_title_snapshot: item.title,
    image_snapshot: item.image,
    sku_snapshot: item.sku,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
  }));

  await supabaseAdmin.from('order_items').insert(orderItemsData);

  // 9. COD Execution
  if (paymentMethod === 'COD') {
    // Decrement Stock
    for (const item of items) {
      const { data: success } = await supabaseAdmin.rpc('decrement_stock', {
        p_product_id: item.productId,
        p_quantity: item.quantity,
        p_variant_id: item.variantId
      });
      if (!success) {
        await deleteOrder(order.id);
        return { error: `Stock for ${item.title} ran out. Please update your cart.` };
      }
    }

    // Clear Cart
    await supabase.from('carts').delete().eq('user_id', user.id);
    
    // Increment coupon usage
    if (couponId) {
      await supabaseAdmin.rpc('increment_coupon_usage', { coupon_uuid: couponId });
    }

    // Deduct wallet if used
    if (walletAmountUsed > 0) {
      await supabaseAdmin.rpc('adjust_wallet_balance', {
        p_user_id: user.id,
        p_amount: -walletAmountUsed
      });
      await supabaseAdmin.from('wallet_transactions').insert({
        user_id: user.id,
        amount: -walletAmountUsed,
        type: 'payment',
        status: 'completed',
        description: `Order Payment (Order: ${orderNumber})`
      });
    }

    // Invalidate checkout session token
    const sessionId = formData.get('session_id') || formData.get('sessionId');
    if (sessionId) {
      try {
        await invalidateCheckoutSession(sessionId);
      } catch (err) {
        console.error('Failed to invalidate checkout session:', err);
      }
    }

    revalidatePath('/cart');
    revalidatePath('/account');
    
    return { 
      success: true, 
      orderId: order.id, 
      paymentMethod: 'COD'
    };
  }

  // 10. Razorpay Online Order Creation
  try {
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(grandTotal * 100), // in paise
      currency: 'INR',
      receipt: order.id,
      notes: { 
        orderNumber, 
        couponCode: couponCode || 'none',
        deliveryType
      }
    });

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
      shippingInfo,
      paymentMethod: 'ONLINE'
    };
  } catch (error) {
    console.error('Razorpay Error:', error);
    return { error: 'Failed to initialize Razorpay payment gateway.' };
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

  const sessionId = paymentData?.sessionId || paymentData?.session_id;
  if (sessionId) {
    const { data: { user } } = await supabase.auth.getUser();
    const sessionValidation = await validateCheckoutSession(sessionId, user?.id);
    if (!sessionValidation.valid) {
      return { error: 'Checkout session expired. Payment verification rejected.' };
    }
  }

  if (generatedSignature === razorpay_signature) {
    // Update Order Status
    const { data: order, error: orderUpdateError } = await supabaseAdmin
      .from('orders')
      .update({ 
        payment_status: 'paid', 
        order_status: 'confirmed',
        razorpay_payment_id,
        razorpay_signature,
        placed_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select('id, user_id, grand_total, wallet_amount_used, order_number, coupon_id')
      .single();

    if (orderUpdateError || !order) {
      console.error('Order Update Error:', orderUpdateError);
      return { error: 'Failed to update order status' };
    }

    // 1. Fetch order items for stock decrement
    const { data: orderItems } = await supabaseAdmin
      .from('order_items')
      .select('product_id, variant_id, quantity, product_title_snapshot')
      .eq('order_id', orderId);

    // 2. Decrement Stock
    if (orderItems) {
      for (const item of orderItems) {
        const { data: success } = await supabaseAdmin.rpc('decrement_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
          p_variant_id: item.variant_id
        });
        if (!success) {
          console.error(`STOCK EXHAUSTED for ${item.product_title_snapshot} during payment verify!`);
        }
      }
    }

    // 3. Deduct Wallet Balance if used
    if (order.wallet_amount_used > 0) {
      await supabaseAdmin.rpc('adjust_wallet_balance', {
        p_user_id: order.user_id,
        p_amount: -order.wallet_amount_used
      });
      await supabaseAdmin.from('wallet_transactions').insert({
        user_id: order.user_id,
        amount: -order.wallet_amount_used,
        type: 'payment',
        status: 'completed',
        description: `Order Payment (Order: ${order.order_number})`
      });
    }

    // If coupon used
    if (order.coupon_id) {
      await supabaseAdmin.rpc('increment_coupon_usage', { coupon_uuid: order.coupon_id });
    }

    // Save Payment Record
    await supabaseAdmin
      .from('payments')
      .insert({
        order_id: orderId,
        provider_order_id: razorpay_order_id,
        provider_payment_id: razorpay_payment_id,
        status: 'captured',
        amount: order.grand_total,
      });

    // Clear Cart
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('carts').delete().eq('user_id', user.id);
    }

    // Invalidate checkout session token
    const sessionId = paymentData?.sessionId || paymentData?.session_id;
    if (sessionId) {
      try {
        await invalidateCheckoutSession(sessionId);
      } catch (err) {
        console.error('Failed to invalidate checkout session:', err);
      }
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

  try {
    const paymentAmount = order.grand_total;

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(paymentAmount * 100),
      currency: 'INR',
      receipt: order.id,
      notes: { orderNumber: order.order_number }
    });

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

export async function deleteOrder(orderId) {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data: order, error: orderFetchError } = await supabaseAdmin
    .from('orders')
    .select('user_id, payment_status')
    .eq('id', orderId)
    .single();

  if (orderFetchError || !order) {
    return { error: 'Order not found' };
  }

  if (order.user_id !== user.id) {
    return { error: 'Unauthorized' };
  }

  if (order.payment_status === 'paid') {
    return { error: 'Cannot delete a paid order' };
  }

  await supabaseAdmin.from('order_items').delete().eq('order_id', orderId);
  const { error } = await supabaseAdmin.from('orders').delete().eq('id', orderId);
  
  if (error) {
    console.error('Delete Order Error:', error);
    return { error: 'Failed to cleanup order' };
  }
  
  return { success: true };
}

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `FYX-${timestamp}-${random}`;
}
