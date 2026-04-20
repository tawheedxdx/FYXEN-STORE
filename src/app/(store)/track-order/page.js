import TrackOrderClient from './TrackOrderClient';

export const metadata = {
  title: 'Track Order | Fyxen',
  description: 'Track the real-time status of your Fyxen order.',
};

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
