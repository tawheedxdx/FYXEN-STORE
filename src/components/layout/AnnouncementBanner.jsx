import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AnnouncementBanner() {
  const supabase = await createClient();
  
  const { data: announcement } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .lte('starts_at', new Date().toISOString())
    .or(`ends_at.is.null,ends_at.gte.${new Date().toISOString()}`)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!announcement) return null;

  const content = (
    <div 
      className="py-2.5 px-4 text-center text-sm font-medium transition-all"
      style={{ 
        backgroundColor: announcement.bg_color, 
        color: announcement.text_color 
      }}
    >
      {announcement.content}
    </div>
  );

  if (announcement.link_url) {
    return (
      <Link href={announcement.link_url} className="block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
