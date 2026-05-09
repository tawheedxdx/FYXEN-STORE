import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer({ settings }) {
  const currentYear = new Date().getFullYear();
  const parentCompany = settings?.parent_company_name || 'Bytread International Private Limited';
  const gstNumber = settings?.gst_number;
  const supportEmail = settings?.support_email;
  const supportPhone = settings?.support_phone;

  return (
    <footer className="bg-primary-950 text-white">
      {/* Top CTA Strip */}
      <div className="border-b border-white/5">
        <div className="container-custom py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-lg text-white">Questions? We're here.</p>
            <p className="text-primary-400 text-sm">Reach out anytime — our team responds fast.</p>
          </div>
          <Link href="/contact" className="shrink-0 btn-accent text-sm px-6 py-2.5 rounded-xl">
            Contact Support
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container-custom py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column — spans 2 */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <img src="/logo.png" alt="Fyxen Logo" className="h-16 md:h-20 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-primary-400 text-sm leading-relaxed mb-6 max-w-xs">
              Elevating everyday living with premium essentials. Crafted for those who appreciate the finer details.
            </p>
            {/* Contact Info */}
            <div className="space-y-2.5">
              {supportEmail && (
                <a href={`mailto:${supportEmail}`} className="flex items-center gap-2.5 text-sm text-primary-400 hover:text-accent transition-colors">
                  <Mail className="w-4 h-4 shrink-0 text-primary-600" />
                  {supportEmail}
                </a>
              )}
              {supportPhone && (
                <a href={`tel:${supportPhone}`} className="flex items-center gap-2.5 text-sm text-primary-400 hover:text-accent transition-colors">
                  <Phone className="w-4 h-4 shrink-0 text-primary-600" />
                  {supportPhone}
                </a>
              )}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-primary-500 mb-5">Shop</h4>
            <ul className="space-y-3">
              {[
                { href: '/shop', label: 'All Products' },
                { href: '/category/new-arrivals', label: 'New Arrivals' },
                { href: '/category/best-sellers', label: 'Best Sellers' },
                { href: '/category/sale', label: 'Sale' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-primary-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-primary-500 mb-5">Support</h4>
            <ul className="space-y-3">
              {[
                { href: '/contact', label: 'Contact Us' },
                { href: '/faq', label: 'FAQs' },
                { href: '/track-order', label: 'Track Order' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-primary-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-primary-500 mb-5">Legal</h4>
            <ul className="space-y-3">
              {[
                { href: '/shipping-policy', label: 'Shipping Policy' },
                { href: '/cancellation-refunds', label: 'Cancellations & Refunds' },
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms-and-conditions', label: 'Terms & Conditions' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-primary-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>&copy; {currentYear} Fyxen. All rights reserved.</p>
            {gstNumber && (
              <p className="sm:border-l sm:border-primary-800 sm:pl-4">GST: {gstNumber}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <p>Operated by <span className="text-primary-400 font-medium">{parentCompany}</span></p>
          </div>
        </div>
        <div className="text-center text-[10px] text-primary-600/60 pb-5">
          *Subject to Jangipur jurisdiction only.
        </div>
      </div>
    </footer>
  );
}
