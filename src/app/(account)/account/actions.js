'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const fullName = formData.get('fullName');
  const phone = formData.get('phone');

  const { error } = await supabase
    .from('profiles')
    .update({ 
      full_name: fullName,
      phone: phone,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/account');
  return { success: true };
}
