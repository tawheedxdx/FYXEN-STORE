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

export async function upsertQuestion(formData) {
  const supabase = await createClient();
  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  const id = formData.get('id');
  const questionText = formData.get('questionText');
  const type = formData.get('type');
  const required = formData.get('required') === 'true';
  const optionsRaw = formData.get('options') || '[]';
  
  let options = [];
  try {
    options = JSON.parse(optionsRaw);
  } catch (e) {
    options = optionsRaw.split(',').map(o => o.trim()).filter(Boolean);
  }

  const payload = {
    question_text: questionText,
    type,
    required,
    options,
    updated_at: new Date().toISOString()
  };

  let error;
  if (id) {
    ({ error } = await supabase.from('return_questions').update(payload).eq('id', id));
  } else {
    ({ error } = await supabase.from('return_questions').insert(payload));
  }

  if (error) return { error: error.message };
  revalidatePath('/admin/returns/questions');
  return { success: true };
}

export async function deleteQuestion(id) {
  const supabase = await createClient();
  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase.from('return_questions').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/returns/questions');
  return { success: true };
}

export async function toggleQuestionStatus(id, isActive) {
  const supabase = await createClient();
  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('return_questions')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/returns/questions');
  return { success: true };
}
