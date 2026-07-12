import ContactForm from './ContactForm';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Contact Us | Fyxen',
  description: 'Get in touch with Fyxen for any inquiries or support.',
};

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('settings').select('*').single();

  const parentCompany = settings?.parent_company_name || 'Bytread International Private Limited';
  const address = settings?.address || '123 Premium Tower, Business Park\nMumbai, Maharashtra 400001\nIndia';
  const supportEmail = settings?.support_email || 'support@fyxen.com';
  const supportPhone = settings?.support_phone || '+91 98765 43210';

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
            <p className="text-primary-600 dark:text-primary-300 leading-relaxed whitespace-pre-wrap">
              <span className="font-medium text-primary-900 dark:text-white">{parentCompany}</span><br />
              {address}
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              Direct Contact
            </h3>
            <div className="space-y-2 text-primary-600 dark:text-primary-300">
              <p className="flex items-center gap-2">
                <span className="font-medium text-primary-900 dark:text-white">Email:</span> {supportEmail}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium text-primary-900 dark:text-white">Phone:</span> {supportPhone}
              </p>
            </div>
          </div>

          <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-white/10">
            <h4 className="font-bold text-primary-900 dark:text-white mb-2">Business Hours</h4>
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
