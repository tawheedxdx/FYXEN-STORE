import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import WalletClient from './WalletClient';

export const metadata = {
  title: 'My Wallet | Fyxen',
};

export default async function WalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Parallel fetch profile and transactions
  const [profileRes, transactionsRes] = await Promise.all([
    supabase.from('profiles').select('wallet_balance').eq('id', user.id).single(),
    supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
  ]);

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Wallet</h1>
      <WalletClient 
        profile={profileRes.data} 
        transactions={transactionsRes.data || []} 
      />
    </div>
  );
}
