import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export async function POST(req) {
  try {
    const { orderId, amount } = await req.json();

    if (!orderId || !amount) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Verify order exists
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('order_number, grand_total')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Create Razorpay Order
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(order.grand_total * 100), // in paise
      currency: 'INR',
      receipt: orderId,
      notes: { orderNumber: order.order_number, source: 'mobile_app' }
    });

    // Update our DB order with RZP Order ID
    await supabaseAdmin
      .from('orders')
      .update({ razorpay_order_id: rzpOrder.id })
      .eq('id', orderId);

    return NextResponse.json({
      success: true,
      rzpOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Mobile create-payment error:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
