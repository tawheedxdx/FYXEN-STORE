'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized: Please sign in.');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Forbidden: Admin access required.');
  }

  return user;
}

export async function adminCreateReview(formData) {
  try {
    await checkAdmin();

    const productId = formData.get('productId');
    const authorName = formData.get('authorName')?.toString().trim() || 'Verified Customer';
    const authorCity = formData.get('authorCity')?.toString().trim() || null;
    const rating = parseInt(formData.get('rating'), 10);
    const comment = formData.get('comment')?.toString().trim();
    const isVerified = formData.get('isVerified') === 'true' || formData.get('isVerified') === 'on';
    const createdAt = formData.get('createdAt') || new Date().toISOString();

    if (!productId) {
      return { error: 'Please select a product for the review.' };
    }

    if (!rating || rating < 1 || rating > 5) {
      return { error: 'Rating must be between 1 and 5 stars.' };
    }

    if (!comment) {
      return { error: 'Review comment cannot be empty.' };
    }

    const adminClient = createAdminClient();

    const { error: insertError } = await adminClient
      .from('reviews')
      .insert({
        product_id: productId,
        user_id: null, // Admin-created review
        author_name: authorName,
        author_city: authorCity,
        rating,
        comment,
        is_verified: isVerified,
        created_at: new Date(createdAt).toISOString(),
      });

    if (insertError) {
      console.error('Admin create review error:', insertError);
      return { error: insertError.message || 'Failed to create review.' };
    }

    // Get product slug for revalidation
    const { data: product } = await adminClient
      .from('products')
      .select('slug')
      .eq('id', productId)
      .single();

    if (product?.slug) {
      revalidatePath(`/product/${product.slug}`, 'page');
    }
    revalidatePath('/', 'page');
    revalidatePath('/admin/reviews', 'page');

    return { success: true };
  } catch (err) {
    return { error: err.message || 'An unexpected error occurred.' };
  }
}

export async function adminDeleteReview(reviewId) {
  try {
    await checkAdmin();

    if (!reviewId) return { error: 'Review ID is required.' };

    const adminClient = createAdminClient();

    // Get review info to revalidate product
    const { data: review } = await adminClient
      .from('reviews')
      .select('product_id, products(slug)')
      .eq('id', reviewId)
      .single();

    const { error } = await adminClient
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      return { error: error.message || 'Failed to delete review.' };
    }

    if (review?.products?.slug) {
      revalidatePath(`/product/${review.products.slug}`, 'page');
    }
    revalidatePath('/', 'page');
    revalidatePath('/admin/reviews', 'page');

    return { success: true };
  } catch (err) {
    return { error: err.message || 'An unexpected error occurred.' };
  }
}
