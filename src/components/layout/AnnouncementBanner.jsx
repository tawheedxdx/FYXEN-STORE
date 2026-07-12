import { unstable_cache } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import AnnouncementBannerClient from './AnnouncementBannerClient';

const getActiveAnnouncement = unstable_cache(
  async () => {
    const supabase = createAdminClient();
    const now = new Date().toISOString();

    const { data: announcement } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .lte('starts_at', now)
      .or(`ends_at.is.null,ends_at.gte.${now}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return announcement ?? null;
  },
  ['active-announcement'],
  { revalidate: 60, tags: ['announcements'] }
);

export default async function AnnouncementBanner() {
  const announcement = await getActiveAnnouncement();

  if (!announcement) return null;

  return <AnnouncementBannerClient announcement={announcement} />;
}
