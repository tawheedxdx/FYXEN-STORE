'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

async function checkAdmin(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return null;
  return user;
}

export async function getOffers() {
  const supabase = await createClient();
  const user = await checkAdmin(supabase);
  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createOffer(formData) {
  const supabase = await createClient();
  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  const supabaseAdmin = createAdminClient();

  const title = formData.get('title');
  const subtitle = formData.get('subtitle') || null;
  const description = formData.get('description') || null;
  const terms = formData.get('terms') || null;
  const startsAt = formData.get('starts_at');
  const endsAt = formData.get('ends_at');
  const active = formData.get('active') === 'true';
  
  const eligibleProductIdsRaw = formData.get('eligible_product_ids');
  let eligibleProductIds = [];
  try {
    eligibleProductIds = eligibleProductIdsRaw ? JSON.parse(eligibleProductIdsRaw) : [];
  } catch (e) {
    console.error('Failed to parse eligible product IDs:', e);
  }

  // Handle Image Upload
  const image = formData.get('image');
  let imageUrl = null;
  if (image && image.size > 0) {
    const ext = image.name.split('.').pop();
    const fileName = `offer-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('banners')
      .upload(fileName, image, { contentType: image.type, upsert: true });

    if (uploadError) {
      console.error('Offer image upload error:', uploadError);
      return { error: 'Failed to upload image: ' + uploadError.message };
    }

    const { data: urlData } = supabaseAdmin.storage.from('banners').getPublicUrl(fileName);
    imageUrl = urlData.publicUrl;
  }

  const { error } = await supabaseAdmin.from('offers').insert({
    title,
    subtitle,
    description,
    terms,
    starts_at: startsAt,
    ends_at: endsAt,
    image_url: imageUrl,
    active,
    eligible_product_ids: eligibleProductIds
  });

  if (error) return { error: error.message };

  revalidatePath('/admin/offers');
  revalidatePath('/');
  return { success: true };
}

export async function updateOffer(id, formData) {
  const supabase = await createClient();
  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  const supabaseAdmin = createAdminClient();

  const title = formData.get('title');
  const subtitle = formData.get('subtitle') || null;
  const description = formData.get('description') || null;
  const terms = formData.get('terms') || null;
  const startsAt = formData.get('starts_at');
  const endsAt = formData.get('ends_at');
  const active = formData.get('active') === 'true';
  const currentImageUrl = formData.get('current_image_url') || null;
  
  const eligibleProductIdsRaw = formData.get('eligible_product_ids');
  let eligibleProductIds = [];
  try {
    eligibleProductIds = eligibleProductIdsRaw ? JSON.parse(eligibleProductIdsRaw) : [];
  } catch (e) {
    console.error('Failed to parse eligible product IDs:', e);
  }

  // Handle Image Upload
  const image = formData.get('image');
  let imageUrl = currentImageUrl;
  if (image && image.size > 0) {
    const ext = image.name.split('.').pop();
    const fileName = `offer-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('banners')
      .upload(fileName, image, { contentType: image.type, upsert: true });

    if (uploadError) {
      console.error('Offer image upload error:', uploadError);
      return { error: 'Failed to upload image: ' + uploadError.message };
    }

    const { data: urlData } = supabaseAdmin.storage.from('banners').getPublicUrl(fileName);
    imageUrl = urlData.publicUrl;
  }

  const { error } = await supabaseAdmin.from('offers').update({
    title,
    subtitle,
    description,
    terms,
    starts_at: startsAt,
    ends_at: endsAt,
    image_url: imageUrl,
    active,
    eligible_product_ids: eligibleProductIds
  }).eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/offers');
  revalidatePath('/');
  return { success: true };
}

export async function deleteOffer(id) {
  const supabase = await createClient();
  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from('offers').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/offers');
  revalidatePath('/');
  return { success: true };
}

export async function toggleOfferStatus(id, currentStatus) {
  const supabase = await createClient();
  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin
    .from('offers')
    .update({ active: !currentStatus })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/offers');
  revalidatePath('/');
  return { success: true };
}
