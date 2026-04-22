'use server';

import { createClient } from '@/lib/supabase/server';
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
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('category-images')
      .upload(fileName, image, { contentType: image.type, upsert: true });

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('category-images').getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }
  }

  const { error } = await supabase.from('categories').insert({
    name,
    slug,
    description,
    image_url: imageUrl,
    is_active: true,
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/');
  revalidatePath('/shop');
  return { success: true };
}

export async function updateCategory(categoryId, formData) {
  const supabase = await createClient();
  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  const name = formData.get('name');
  const slug = formData.get('slug') || slugify(name);
  const image = formData.get('image');

  let imageUrl = formData.get('existingImageUrl') || null;

  if (image && image.size > 0) {
    const ext = image.name.split('.').pop();
    const fileName = `${slug}-${Date.now()}.${ext}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('category-images')
      .upload(fileName, image, { contentType: image.type, upsert: true });

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('category-images').getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }
  }

  const { error } = await supabase.from('categories').update({
    name,
    slug,
    description: formData.get('description'),
    image_url: imageUrl,
    is_active: formData.get('isActive') !== 'false',
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
