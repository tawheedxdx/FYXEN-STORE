import Link from 'next/link';
import { ShieldCheck, Lock, Eye, Cookie, UserCheck, Mail, ChevronRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | FYXEN',
  description: 'Learn how FYXEN collects, protects, and handles your personal data, transaction security, and cookie preferences.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#fcfbf9] dark:bg-[#070708] min-h-screen py-12 md:py-20">
      <div className="container-custom max-w-4xl">
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-6">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-900 dark:text-white">Privacy Policy</span>
        </div>

        {/* Hero Card */}
        <div className="bg-white dark:bg-[#0c0c0e] rounded-3xl p-8 md:p-12 border border-neutral-200/80 dark:border-neutral-800 shadow-xs mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c6a87c]/10 text-[#c6a87c] text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" /> Data Security &amp; Trust
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-neutral-950 dark:text-white tracking-tight mb-4">
            Privacy Policy
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500 font-medium">
            <span>Effective Date: <strong>27/06/2026</strong></span>
            <span>•</span>
            <span>Last Updated: <strong>01/07/2026</strong></span>
            <span>•</span>
            <span>Operated by: <strong>Bytread International Private Limited</strong></span>
          </div>

          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
            At FYXEN, protecting your personal privacy and safeguarding your confidential information is foundational to our relationship with you. This Privacy Policy details how we collect, process, store, and protect your information when visiting <a href="https://www.fyxen.in" className="text-[#c6a87c] font-bold hover:underline">www.fyxen.in</a> or purchasing from our platform.
          </p>
        </div>

        {/* 3 Privacy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0c0e] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-1">
              <Lock className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-neutral-950 dark:text-white">256-Bit SSL Encryption</p>
            <p className="text-xs text-neutral-500">All data transfers and payments are protected by banking-grade encryption.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0c0e] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-1">
              <Eye className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-neutral-950 dark:text-white">Zero Data Selling</p>
            <p className="text-xs text-neutral-500">We never rent, trade, or monetize your personal contact information to 3rd parties.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0c0e] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-[#c6a87c]/15 text-[#c6a87c] flex items-center justify-center mb-1">
              <Cookie className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-neutral-950 dark:text-white">Full Cookie Control</p>
            <p className="text-xs text-neutral-500">Easily customize your analytics and marketing cookie preferences anytime.</p>
          </div>
        </div>

        {/* Document Content */}
        <div className="bg-white dark:bg-[#0c0c0e] rounded-3xl p-8 md:p-12 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-10 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
          
          {/* 1. Information We Collect */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">01</span>
              Information We Collect
            </h2>
            <p>We collect information to fulfill your orders and enhance your browsing experience:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Contact &amp; Identity Data:</strong> Name, email address, mobile number, delivery address, state, and postal PIN code.</li>
              <li><strong>Order &amp; Transaction History:</strong> Purchased items, delivery preferences, invoice details, and refund records.</li>
              <li><strong>Device &amp; Usage Information:</strong> IP address, browser type, operating system, and on-site interaction analytics collected via secure cookies.</li>
            </ul>
          </section>

          {/* 2. Payment Security */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">02</span>
              Payment Security
            </h2>
            <p>
              Your payment credentials (Credit/Debit Card numbers, CVVs, Net Banking passwords, and UPI PINs) are processed directly by RBI-licensed payment gateways (Razorpay) adhering to PCI-DSS Level 1 specifications. <strong>FYXEN does not capture or store your payment card numbers on our servers.</strong>
            </p>
          </section>

          {/* 3. How We Use Your Information */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">03</span>
              How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To fulfill, pack, dispatch, and track your purchased products.</li>
              <li>To communicate real-time order milestones, invoices, and shipment tracking via SMS/Email.</li>
              <li>To process returns, replacements, and 2-day refunds.</li>
              <li>To offer curated VIP Club discounts and promotional updates (which you can opt out of anytime).</li>
              <li>To detect and prevent fraudulent transactions or security violations.</li>
            </ul>
          </section>

          {/* 4. Data Sharing & Third Parties */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">04</span>
              Sharing With Trusted Service Providers
            </h2>
            <p>
              We only share necessary information with verified operational partners solely to fulfill our services:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400">
              <li><strong>Logistics Partners:</strong> (e.g. BlueDart, Delhivery, DTDC) for shipping address delivery.</li>
              <li><strong>Payment Processors:</strong> (e.g. Razorpay) for transaction settlement.</li>
              <li><strong>Cloud &amp; Communication Providers:</strong> for sending transactional order confirmations.</li>
            </ul>
            <p className="text-xs text-neutral-500 pt-1">
              All partner providers are contractually obligated to maintain data confidentiality and comply with applicable Indian IT security standards.
            </p>
          </section>

          {/* 5. User Rights & Data Deletion */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">05</span>
              Your Privacy Rights &amp; Preferences
            </h2>
            <p>
              You maintain full control over your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You may request a copy or correction of your registered account details at any time.</li>
              <li>You may unsubscribe from VIP club marketing emails using the 1-click &ldquo;Unsubscribe&rdquo; link in emails.</li>
              <li>You may request complete deletion of your account and personal records by contacting support.</li>
            </ul>
          </section>

          {/* 6. Contact Information */}
          <section className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">06</span>
              Grievance &amp; Privacy Officer
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your data protection rights, please contact our Privacy Team:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c6a87c]/15 flex items-center justify-center text-[#c6a87c]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Privacy Support</p>
                  <a href="mailto:support@fyxen.in" className="font-bold text-neutral-900 dark:text-white hover:text-[#c6a87c] transition-colors">
                    support@fyxen.in
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c6a87c]/15 flex items-center justify-center text-[#c6a87c]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Company</p>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    Bytread International Pvt Ltd
                  </span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
