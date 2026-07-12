import { createClient } from '@/lib/supabase/server';
import SuccessView from './SuccessView';

export async function generateMetadata({ searchParams }) {
  const { id } = await searchParams;
  const supabase = await createClient();
  const { data: order } = await supabase.from('orders').select('payment_status').eq('id', id).single();
  
  let title = 'Payment Verified';
  if (order?.payment_status === 'cod') {
    title = 'Order Placed';
  } else if (order?.payment_status === 'partial_paid') {
    title = 'Booking Confirmed';
  }
  
  return {
    title: `${title} | Fyxen`,
  };
}

export default async function OrderSuccessPage({ searchParams }) {
  const { id } = await searchParams;
  const supabase = await createClient();
  const { data: order } = await supabase.from('orders').select('payment_status, order_number').eq('id', id).single();

  return <SuccessView orderId={id} orderNumber={order?.order_number} paymentStatus={order?.payment_status} />;
}
