import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Linkedin } from 'lucide-react';

export default function Footer({ settings }) {
  const currentYear = new Date().getFullYear();
  const parentCompany = settings?.parent_company_name || 'Bytread International Private Limited';
  const gstNumber = settings?.gst_number;
  const supportEmail = settings?.support_email || 'support@fyxen.in';
  const supportPhone = settings?.support_phone;

  return (
    <footer className="bg-primary-950 text-white">
      {/* Top CTA Strip */}
      <div className="border-b border-white/5">
        <div className="container-custom py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-lg text-white">Questions? We're here to help.</p>
            <p className="text-primary-400 text-sm">FYXEN Customer Care is available 24/7 across India.</p>
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
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <img src="/logo.png" alt="FYXEN Logo" className="h-16 md:h-20 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-primary-400 text-sm leading-relaxed max-w-sm">
              FYXEN is an Indian premium lifestyle brand offering thoughtfully designed home, kitchen, office and everyday utility products that simplify daily living.
            </p>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3 text-primary-400">
              <a href="https://www.instagram.com/fyxen.in" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/fyxen.in" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.youtube.com/@fyxen.india" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/company/fyxen" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            {/* Contact Info */}
            <div className="space-y-2.5 pt-2">
              {supportEmail && (
                <a href={`mailto:${supportEmail}`} className="flex items-center gap-2.5 text-sm text-primary-400 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 shrink-0 text-primary-500" />
                  {supportEmail}
                </a>
              )}
              {supportPhone && (
                <a href={`tel:${supportPhone}`} className="flex items-center gap-2.5 text-sm text-primary-400 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 shrink-0 text-primary-500" />
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
                { href: '/category/sale', label: 'Sale & Offers' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-primary-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Brand */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-primary-500 mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/faq', label: 'FAQs' },
                { href: '/track-order', label: 'Track Order' },
                { href: '/careers', label: 'Careers' },
                { href: '/press', label: 'Press & Media' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-primary-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-primary-500 mb-5">Legal & Policies</h4>
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
            <p>&copy; {currentYear} FYXEN. All rights reserved.</p>
            {gstNumber && (
              <p className="sm:border-l sm:border-primary-800 sm:pl-4">GST: {gstNumber}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <p>Operated by <span className="text-primary-300 font-medium">{parentCompany}</span></p>
          </div>
        </div>
        <div className="text-center text-xs text-primary-500 pb-8 font-medium">
          *Subject to Jangipur, West Bengal jurisdiction only.
        </div>
      </div>
    </footer>
  );
}
