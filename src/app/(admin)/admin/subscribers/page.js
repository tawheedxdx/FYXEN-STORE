import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import SubscribersClient from './SubscribersClient';

export const metadata = {
  title: 'VIP Club Subscribers | FYXEN Admin',
  description: 'Manage and export email subscribers collected from the FYXEN VIP Club.',
};

export default async function SubscribersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/');

  const adminClient = createAdminClient();

  // Fetch subscribers from newsletter_subscribers table
  const { data: tableSubscribers, error: tableError } = await adminClient
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  // Fallback / legacy merge from contact_inquiries
  const { data: inquirySubscribers } = await adminClient
    .from('contact_inquiries')
    .select('*')
    .or('message.ilike.%Newsletter%,message.ilike.%VIP%')
    .order('created_at', { ascending: false });

  const emailSet = new Set();
  const mergedSubscribers = [];

  (tableSubscribers || []).forEach((sub) => {
    const email = sub.email?.toLowerCase().trim();
    if (email && !emailSet.has(email)) {
      emailSet.add(email);
      mergedSubscribers.push(sub);
    }
  });

  (inquirySubscribers || []).forEach((inq) => {
    const email = inq.email?.toLowerCase().trim();
    if (email && !emailSet.has(email)) {
      emailSet.add(email);
      mergedSubscribers.push({
        id: inq.id,
        email,
        source: 'homepage_vip_club',
        discount_code: 'WELCOME10',
        status: 'active',
        created_at: inq.created_at,
      });
    }
  });

  // Sort by latest created_at
  mergedSubscribers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return <SubscribersClient initialSubscribers={mergedSubscribers} />;
}
