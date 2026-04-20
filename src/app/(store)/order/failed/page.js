import FailedView from './FailedView';

export const metadata = {
  title: 'Payment Not Verified | Fyxen',
};

export default async function OrderFailedPage({ searchParams }) {
  const { id } = await searchParams;

  return <FailedView orderId={id} />;
}
