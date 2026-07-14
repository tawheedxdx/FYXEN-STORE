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

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').trim();
}

export async function createCategory(formData) {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();
  
  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  const name = formData.get('name');
  const slug = formData.get('slug') || slugify(name);
  const description = formData.get('description');
  const image = formData.get('image');

  let imageUrl = null;
  if (image && image.size > 0) {
    const ext = image.name.split('.').pop();
    const fileName = `${slug}-${Date.now()}.${ext}`;
    
    const { error: uploadError } = await adminSupabase.storage
      .from('category-images')
      .upload(fileName, image, { contentType: image.type, upsert: true });

    if (uploadError) {
      console.error('Category image upload error:', uploadError);
      return { error: 'Failed to upload image: ' + uploadError.message };
    }

    const { data: urlData } = adminSupabase.storage.from('category-images').getPublicUrl(fileName);
    imageUrl = urlData.publicUrl;
  }

  const parentId = formData.get('parentId');

  const { error } = await adminSupabase.from('categories').insert({
    name,
    slug,
    description,
    image_url: imageUrl,
    is_active: formData.get('isActive') === 'true' || formData.get('isActive') === null,
    parent_id: parentId === 'none' ? null : parentId || null,
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/');
  revalidatePath('/shop');
  return { success: true };
}

export async function updateCategory(categoryId, formData) {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  const name = formData.get('name');
  const slug = formData.get('slug') || slugify(name);
  const image = formData.get('image');

  let imageUrl = formData.get('existingImageUrl') || null;

  if (image && image.size > 0) {
    const ext = image.name.split('.').pop();
    const fileName = `${slug}-${Date.now()}.${ext}`;
    
    const { error: uploadError } = await adminSupabase.storage
      .from('category-images')
      .upload(fileName, image, { contentType: image.type, upsert: true });

    if (uploadError) {
      console.error('Category image upload error:', uploadError);
      return { error: 'Failed to upload image: ' + uploadError.message };
    }

    const { data: urlData } = adminSupabase.storage.from('category-images').getPublicUrl(fileName);
    imageUrl = urlData.publicUrl;
  }

  const parentId = formData.get('parentId');

  const { error } = await adminSupabase.from('categories').update({
    name,
    slug,
    description: formData.get('description'),
    image_url: imageUrl,
    is_active: formData.get('isActive') === 'true',
    parent_id: parentId === 'none' ? null : parentId || null,
    updated_at: new Date().toISOString(),
  }).eq('id', categoryId);

  if (error) return { error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/');
  revalidatePath('/shop');
  return { success: true };
}

export async function deleteCategory(categoryId) {
  const supabase = await createClient();
  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase.from('categories').delete().eq('id', categoryId);
  if (error) return { error: error.message };
  revalidatePath('/admin/categories');
  return { success: true };
}
