'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export async function createWalletRechargeOrder(amount) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Please sign in to recharge your wallet.' };
  }

  if (amount < 1) {
    return { error: 'Minimum recharge amount is ₹1.' };
  }

  try {
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // in paise
      currency: 'INR',
      receipt: `wlt_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: { userId: user.id, type: 'wallet_recharge' }
    });

    return {
      success: true,
      rzpOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      userEmail: user.email,
    };
  } catch (error) {
    console.error('Wallet Recharge Full Error:', error);
    const errorMessage = error.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    return { error: `Failed to initialize recharge payment: ${errorMessage}` };
  }
}

export async function verifyWalletRecharge(paymentData) {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = paymentData;

  const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
  
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generatedSignature === razorpay_signature) {
    // 1. Fetch Order Details from Razorpay to get User and Amount
    let rzpOrder;
    try {
      rzpOrder = await razorpay.orders.fetch(razorpay_order_id);
    } catch (err) {
      console.error('RZP Fetch Error:', err);
      return { error: 'Failed to verify payment details with provider.' };
    }

    const userId = rzpOrder.notes?.userId;
    const amount = rzpOrder.amount / 100; // convert paise back to rupees

    if (!userId) {
      return { error: 'Invalid transaction metadata.' };
    }

    // 2. Create the completed transaction record
    const { data: transaction, error: txError } = await supabaseAdmin
      .from('wallet_transactions')
      .insert({
        user_id: userId,
        amount: amount,
        type: 'recharge',
        status: 'completed',
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        description: 'Wallet Recharge'
      })
      .select('user_id, amount')
      .single();

    if (txError || !transaction) {
      console.error('Transaction Record Error:', txError);
      return { error: 'Failed to record the completed transaction.' };
    }

    // 3. Update User Balance
    const { data: success } = await supabaseAdmin.rpc('adjust_wallet_balance', {
      p_user_id: transaction.user_id,
      p_amount: transaction.amount
    });

    if (!success) {
      return { error: 'Failed to update wallet balance. Please contact support.' };
    }

    revalidatePath('/account/wallet');
    return { success: true };
  } else {
    await supabaseAdmin
      .from('wallet_transactions')
      .update({ status: 'failed' })
      .eq('razorpay_order_id', razorpay_order_id);
      
    return { error: 'Payment verification failed.' };
  }
}

export async function markWelcomeAsSeen() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  await supabase
    .from('profiles')
    .update({ has_seen_welcome: true })
    .eq('id', user.id);

  revalidatePath('/');
  return { success: true };
}
