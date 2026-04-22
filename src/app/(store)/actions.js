'use server';

import { createClient } from '@/lib/supabase/server';

export async function subscribeNewsletter(formData) {
  const supabase = await createClient();
  const email = formData.get('email');

  if (!email) {
    return { error: 'Email is required.' };
  }

  // Check if already subscribed in contact_inquiries (optional, but good)
  const { data: existing } = await supabase
    .from('contact_inquiries')
    .select('id')
    .eq('email', email)
    .eq('message', 'Newsletter Subscription')
    .single();

  if (existing) {
    return { success: true, message: 'You are already subscribed!' };
  }

  const { error } = await supabase
    .from('contact_inquiries')
    .insert([{ 
      name: 'Newsletter Subscriber', 
      email, 
      message: 'Newsletter Subscription' 
    }]);

  if (error) {
    console.error('Newsletter error:', error);
    return { error: 'Failed to subscribe. Please try again.' };
  }

  return { success: true };
}
