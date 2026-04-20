export const metadata = {
  title: 'FAQ | Fyxen',
};

export default function FAQPage() {
  const faqs = [
    {
      q: 'How long does shipping take?',
      a: 'We process orders within 1-2 business days. Delivery typically takes 2-3 business days for Metro cities and 4-7 business days for the rest of India.'
    },
    {
      q: 'What is your return policy?',
      a: 'We offer a 15-day hassle-free return policy. If you are not satisfied with your purchase, you can return it within 15 days of delivery for a full refund.'
    },
    {
      q: 'Do you ship internationally?',
      a: 'Currently, Fyxen only ships within India. We plan to expand internationally soon.'
    },
    {
      q: 'How can I track my order?',
      a: 'Once your order ships, you will receive a tracking link via email and SMS. You can also track your order through the Track Order page using your Order ID.'
    }
  ];

  return (
    <div className="container-custom py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
      
      <div className="space-y-6 mt-8">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-primary-200 dark:border-white/10 p-6 rounded-xl bg-white dark:bg-black">
            <h3 className="text-xl font-semibold mb-2">{faq.q}</h3>
            <p className="text-primary-600 dark:text-primary-300">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
