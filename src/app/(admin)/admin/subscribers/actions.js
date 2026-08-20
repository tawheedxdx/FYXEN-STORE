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

export async function adminDeleteSubscriber(id, email) {
  try {
    await checkAdmin();

    if (!id && !email) return { error: 'Subscriber ID or email is required.' };

    const adminClient = createAdminClient();

    if (id) {
      await adminClient.from('newsletter_subscribers').delete().eq('id', id);
    }
    if (email) {
      await adminClient.from('contact_inquiries').delete().eq('email', email).eq('message', 'FYXEN VIP Club - 10% Off First Order Subscription');
    }

    revalidatePath('/admin/subscribers', 'page');
    return { success: true };
  } catch (err) {
    return { error: err.message || 'Failed to delete subscriber.' };
  }
}

export async function adminAddSubscriber(formData) {
  try {
    await checkAdmin();

    const email = formData.get('email')?.toString().trim().toLowerCase();
    const source = formData.get('source')?.toString().trim() || 'admin_manual';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: 'Please enter a valid email address.' };
    }

    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from('newsletter_subscribers')
      .upsert({
        email,
        source,
        discount_code: 'WELCOME10',
        status: 'active',
      }, { onConflict: 'email' });

    if (error) {
      return { error: error.message || 'Failed to add subscriber.' };
    }

    revalidatePath('/admin/subscribers', 'page');
    return { success: true };
  } catch (err) {
    return { error: err.message || 'Failed to add subscriber.' };
  }
}
