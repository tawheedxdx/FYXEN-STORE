'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData) {
  const supabase = await createClient();
  const identifier = formData.get('identifier'); // email or phone
  const password = formData.get('password');

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

export async function sendOTP(phone) {
  const supabase = await createClient();
  const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

  const { error } = await supabase.auth.signInWithOtp({
    phone: formattedPhone,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function verifyOTP(phone, token) {
  const supabase = await createClient();
  const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

  const { data, error } = await supabase.auth.verifyOtp({
    phone: formattedPhone,
    token,
    type: 'sms',
  });

  if (error) return { error: error.message };
  return { success: true, user: data.user };
}

export async function completeSignup(formData) {
  const supabase = await createClient();
  const email = formData.get('email');
  const password = formData.get('password');
  const fullName = formData.get('fullName');

  const { data, error } = await supabase.auth.updateUser({
    email,
    password,
    data: { full_name: fullName }
  });

  if (error) return { error: error.message };

  // Sync with public.profiles table
  await supabase
    .from('profiles')
    .update({ email, full_name: fullName })
    .eq('id', data.user.id);

  revalidatePath('/', 'layout');
  redirect('/account');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
