import { createClient } from '@/lib/supabase/server';
import AnnouncementBannerClient from './AnnouncementBannerClient';
import Navbar from './Navbar';

export default async function Header() {
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

  return (
    <div className={announcement?.is_sticky ? 'sticky top-0 z-50' : 'relative'}>
      <AnnouncementBannerClient announcement={announcement} />
      <Navbar isInsideStickyHeader={announcement?.is_sticky} />
    </div>
  );
}
