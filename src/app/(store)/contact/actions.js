'use server';

import { createClient } from '@/lib/supabase/server';

export async function submitInquiry(formData) {
  const supabase = await createClient();
  
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  if (!name || !email || !message) {
    return { error: 'All fields are required.' };
  }

  const { error } = await supabase
    .from('contact_inquiries')
    .insert([{ name, email, message }]);

  if (error) {
    console.error('Error submitting inquiry:', error);
    return { error: 'Failed to send message. Please try again later.' };
  }

  return { success: true };
}
