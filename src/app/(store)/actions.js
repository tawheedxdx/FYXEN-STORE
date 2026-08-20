'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit } from '@/lib/rate-limit';
import { revalidatePath } from 'next/cache';

export async function subscribeNewsletter(formData) {
  const rateLimit = await checkRateLimit('newsletter', 8, 10 * 60 * 1000); // 8 attempts per 10 minutes
  if (!rateLimit.success) return { error: rateLimit.error };

  const supabase = await createClient();
  const rawEmail = formData.get('email')?.toString().trim();
  
  if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
    return { error: 'Please enter a valid email address.' };
  }

  const email = rawEmail.toLowerCase();

  // Security check: Check site mode
  const { data: settings } = await supabase.from('settings').select('site_mode').single();
  if (settings?.site_mode !== 'online') {
    return { error: 'Service is currently unavailable due to maintenance.' };
  }

  const adminClient = createAdminClient();

  // 1. Check if already subscribed in newsletter_subscribers OR contact_inquiries
  const [{ data: existingSub }, { data: existingInq }] = await Promise.all([
    adminClient
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .maybeSingle(),
    adminClient
      .from('contact_inquiries')
      .select('id')
      .eq('email', email)
      .or('message.ilike.%Newsletter%,message.ilike.%VIP%')
      .maybeSingle(),
  ]);

  if (existingSub || existingInq) {
    // If already subscribed, DO NOT save duplicate email to database
    return { 
      success: true, 
      alreadySubscribed: true, 
      discountCode: 'WELCOME10',
      message: 'You are already a registered VIP Member!' 
    };
  }

  // 2. Insert into newsletter_subscribers table
  const { error: subError } = await adminClient
    .from('newsletter_subscribers')
    .insert({
      email,
      source: 'homepage_vip_club',
      discount_code: 'WELCOME10',
      status: 'active',
    });

  if (subError) {
    console.error('Newsletter subscribers table error:', subError);
    if (subError.code === '23505') {
      return { 
        success: true, 
        alreadySubscribed: true, 
        discountCode: 'WELCOME10',
        message: 'You are already a registered VIP Member!' 
      };
    }
  }

  // 3. Store in contact_inquiries for unified logging only if new
  await adminClient
    .from('contact_inquiries')
    .insert([{ 
      name: 'VIP Club Subscriber', 
      email, 
      message: 'FYXEN VIP Club - 10% Off First Order Subscription' 
    }]);

  revalidatePath('/admin/subscribers', 'page');
  revalidatePath('/admin/inquiries', 'page');

  return { 
    success: true, 
    alreadySubscribed: false,
    discountCode: 'WELCOME10',
    message: 'Welcome to the FYXEN VIP Club!' 
  };
}
