export const metadata = {
  title: 'Cancellation & Refunds | Fyxen',
};

export default function CancellationRefundsPage() {
  return (
    <div className="container-custom py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Cancellation & Refunds</h1>
      
      <div className="prose prose-primary dark:prose-invert max-w-none">
        <p>This policy outlines the cancellation and refund terms for Fyxen, a brand of Bytread International Private Limited.</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Order Cancellations</h2>
        <p>You can cancel your order within 24 hours of placing it, provided it has not already been dispatched. Once dispatched, orders cannot be cancelled, but you may initiate a return upon delivery.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Returns & Replacements</h2>
        <p>We offer a 15-day return policy for unused products in their original packaging. If you receive a defective or damaged product, please contact us within 48 hours for a free replacement.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Refunds Process</h2>
        <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. Approved refunds will be processed automatically to your original method of payment within 5-7 business days.</p>
      </div>
    </div>
  );
}
