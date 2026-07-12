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
  const rating = parseInt(formData.get('rating'));
  const comment = formData.get('comment');

  if (!rating || rating < 1 || rating > 5) {
    return { error: 'Please provide a rating between 1 and 5.' };
  }

  const { error } = await supabase
    .from('reviews')
    .insert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment,
    });

  if (error) {
    if (error.code === '23505') {
      return { error: 'You have already reviewed this product.' };
    }
    return { error: 'Failed to submit review. Please try again.' };
  }

  revalidatePath(`/product/[slug]`, 'page');
  return { success: true };
}
