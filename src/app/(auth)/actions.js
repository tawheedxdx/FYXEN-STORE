'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';

export async function login(formData) {
  const rateLimit = await checkRateLimit('login', 5, 5 * 60 * 1000); // 5 attempts per 5 minutes
  if (!rateLimit.success) return { error: rateLimit.error };

  const supabase = await createClient();
  const identifier = formData.get('identifier'); // email or phone
  const password = formData.get('password');

  if (!identifier || !password) {
    return { error: 'Please provide both email/phone and password.' };
  }

  const isEmail = identifier.includes('@');
  
  const { error } = await supabase.auth.signInWithPassword(
    isEmail 
      ? { email: identifier, password } 
      : { phone: identifier.startsWith('+') ? identifier : `+91${identifier}`, password }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/account');
}

export async function signup(formData) {
  const rateLimit = await checkRateLimit('signup', 3, 10 * 60 * 1000); // 3 attempts per 10 minutes
  if (!rateLimit.success) return { error: rateLimit.error };

  const supabase = await createClient();
  const email = formData.get('email');
  const password = formData.get('password');
  const fullName = formData.get('fullName');
  const phone = formData.get('phone');

  const acceptPolicies = formData.get('acceptPolicies') === 'on' || formData.get('acceptPolicies') === 'true';
  if (!acceptPolicies) {
    return { error: 'Please accept the Terms & Conditions and Privacy Policy before creating your account.' };
  }

  if (!email || !password || !fullName || !phone) {
    return { error: 'All fields are required.' };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone
      }
    }
  });

  if (error) return { error: error.message };

  if (data.user) {
    // Sync with profiles table and save terms acceptance proof
    await supabase
      .from('profiles')
      .update({ 
        phone, 
        full_name: fullName,
        terms_accepted: true,
        terms_accepted_at: new Date().toISOString(),
        terms_version: 'v1.0'
      })
      .eq('id', data.user.id);
  }

  revalidatePath('/', 'layout');
  redirect('/account');
}

export async function continueAsGuest(formData) {
  const rateLimit = await checkRateLimit('guest', 5, 10 * 60 * 1000); // 5 attempts per 10 minutes
  if (!rateLimit.success) return { error: rateLimit.error };

  const supabase = await createClient();
  const fullName = formData.get('fullName');
  const phone = formData.get('phone');

  if (!fullName || !phone) {
    return { error: 'Name and phone are required for guest access.' };
  }
  
  // Create a guest session using anonymous auth or placeholder
  // We'll use a placeholder email for guests to keep it consistent with the schema
  const guestId = Math.random().toString(36).slice(2, 10);
  const guestEmail = `guest_${guestId}@fyxen.guest`;
  const guestPassword = `guest_${guestId}_pass`;

  const { data, error } = await supabase.auth.signUp({
    email: guestEmail,
    password: guestPassword,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
        is_guest: true
      }
    }
  });

  if (error) return { error: error.message };

  if (data.user) {
    await supabase
      .from('profiles')
      .update({ phone, full_name: fullName, is_guest: true })
      .eq('id', data.user.id);
  }

  revalidatePath('/', 'layout');
  redirect('/shop');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
