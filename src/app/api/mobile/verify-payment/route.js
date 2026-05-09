import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
    
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    const supabaseAdmin = createAdminClient();

    if (generatedSignature === razorpay_signature) {
      // Payment verified
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
        .select('coupon_id, user_id, grand_total')
        .single();

      if (updatedOrder) {
        // Increment coupon usage
        if (updatedOrder.coupon_id) {
          await supabaseAdmin.rpc('increment_coupon_usage', { coupon_uuid: updatedOrder.coupon_id });
        }
      }

      // Save Payment Record
      await supabaseAdmin
        .from('payments')
        .insert({
          order_id: orderId,
          provider_order_id: razorpay_order_id,
          provider_payment_id: razorpay_payment_id,
          status: 'captured',
          amount: 0, 
        });

      // Clear Cart handled on mobile client

      return NextResponse.json({ success: true });
    } else {
      // Invalid signature
      await supabaseAdmin
        .from('orders')
        .update({ payment_status: 'failed' })
        .eq('id', orderId);
        
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

  } catch (error) {
    console.error('Mobile verify-payment error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
