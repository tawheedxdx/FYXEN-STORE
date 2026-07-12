import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'My Addresses | Fyxen',
};

export default async function AddressesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Saved Addresses</h1>
        <button className="btn-primary">Add New Address</button>
      </div>
      
      {!addresses || addresses.length === 0 ? (
        <div className="text-center py-12 border border-primary-100 rounded-lg bg-primary-50">
          <p className="text-primary-600">You don't have any saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map(address => (
            <div key={address.id} className="border border-primary-200 rounded-lg p-6 relative">
              {address.is_default && (
                <span className="absolute top-4 right-4 bg-primary-100 text-primary-800 text-xs font-bold px-2 py-1 rounded">DEFAULT</span>
              )}
              <h3 className="font-bold text-lg mb-2">{address.full_name}</h3>
              <p className="text-primary-600 text-sm mb-1">{address.phone}</p>
              <p className="text-primary-600 text-sm leading-relaxed">
                {address.line1}<br />
                {address.line2 && <>{address.line2}<br /></>}
                {address.city}, {address.state} {address.postal_code}<br />
                {address.country}
              </p>
              <div className="mt-4 pt-4 border-t border-primary-100 flex gap-4">
                <button className="text-sm font-medium text-accent hover:underline">Edit</button>
                <button className="text-sm font-medium text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
