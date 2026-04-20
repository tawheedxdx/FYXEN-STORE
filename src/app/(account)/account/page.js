import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/forms/ProfileForm';

export const metadata = {
  title: 'My Profile',
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile Details</h1>
      <ProfileForm profile={profile} user={user} />
    </div>
  );
}
