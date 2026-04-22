import { createClient } from '@/lib/supabase/server';
import SuccessView from './SuccessView';

export async function generateMetadata({ searchParams }) {
  const { id } = await searchParams;
  const supabase = await createClient();
  const { data: order } = await supabase.from('orders').select('payment_status').eq('id', id).single();
  
  const title = order?.payment_status === 'cod' ? 'Order Placed' : 'Payment Verified';
  
  return {
    title: `${title} | Fyxen`,
  };
}

export default async function OrderSuccessPage({ searchParams }) {
  const { id } = await searchParams;
  const supabase = await createClient();
  const { data: order } = await supabase.from('orders').select('payment_status').eq('id', id).single();

  return <SuccessView orderId={id} paymentStatus={order?.payment_status} />;
}
