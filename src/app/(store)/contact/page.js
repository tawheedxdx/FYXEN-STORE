import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact Us | Fyxen',
  description: 'Get in touch with Fyxen for any inquiries or support.',
};

export default function ContactPage() {
  return (
    <div className="container-custom py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-primary-600 dark:text-primary-300 max-w-2xl mx-auto">
          We would love to hear from you. For any inquiries, please fill out the form below or reach out to us through our direct channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="bg-white dark:bg-primary-900/10 border border-primary-100 dark:border-white/10 p-6 md:p-8 rounded-2xl shadow-sm">
          <ContactForm />
        </div>

        <div className="space-y-8 md:pt-4">
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              Corporate Headquarters
            </h3>
            <p className="text-primary-600 dark:text-primary-300 leading-relaxed">
              Bytread International Private Limited<br />
              123 Premium Tower, Business Park<br />
              Mumbai, Maharashtra 400001<br />
              India
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              Direct Contact
            </h3>
            <div className="space-y-2 text-primary-600 dark:text-primary-300">
              <p className="flex items-center gap-2">
                <span className="font-medium text-primary-900 dark:text-white">Email:</span> support@fyxen.com
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium text-primary-900 dark:text-white">Phone:</span> +91 98765 43210
              </p>
            </div>
          </div>

          <div className="p-6 bg-accent/5 rounded-2xl border border-accent/10">
            <h4 className="font-bold text-accent mb-2">Business Hours</h4>
            <p className="text-sm text-primary-600 dark:text-primary-400">
              Monday — Friday: 9:00 AM - 6:00 PM<br />
              Saturday: 10:00 AM - 2:00 PM<br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
