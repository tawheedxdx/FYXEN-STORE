import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminSettingsForm from '@/components/admin/AdminSettingsForm';

export const metadata = { title: 'Settings | Admin' };

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: settings } = await supabase.from('settings').select('*').single();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900">Store Settings</h1>
        <p className="text-primary-500 mt-1">Manage your store details and configuration.</p>
      </div>
      <AdminSettingsForm settings={settings} />
    </div>
  );
}
