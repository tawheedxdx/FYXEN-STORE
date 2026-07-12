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

export async function upsertPromoBanner(formData) {
  const supabase = await createClient();
  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  const supabaseAdmin = createAdminClient();

  const id = formData.get('id');
  const data = {
    badge_text: formData.get('badge_text'),
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    button_text: formData.get('button_text'),
    button_link: formData.get('button_link'),
    bg_color: formData.get('bg_color'),
    text_color: formData.get('text_color'),
    is_active: formData.get('is_active') === 'true',
    updated_at: new Date().toISOString()
  };

  let res;
  if (id) {
    res = await supabaseAdmin.from('promo_banners').update(data).eq('id', id);
  } else {
    res = await supabaseAdmin.from('promo_banners').insert(data);
  }

  if (res.error) return { error: res.error.message };

  revalidatePath('/admin/promo-banner');
  revalidatePath('/');
  return { success: true };
}

export async function deletePromoBanner(id) {
  const supabase = await createClient();
  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from('promo_banners').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/promo-banner');
  revalidatePath('/');
  return { success: true };
}
