export const metadata = {
  title: 'Privacy Policy | Fyxen',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-custom py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-primary dark:prose-invert max-w-none">
        <p>Last updated: April 2026</p>
        <p>Bytread International Private Limited ("we", "our", "us") respects your privacy. This policy explains how we collect, use, and safeguard your information when you visit the Fyxen website.</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p>We collect personal information that you provide to us directly, such as your name, email address, shipping address, and payment details when making a purchase. We also collect non-personal data like IP addresses and browsing behavior for analytics.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <p>Your information is used to process orders, communicate with you regarding your purchases, and improve our platform's overall user experience.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Security</h2>
        <p>We employ industry-standard security measures, including SSL encryption and secure payment gateways (Razorpay), to protect your data. Your payment information is never stored on our servers.</p>
      </div>
    </div>
  );
}
