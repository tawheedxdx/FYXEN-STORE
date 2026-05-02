import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Users | Admin' };

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900">Users</h1>
        <p className="text-primary-500 mt-1">{users?.length || 0} registered users</p>
      </div>

      <div className="bg-white rounded-xl border border-primary-100 overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse text-sm min-w-[600px]">
          <thead>
            <tr className="bg-primary-50 text-primary-600">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Phone</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-100">
            {users?.map(u => (
              <tr key={u.id} className="hover:bg-primary-50/50 transition-colors">
                <td className="p-4 font-medium text-primary-900">{u.full_name || '—'}</td>
                <td className="p-4 text-primary-600">{u.email}</td>
                <td className="p-4 text-primary-600">{u.phone || '—'}</td>
                <td className="p-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${
                    u.role === 'admin' ? 'bg-primary-900 text-white' : 'bg-primary-100 text-primary-600'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-primary-500">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
