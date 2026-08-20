'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitReview(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Please sign in to leave a review.' };
  }

  const productId = formData.get('productId');
  const rating = parseInt(formData.get('rating'), 10);
  const comment = formData.get('comment')?.toString().trim();

  if (!productId) {
    return { error: 'Product ID is required.' };
  }

  if (!rating || rating < 1 || rating > 5) {
    return { error: 'Please provide a valid rating between 1 and 5 stars.' };
  }

  if (!comment) {
    return { error: 'Please enter your review feedback.' };
  }

  // 1. Verified Purchase Check: User MUST have an active/paid order containing this product
  const { data: purchase, error: purchaseError } = await supabase
    .from('order_items')
    .select(`
      id,
      orders!inner (
        id,
        user_id,
        payment_status,
        order_status
      )
    `)
    .eq('product_id', productId)
    .eq('orders.user_id', user.id)
    .in('orders.payment_status', ['paid', 'pending'])
    .not('orders.order_status', 'in', '("cancelled","refunded")')
    .limit(1)
    .maybeSingle();

  if (purchaseError || !purchase) {
    return { error: 'Only verified customers who have purchased this product can leave a review.' };
  }

  // 2. Prevent duplicate reviews per user per product
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('product_id', productId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existingReview) {
    return { error: 'You have already submitted a review for this product.' };
  }

  // 3. Insert review
  const { error: insertError } = await supabase
    .from('reviews')
    .insert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment,
      is_verified: true,
    });

  if (insertError) {
    console.error('Error submitting review:', insertError);
    if (insertError.code === '23505') {
      return { error: 'You have already reviewed this product.' };
    }
    return { error: 'Failed to submit review. Please try again.' };
  }

  revalidatePath('/product/[slug]', 'page');
  revalidatePath('/', 'page');
  return { success: true };
}
