'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updatePageContent(slug, content) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('site_pages')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('slug', slug);

  if (error) {
    console.error('Error updating page:', error);
    return { error: error.message };
  }

  // Revalidate the store-front pages
  revalidatePath(`/(store)/${slug}`, 'page');
  revalidatePath('/(store)/faq', 'page');
  
  return { success: true };
}
