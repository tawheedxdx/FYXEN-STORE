'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function upsertAnnouncement(formData) {
  const supabase = await createClient();
  
  const id = formData.get('id');
  const content = formData.get('content');
  const bg_color = formData.get('bg_color');
  const text_color = formData.get('text_color');
  const link_url = formData.get('link_url');
  const starts_at = formData.get('starts_at');
  const ends_at = formData.get('ends_at');
  const is_active = formData.get('is_active') === 'on';

  const announcementData = {
    content,
    bg_color,
    text_color,
    link_url: link_url || null,
    starts_at: starts_at || new Date().toISOString(),
    ends_at: ends_at || null,
    is_active,
  };

  let error;
  if (id) {
    const { error: updateError } = await supabase
      .from('announcements')
      .update(announcementData)
      .eq('id', id);
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from('announcements')
      .insert([announcementData]);
    error = insertError;
  }

  if (error) {
    console.error('Error saving announcement:', error);
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function deleteAnnouncement(id) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}
