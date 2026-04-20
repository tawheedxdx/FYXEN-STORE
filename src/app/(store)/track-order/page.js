export const metadata = {
  title: 'Track Order | Fyxen',
};

export default function TrackOrderPage() {
  return (
    <div className="container-custom py-24 max-w-2xl text-center">
      <h1 className="text-4xl font-bold mb-6">Track Your Order</h1>
      <p className="text-primary-600 dark:text-primary-300 mb-8">
        Enter your order ID and email address below to get real-time updates on your shipment.
      </p>

      <form className="space-y-6 text-left">
        <div>
          <label className="block text-sm font-medium mb-2">Order ID</label>
          <input type="text" className="input-field" placeholder="e.g. FYX-123456789" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <input type="email" className="input-field" placeholder="your@email.com" />
        </div>
        <button type="button" className="btn-primary w-full">Track Package</button>
      </form>
    </div>
  );
}
