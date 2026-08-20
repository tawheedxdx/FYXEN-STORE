import Link from 'next/link';
import { ShieldCheck, Scale, FileText, Mail, MapPin, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | FYXEN',
  description: 'Official Terms & Conditions governing your use of FYXEN and product purchases.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-[#fcfbf9] dark:bg-[#070708] min-h-screen py-12 md:py-20">
      <div className="container-custom max-w-4xl">
        {/* Header Breadcrumb & Badge */}
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-6">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-900 dark:text-white">Terms &amp; Conditions</span>
        </div>

        {/* Hero Card */}
        <div className="bg-white dark:bg-[#0c0c0e] rounded-3xl p-8 md:p-12 border border-neutral-200/80 dark:border-neutral-800 shadow-xs mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c6a87c]/10 text-[#c6a87c] text-xs font-bold uppercase tracking-wider mb-4">
            <Scale className="w-4 h-4" /> Legal Agreement
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-neutral-950 dark:text-white tracking-tight mb-4">
            Terms &amp; Conditions
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500 font-medium">
            <span>Effective Date: <strong>27/06/2026</strong></span>
            <span>•</span>
            <span>Last Updated: <strong>01/07/2026</strong></span>
            <span>•</span>
            <span>Entity: <strong>FYXEN (Bytread International Pvt Ltd)</strong></span>
          </div>

          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
            Welcome to FYXEN (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). These Terms &amp; Conditions govern your access to and use of our website <a href="https://www.fyxen.in" className="text-[#c6a87c] font-bold hover:underline">www.fyxen.in</a> and the purchase of products through our platform. By accessing, browsing, or purchasing from FYXEN, you agree to be bound by these Terms &amp; Conditions.
          </p>
        </div>

        {/* Document Content */}
        <div className="bg-white dark:bg-[#0c0c0e] rounded-3xl p-8 md:p-12 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-12 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
          
          {/* 1. Acceptance */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">01</span>
              Acceptance of Terms
            </h2>
            <p>
              By using our website, creating an account, or placing an order, you confirm that you have read, understood, and agree to these Terms &amp; Conditions, along with our{' '}
              <Link href="/privacy-policy" className="text-[#c6a87c] font-semibold hover:underline">Privacy Policy</Link>,{' '}
              <Link href="/shipping-policy" className="text-[#c6a87c] font-semibold hover:underline">Shipping Policy</Link>, and{' '}
              <Link href="/cancellation-refunds" className="text-[#c6a87c] font-semibold hover:underline">Cancellation &amp; Refund Policy</Link>.
            </p>
          </section>

          {/* 2. Eligibility */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">02</span>
              Eligibility
            </h2>
            <p>
              You must be legally capable of entering into a binding contract under applicable laws to use our website and purchase products. If you are under 18 years of age, you may use the website only under the supervision and consent of a parent or legal guardian.
            </p>
          </section>

          {/* 3. Products & Pricing */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">03</span>
              Products &amp; Pricing
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>We strive to ensure that all product descriptions, specifications, imagery, and pricing are accurate at all times.</li>
              <li>Product images are for illustrative purposes only. Actual products may vary slightly due to continuous manufacturing refinements or display screen variations.</li>
              <li>All prices are listed in Indian Rupees (INR) and are subject to change without prior notice.</li>
              <li>We reserve the right to discontinue, update, or modify any product or collection at any time.</li>
            </ul>
          </section>

          {/* 4. Orders */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">04</span>
              Orders &amp; Acceptance
            </h2>
            <p>
              All orders placed on FYXEN are subject to our acceptance and product stock availability. We reserve the right to refuse, restrict, or cancel any order for reasons including but not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 dark:text-neutral-400">
              <li>Product unavailability or inventory exhaustion.</li>
              <li>Pricing, specification, or listing errors.</li>
              <li>Suspected fraudulent activity or unauthorized payment.</li>
              <li>Payment verification failure.</li>
              <li>Violation of these Terms &amp; Conditions.</li>
            </ul>
            <p className="text-xs text-neutral-500 pt-1">
              If your order is cancelled after payment has been received, the applicable refund will be processed promptly according to our Cancellation &amp; Refund Policy.
            </p>
          </section>

          {/* 5. Payments */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">05</span>
              Payments &amp; Security
            </h2>
            <p>
              We process online payments through secure, 256-bit SSL encrypted payment gateways (supporting UPI, Credit/Debit Cards, Net Banking, and Wallets). By placing an order, you confirm that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The payment information and account details provided are accurate, lawful, and authorized.</li>
              <li>You possess sufficient funds or credit authorization to complete the transaction.</li>
              <li>You will not engage in fraudulent, unauthorized, or chargeback-abusive payment methods.</li>
            </ul>
          </section>

          {/* 6. Shipping & Delivery */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">06</span>
              Shipping &amp; Delivery
            </h2>
            <p>
              Orders are dispatched and delivered in accordance with our <Link href="/shipping-policy" className="text-[#c6a87c] font-semibold hover:underline">Shipping Policy</Link>. Estimated delivery windows are provided as guidelines only and may vary due to courier transit schedules, weather conditions, or force majeure events.
            </p>
          </section>

          {/* 7. Cancellations & Refunds */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">07</span>
              Cancellations &amp; Refunds
            </h2>
            <p>
              Order cancellations, returns, replacements, and refunds are governed by our <Link href="/cancellation-refunds" className="text-[#c6a87c] font-semibold hover:underline">Cancellation &amp; Refund Policy</Link>. Orders may only be cancelled prior to dispatch.
            </p>
          </section>

          {/* 8. User Accounts */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">08</span>
              User Accounts
            </h2>
            <p>
              When creating an account on FYXEN, you are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. You agree to provide true, accurate, and current information. Notify us immediately of any unauthorized access.
            </p>
          </section>

          {/* 9. Prohibited Activities */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">09</span>
              Prohibited Activities
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Using the platform for any unlawful, infringing, or unauthorized purposes.</li>
              <li>Attempting to hack, exploit, decompile, disrupt, or overload website infrastructure.</li>
              <li>Injecting malicious software, viruses, or automated scraping scripts.</li>
              <li>Submitting fake, defamatory, or manipulated reviews and ratings.</li>
              <li>Copying or distributing website media and proprietary content without written consent.</li>
            </ul>
          </section>

          {/* 10. Intellectual Property */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">10</span>
              Intellectual Property Rights
            </h2>
            <p>
              All trademarks, logos, brand names, product photography, graphic designs, texts, interface layouts, icons, and underlying source code on FYXEN are the exclusive property of FYXEN and its parent entity, Bytread International Private Limited. No material may be reproduced, modified, or distributed without prior written consent.
            </p>
          </section>

          {/* 11. Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">11</span>
              Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable Indian law, FYXEN and its directors, employees, or partners shall not be liable for indirect, incidental, or consequential damages, loss of business profits, courier delays, or temporary system downtime. Our total cumulative liability for any claim shall not exceed the actual amount paid by you for the purchased product.
            </p>
          </section>

          {/* 12. Warranty Disclaimer */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">12</span>
              Warranty Disclaimer
            </h2>
            <p>
              Unless expressly stated in specific product warranties, all products and platform services are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied.
            </p>
          </section>

          {/* 13. Privacy */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">13</span>
              Privacy Policy
            </h2>
            <p>
              Your personal data and privacy are safeguarded under our <Link href="/privacy-policy" className="text-[#c6a87c] font-semibold hover:underline">Privacy Policy</Link>, which details our transparent data collection, cookie usage, and encryption practices.
            </p>
          </section>

          {/* 14. Changes to Terms */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">14</span>
              Modifications to Terms
            </h2>
            <p>
              We reserve the right to amend these Terms &amp; Conditions at any time. Changes take effect immediately upon publication on this page with the updated revision date. Continued usage of our services after updates signifies your agreement.
            </p>
          </section>

          {/* 15. Governing Law & Jurisdiction + Return Processing Fee */}
          <section className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">15</span>
              Governing Law &amp; Exclusive Jurisdiction
            </h2>
            <p>
              These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of India.
            </p>
            <div className="p-5 bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 space-y-2">
              <p className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c6a87c]" /> Exclusive Court Jurisdiction at Jangipur, West Bengal
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Any dispute, claim, controversy, or legal proceeding arising out of or relating to the use of this website, product purchases, these Terms &amp; Conditions, or any transaction with FYXEN shall be subject to the <strong>exclusive jurisdiction of the competent courts at Jangipur, West Bengal, India</strong>. By using this website, you expressly agree that only the courts located in Jangipur shall have jurisdiction.
              </p>
            </div>

            {/* Return Processing Fee Callout */}
            <div className="p-5 bg-amber-500/5 dark:bg-amber-500/10 rounded-2xl border border-amber-500/20 space-y-2">
              <p className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#c6a87c]" /> Return Processing Fee (Orders Below ₹1,000)
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                For eligible returns of products with a purchase value below ₹1,000, the customer agrees to pay a <strong>₹150 return processing fee</strong>. The fee is deducted from the refundable amount or collected separately to cover reverse logistics, handling, and inspection.
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                ✓ The ₹150 fee is completely waived if the return is due to an incorrect product delivered by FYXEN, receipt of a damaged/defective item, or any error attributable to FYXEN.
              </p>
            </div>
          </section>

          {/* 16. Contact Information */}
          <section className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">16</span>
              Contact Us
            </h2>
            <p>
              If you have any questions, clarifications, or feedback regarding these Terms &amp; Conditions, please contact our support team:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c6a87c]/15 flex items-center justify-center text-[#c6a87c]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email Support</p>
                  <a href="mailto:support@fyxen.in" className="font-bold text-neutral-900 dark:text-white hover:text-[#c6a87c] transition-colors">
                    support@fyxen.in
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c6a87c]/15 flex items-center justify-center text-[#c6a87c]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Official Portal</p>
                  <a href="https://www.fyxen.in" className="font-bold text-neutral-900 dark:text-white hover:text-[#c6a87c] transition-colors">
                    www.fyxen.in
                  </a>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
