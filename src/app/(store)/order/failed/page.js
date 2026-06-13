import { createClient } from '@/lib/supabase/server';
import FailedView from './FailedView';

export const metadata = {
  title: 'Payment Not Verified | Fyxen',
};

export default async function OrderFailedPage({ searchParams }) {
  const { id } = await searchParams;
  const supabase = await createClient();
  const { data: order } = await supabase.from('orders').select('order_number').eq('id', id).single();

  return <FailedView orderId={id} orderNumber={order?.order_number} />;
}
