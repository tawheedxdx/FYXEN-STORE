export const metadata = {
  title: 'Shipping Policy | Fyxen',
};

export default function ShippingPolicyPage() {
  return (
    <div className="container-custom py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>
      
      <div className="prose prose-primary dark:prose-invert max-w-none">
        <p>This Shipping Policy applies to all products purchased through Fyxen, operated by <strong>Bytread International Private Limited</strong>.</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Processing Timelines</h2>
        <p>All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Dispatch Timelines & Delivery Estimates</h2>
        <p>We partner with premium logistics providers to ensure fast delivery. Typical delivery times are:</p>
        <ul>
          <li><strong>Metro Cities:</strong> 2-3 business days</li>
          <li><strong>Rest of India:</strong> 4-7 business days</li>
        </ul>
        <p>Please note that these are estimates and actual delivery times may vary depending on local conditions and unforeseen circumstances.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Shipping Rates</h2>
        <p>We offer Free Express Shipping on all orders over ₹2000. For orders below ₹2000, a flat shipping fee of ₹100 applies.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Damage Reporting Expectations</h2>
        <p>If your order arrives damaged, please report it to our support team within 48 hours of delivery along with photographic evidence. Bytread International Private Limited takes full responsibility for products damaged in transit.</p>
      </div>
    </div>
  );
}
