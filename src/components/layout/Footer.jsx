import Link from 'next/link';
import { Mail, Phone, Instagram, Facebook, Youtube, Linkedin, ShieldCheck, Truck, RotateCcw, CreditCard, Sparkles } from 'lucide-react';
import CurvedSectionDivider from '@/components/common/CurvedSectionDivider';

export default function Footer({ settings }) {
  const currentYear = new Date().getFullYear();
  const parentCompany = settings?.parent_company_name || 'Bytread International Private Limited';
  const gstNumber = settings?.gst_number;
  const supportEmail = settings?.support_email || 'support@fyxen.in';
  const supportPhone = settings?.support_phone;

  return (
    <footer className="bg-neutral-950 text-neutral-300 relative overflow-hidden">
      {/* Top Symmetrical Curved Entrance */}
      <CurvedSectionDivider variant="top-concave" />

      {/* 1. Value Props Strip */}
      <div className="border-b border-white/5 bg-neutral-900/40">
        <div className="container-custom py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#c6a87c]">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Express Pan-India Delivery</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">Fast, insured delivery to 28,000+ pin codes across India.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#c6a87c]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">100% Genuine Certified</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">Strict quality control on every single product we ship.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#c6a87c]">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">7-Day Easy Returns</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">Simple, hassle-free replacement or refund guarantee.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#c6a87c]">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Secure Online Payments</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">256-Bit SSL Encryption with UPI, Cards & NetBanking.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Directory */}
      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column — Spans 5 */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-block">
              <img
                src="/logo.png"
                alt="FYXEN"
                className="h-12 md:h-14 w-auto object-contain brightness-0 invert"
              />
            </Link>

            <p className="text-neutral-400 text-sm leading-relaxed max-w-md font-light">
              FYXEN is an Indian premium lifestyle brand engineering thoughtfully designed home, kitchen, and everyday utility essentials that enhance modern living through quality craftsmanship and timeless aesthetics.
            </p>

            {/* Social Channels */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/fyxen.in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/fyxen.in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@fyxen.india"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/fyxen"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 text-xs text-neutral-400 pt-2">
              {supportEmail && (
                <a href={`mailto:${supportEmail}`} className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-[#c6a87c]" />
                  {supportEmail}
                </a>
              )}
              {supportPhone && (
                <a href={`tel:${supportPhone}`} className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-[#c6a87c]" />
                  {supportPhone}
                </a>
              )}
            </div>

            {/* App Store Badge */}
            <div className="pt-2">
              <a
                href="https://play.google.com/store/apps/details?id=app.fyxen.android"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download FYXEN App on Google Play"
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-white group shadow-sm"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 512 512">
                  <path fill="#4285F4" d="M47.1 27.8C42.8 33.2 40 41.5 40 52.2v407.6c0 10.7 2.8 19 7.1 24.4l2.1 1.9L271 264.3v-5.6L49.2 25.9l-2.1 1.9z" />
                  <path fill="#FBBC04" d="M344.8 338.4l-73.8-74.1v-5.6l73.8-74.1 2.3 1.3 87.5 49.7c25 14.2 25 37.6 0 51.9l-87.5 49.6-2.3 1.3z" />
                  <path fill="#EA4335" d="M347.1 337.1L271 261 47.1 484.9c8.3 8.8 22 9.9 37.6 1l262.4-148.8z" />
                  <path fill="#34A853" d="M347.1 174.9L84.7 26.1c-15.6-8.9-29.3-7.8-37.6 1L271 251l76.1-76.1z" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 leading-none">Download on</div>
                  <div className="text-xs font-bold text-white leading-tight">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          {/* Shop Column — Spans 2 */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Collections</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/category/best-sellers" className="hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link href="/category/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/category/sale" className="hover:text-white transition-colors">Special Offers</Link></li>
              <li><Link href="/category/kitchen-home" className="hover:text-white transition-colors">Kitchen & Home</Link></li>
              <li><Link href="/category/office-desk" className="hover:text-white transition-colors">Office & Tech</Link></li>
            </ul>
          </div>

          {/* Brand & Support — Spans 2 */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Company</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Customer Care</Link></li>
              <li><Link href="/track-order" className="hover:text-white transition-colors">Track Shipment</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-white transition-colors">Press & Media</Link></li>
            </ul>
          </div>

          {/* Legal Policies — Spans 3 */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Policies & Trust</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping & Delivery Policy</Link></li>
              <li><Link href="/cancellation-refunds" className="hover:text-white transition-colors">Returns & Refund Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy & Data Security</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>

            <div className="pt-3 border-t border-white/5 space-y-1">
              <p className="text-[11px] text-neutral-400">
                Operating Entity: <strong className="text-neutral-200 font-semibold">{parentCompany}</strong>
              </p>
              {gstNumber && (
                <p className="text-[11px] text-neutral-400">
                  GSTIN: <span className="font-mono text-neutral-300">{gstNumber}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal Strip */}
      <div className="border-t border-white/5 bg-black/40 py-6">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-center md:text-left">
            <p>&copy; {currentYear} FYXEN. All rights reserved.</p>
            <span>•</span>
            <p>Operated by {parentCompany}</p>
          </div>

          <div className="flex items-center gap-4 text-neutral-400 text-[11px]">
            <span>100% Secure Checkout</span>
            <span>•</span>
            <span>Razorpay Verified</span>
            <span>•</span>
            <span>UPI / Cards / COD</span>
          </div>
        </div>
        <div className="text-center text-[11px] text-neutral-600 pt-3">
          *All legal matters subject to Jangipur, West Bengal jurisdiction only.
        </div>
      </div>
    </footer>
  );
}
