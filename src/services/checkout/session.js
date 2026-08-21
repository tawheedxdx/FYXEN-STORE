'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCart } from '@/app/(store)/cart/actions';
import crypto from 'crypto';

/**
 * Creates a cryptographically random 5-minute temporary checkout session token
 */
export async function createCheckoutSession() {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      error: 'auth_required',
      redirectUrl: '/login?redirect=/cart'
    };
  }

  // Fetch cart
  const { items, subtotal } = await getCart();
  if (!items || items.length === 0) {
    return {
      error: 'cart_empty',
      message: 'Your cart is empty. Please add products before checking out.'
    };
  }

  // Generate secure random token e.g. cs_e4hd-hgd6-hgdj6dj-4hd7
  const randomHex = crypto.randomBytes(12).toString('hex');
  const token = `cs_${randomHex.slice(0, 4)}-${randomHex.slice(4, 8)}-${randomHex.slice(8, 16)}-${randomHex.slice(16, 20)}`;
  
  // 5 Minutes validity
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const { data: session, error } = await adminSupabase
    .from('checkout_sessions')
    .insert({
      session_token: token,
      user_id: user.id,
      cart_snapshot: { items, subtotal },
      expires_at: expiresAt,
      is_used: false,
      created_at: new Date().toISOString()
    })
    .select('id, session_token, expires_at')
    .single();

  if (error) {
    console.error('Failed to create checkout session:', error);
    return { error: 'session_creation_failed', message: error.message };
  }

  // Determine redirect domain
  const isProd = process.env.NODE_ENV === 'production';
  const redirectUrl = isProd
    ? `https://securecheckout.fyxen.in/checkout?session_id=${token}`
    : `/checkout?session_id=${token}`;

  return {
    success: true,
    sessionToken: token,
    redirectUrl,
    expiresAt
  };
}

/**
 * Validates whether a checkout session token is active and not expired
 */
export async function validateCheckoutSession(token, userId) {
  if (!token) {
    return { valid: false, error: 'no_session' };
  }

  const adminSupabase = createAdminClient();

  const { data: session, error } = await adminSupabase
    .from('checkout_sessions')
    .select('*')
    .eq('session_token', token)
    .maybeSingle();

  if (error || !session) {
    return { valid: false, error: 'invalid_session' };
  }

  if (userId && session.user_id !== userId) {
    return { valid: false, error: 'unauthorized_session' };
  }

  if (session.is_used) {
    return { valid: false, error: 'session_already_used' };
  }

  const now = new Date();
  const expiresAt = new Date(session.expires_at);

  if (now > expiresAt) {
    return { valid: false, error: 'session_expired' };
  }

  const remainingSeconds = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));

  return {
    valid: true,
    session,
    remainingSeconds,
    expiresAt: session.expires_at
  };
}

/**
 * Marks a checkout session as used upon order completion
 */
export async function invalidateCheckoutSession(token) {
  if (!token) return;
  const adminSupabase = createAdminClient();
  await adminSupabase
    .from('checkout_sessions')
    .update({ is_used: true, updated_at: new Date().toISOString() })
    .eq('session_token', token);
}
