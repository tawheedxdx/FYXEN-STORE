import Link from 'next/link';
import { RotateCcw, ShieldCheck, Clock, AlertTriangle, CheckCircle2, Phone, Mail, ChevronRight, HelpCircle, Receipt } from 'lucide-react';

export const metadata = {
  title: 'Cancellation & Refund Policy | FYXEN',
  description: 'Understand FYXEN cancellation rules, return eligibility, 2-day refund timelines, and return processing fees.',
};

export default function CancellationRefundsPage() {
  return (
    <div className="bg-[#fcfbf9] dark:bg-[#070708] min-h-screen py-12 md:py-20">
      <div className="container-custom max-w-4xl">
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-6">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-900 dark:text-white">Cancellation &amp; Refunds</span>
        </div>

        {/* Hero Card */}
        <div className="bg-white dark:bg-[#0c0c0e] rounded-3xl p-8 md:p-12 border border-neutral-200/80 dark:border-neutral-800 shadow-xs mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c6a87c]/10 text-[#c6a87c] text-xs font-bold uppercase tracking-wider mb-4">
            <RotateCcw className="w-4 h-4" /> Customer Satisfaction
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-neutral-950 dark:text-white tracking-tight mb-4">
            Cancellation &amp; Refund Policy
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500 font-medium">
            <span>Effective Date: <strong>27/06/2026</strong></span>
            <span>•</span>
            <span>Refund Processing Time: <strong>2 Working Days</strong></span>
            <span>•</span>
            <span>Direct Support: <strong>+91 9332939274</strong></span>
          </div>

          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
            At FYXEN, we are committed to providing a seamless, transparent shopping journey. Please read our Cancellation &amp; Refund Policy carefully before placing an order to ensure full clarity on your rights and procedures.
          </p>
        </div>

        {/* 3 Key Highlights Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0c0e] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-1">
              <Clock className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-neutral-950 dark:text-white">Pre-Dispatch Cancellation</p>
            <p className="text-xs text-neutral-500">Cancel instantly with 100% full refund before courier dispatch.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0c0e] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-neutral-950 dark:text-white">2-Day Fast Refunds</p>
            <p className="text-xs text-neutral-500">Refunds are processed within 2 working days of inspection verification.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0c0e] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-[#c6a87c]/15 text-[#c6a87c] flex items-center justify-center mb-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-neutral-950 dark:text-white">Hassle-Free Replacement</p>
            <p className="text-xs text-neutral-500">Defective or incorrect items replaced with zero additional charges.</p>
          </div>
        </div>

        {/* Policy Details */}
        <div className="bg-white dark:bg-[#0c0c0e] rounded-3xl p-8 md:p-12 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-10 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
          
          {/* 1. Order Cancellation */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">01</span>
              Order Cancellation
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You may cancel your order at any time <strong>before it has been packed and handed over to the courier partner</strong>.</li>
              <li>Cancellations can be initiated directly through your <Link href="/account/orders" className="text-[#c6a87c] font-semibold hover:underline">Account Orders</Link> dashboard or by contacting support immediately.</li>
              <li>Once an order has been dispatched and an AWB tracking number is generated, it cannot be cancelled mid-transit and must be treated as an eligible return after delivery.</li>
            </ul>
          </section>

          {/* 2. Returns Eligibility */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">02</span>
              Returns &amp; Replacement Eligibility
            </h2>
            <p>We gladly accept return and replacement requests for eligible products under the following conditions:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The item was received in a damaged, physically impaired, or defective state.</li>
              <li>An incorrect item, size, or variant was dispatched by FYXEN.</li>
              <li>The item is completely unused, unaltered, in original condition with all tags, packaging, user manuals, and invoices intact.</li>
              <li>The return request is raised within the official return window specified on the product page from the date of delivery.</li>
            </ul>
            <p className="text-xs text-neutral-500">
              * Note: Select personal care, intimate, or customized products may be marked as non-returnable on their respective product pages due to hygiene regulations.
            </p>
          </section>

          {/* 3. Refund Process & Timelines */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">03</span>
              Refund Processing &amp; Timelines
            </h2>
            <p>
              Once your returned item reaches our fulfillment center, it undergoes quality inspection within 24 hours. Upon successful verification:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Processing Window:</strong> The refund will be initiated within <strong>2 working days</strong>.</li>
              <li><strong>Refund Method:</strong> The amount will be credited back to the original payment source (UPI account, Credit/Debit card, Net Banking, or FYXEN Store Wallet).</li>
              <li><strong>Bank Settlement:</strong> Depending on your card issuer or banking institution, the refunded amount typically reflects in your statement within 3–5 business days.</li>
            </ul>
          </section>

          {/* 4. Non-Refundable Items */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">04</span>
              Non-Refundable Circumstances
            </h2>
            <p>Refunds cannot be authorized under the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The product has suffered damage due to customer misuse, improper handling, or electrical surge.</li>
              <li>The product is returned without its original packaging box, accessories, tags, or invoice.</li>
              <li>The return request is raised after the expiry of the stipulated return window.</li>
            </ul>
          </section>

          {/* 5. Damaged or Incorrect Products */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">05</span>
              Damaged, Defective, or Incorrect Deliveries
            </h2>
            <p>
              If you receive an item that is defective or not what you ordered, please contact us immediately with:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400">
              <li>Your Order ID (e.g. FYX-XXXXXX).</li>
              <li>Clear photos or a brief unboxing video highlighting the issue.</li>
              <li>A short summary of the defect.</li>
            </ul>
            <p className="text-xs text-neutral-500">
              Our priority support team will instantly validate your request and organize a complimentary replacement dispatch or full refund.
            </p>
          </section>

          {/* Return Shipping & Restocking Fee Callout with Detailed Calculation */}
          <section className="p-6 rounded-3xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#c6a87c]" />
              <h3 className="font-bold text-base text-neutral-950 dark:text-white">
                Return Processing Fee (Orders Below ₹1,000)
              </h3>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              For voluntary returns of products with an order value below <strong>₹1,000</strong>, a standard return processing fee of <strong>₹150</strong> is deducted from the refundable total (or collected before return processing). This fee offsets reverse courier transit, handling, and sanitization inspections.
            </p>
            
            {/* Calculation Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-black/50 border border-neutral-200/80 dark:border-neutral-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Original Order Value:</span>
                <span className="font-bold text-neutral-950 dark:text-white">₹850.00</span>
              </div>
              <div className="flex justify-between text-rose-500 font-semibold">
                <span>Less: Return Processing Fee:</span>
                <span>- ₹150.00</span>
              </div>
              <div className="flex justify-between text-[#c6a87c] font-bold pt-1.5 border-t border-neutral-100 dark:border-neutral-800 text-sm">
                <span>Net Refund Credited:</span>
                <span>₹700.00</span>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Fee Exemption Guarantee:
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                This ₹150 processing fee is <strong>100% waived</strong> if the return is due to a wrong product delivered, transit damage, manufacturer defect, or any mistake caused by FYXEN.
              </p>
            </div>
          </section>

          {/* 6. Contact Support */}
          <section className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white flex items-center justify-center text-xs font-mono">06</span>
              Returns &amp; Refund Assistance
            </h2>
            <p>
              Our dedicated customer resolution team is available to assist you with any return or refund requests:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c6a87c]/15 flex items-center justify-center text-[#c6a87c]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email Resolutions</p>
                  <a href="mailto:support@fyxen.in" className="font-bold text-neutral-900 dark:text-white hover:text-[#c6a87c] transition-colors">
                    support@fyxen.in
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c6a87c]/15 flex items-center justify-center text-[#c6a87c]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Direct Phone Support</p>
                  <a href="tel:+919332939274" className="font-bold text-neutral-900 dark:text-white hover:text-[#c6a87c] transition-colors">
                    +91 9332939274
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
