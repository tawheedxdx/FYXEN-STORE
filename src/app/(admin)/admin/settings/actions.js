'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function upsertSettings(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return { error: 'Unauthorized' };

  const { data: existing } = await supabase.from('settings').select('id').single();

  const payload = {
    company_name: formData.get('companyName'),
    parent_company_name: formData.get('parentCompanyName'),
    support_email: formData.get('supportEmail'),
    support_phone: formData.get('supportPhone'),
    address: formData.get('address'),
    gst_number: formData.get('gstNumber'),
    updated_at: new Date().toISOString(),
  };

  let error;
  if (existing?.id) {
    ({ error } = await supabase.from('settings').update(payload).eq('id', existing.id));
  } else {
    ({ error } = await supabase.from('settings').insert(payload));
  }

  if (error) return { error: error.message };
  revalidatePath('/admin/settings');
  return { success: true };
}
