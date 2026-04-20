import SuccessView from './SuccessView';

export const metadata = {
  title: 'Payment Verified | Fyxen',
};

export default async function OrderSuccessPage({ searchParams }) {
  const { id } = await searchParams;

  return <SuccessView orderId={id} />;
}
