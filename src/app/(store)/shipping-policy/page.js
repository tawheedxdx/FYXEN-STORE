import Link from 'next/link';
import { Truck, Clock, PackageCheck, Zap, UserCheck, AlertTriangle, ShieldCheck, Mail, ChevronRight, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery Policy | FYXEN',
  description: 'Learn about FYXEN shipping timelines, standard/express delivery, founder in-hand delivery, and tracking.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#fcfbf9] dark:bg-[#070708] min-h-screen py-12 md:py-20">
      <div className="container-custom max-w-4xl">
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-6">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-900 dark:text-white">Shipping Policy</span>
        </div>

        {/* Hero Card */}
        <div className="bg-white dark:bg-[#0c0c0e] rounded-3xl p-8 md:p-12 border border-neutral-200/80 dark:border-neutral-800 shadow-xs mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c6a87c]/10 text-[#c6a87c] text-xs font-bold uppercase tracking-wider mb-4">
            <Truck className="w-4 h-4" /> Fast &amp; Reliable Transit
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-neutral-950 dark:text-white tracking-tight mb-4">
            Shipping &amp; Delivery Policy
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500 font-medium">
            <span>Effective Date: <strong>27/06/2026</strong></span>
            <span>•</span>
            <span>Coverage: <strong>Pan-India + Statewide West Bengal VIP Delivery</strong></span>
          </div>

          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
            At FYXEN, we are dedicated to delivering your premium lifestyle purchases safely, securely, and swiftly to your doorstep. Please review our complete Shipping Policy below to understand how orders are fulfilled, packed, dispatched, and delivered.
          </p>
        </div>

        {/* Delivery Options Comparison Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0c0e] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-neutral-950 dark:text-white">Standard Delivery</span>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded-md">FREE &ge; ₹499</span>
            </div>
            <p className="text-2xl font-black text-neutral-950 dark:text-white">3–7 Days</p>
            <p className="text-xs text-neutral-500">Free for orders &ge; ₹499. Flat ₹30 for orders under ₹499.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0c0e] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-neutral-950 dark:text-white flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Express Delivery
              </span>
              <span className="text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md">₹50 Flat</span>
            </div>
            <p className="text-2xl font-black text-neutral-950 dark:text-white">2–5 Days</p>
            <p className="text-xs text-neutral-500">Priority packing &amp; expedited air courier dispatch nationwide.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0c0e] border border-[#c6a87c]/40 shadow-xs space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-neutral-950 dark:text-white flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-[#c6a87c]" /> Founder In-Hand
              </span>
              <span className="text-[10px] font-bold bg-[#c6a87c]/15 text-[#c6a87c] px-2 py-0.5 rounded-md uppercase">WB Only</span>
            </div>
            <p className="text-2xl font-black text-[#c6a87c]">Direct Handover</p>
            <p className="text-xs text-neutral-500">Personal in-hand delivery by FYXEN Founder across all West Bengal districts.</p>
          </div>
        </div>

        {/* Policy Details */}
        <div className="bg-white dark:bg-[#0c0c0e] rounded-3xl p-8 md:p-12 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-10 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
          
          {/* Order Processing */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#c6a87c]" /> Order Processing
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>All standard and express orders are processed and packed within <strong>2–3 working days</strong> following successful payment or order confirmation.</li>
              <li>Order processing operates exclusively on working days (<strong>Monday to Saturday</strong>), excluding national and regional public holidays.</li>
              <li>Once your package is inspected and dispatched, you will receive real-time notification with live tracking credentials.</li>
            </ul>
          </section>

          {/* Delivery Timeline */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#c6a87c]" /> Delivery Timelines
            </h2>
            <p>
              Estimated transit timelines from the date of courier handover:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Standard Shipping:</strong> 3–7 working days across major tier-1, tier-2, and tier-3 Indian cities.</li>
              <li><strong>Express Delivery:</strong> 2–5 working days for expedited air corridors.</li>
              <li><strong>Hand Delivered By Founder:</strong> Coordinated directly via WhatsApp/call for personal handover anywhere in West Bengal.</li>
              <li>Remote, hilly, or rural destinations may require an additional 1–2 days of logistics transit.</li>
            </ul>
          </section>

          {/* Shipping Charges */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-[#c6a87c]" /> Shipping Charges &amp; Rates
            </h2>
            <p>
              Transparent shipping charges are calculated upfront at checkout before payment:
            </p>
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span>Orders &ge; ₹499 (Standard Delivery)</span>
                <span className="text-emerald-600 font-bold uppercase">FREE</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Orders &lt; ₹499 (Standard Delivery)</span>
                <span>₹30.00</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Express Priority Delivery</span>
                <span>₹50.00</span>
              </div>
              <div className="flex justify-between font-semibold text-[#c6a87c]">
                <span>Hand Delivered By Founder (West Bengal Statewide)</span>
                <span>₹10,000.00</span>
              </div>
            </div>
          </section>

          {/* Order Tracking */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#c6a87c]" /> Real-Time Order Tracking
            </h2>
            <p>
              Upon dispatch, a unique airway bill (AWB) and direct tracking link are sent to your registered email or SMS. You can also view live order milestones anytime by visiting your <Link href="/account/orders" className="text-[#c6a87c] font-semibold hover:underline">Order History</Link> or our <Link href="/track-order" className="text-[#c6a87c] font-semibold hover:underline">Track Order</Link> page.
            </p>
          </section>

          {/* Delivery Attempts & Undelivered Parcels */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#c6a87c]" /> Delivery Attempts &amp; Address Accuracy
            </h2>
            <p>
              Our national courier partners will make multiple delivery attempts to the specified address. If delivery fails due to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Incomplete or incorrect house/street address or PIN code provided by the customer.</li>
              <li>Recipient being unavailable or unreachable on the registered phone number.</li>
              <li>Refusal to accept the delivery without valid cause.</li>
            </ul>
            <p className="text-xs text-neutral-500">
              The package will be returned to our fulfillment hub (RTO). Additional re-dispatch shipping charges may apply for re-attempted deliveries.
            </p>
          </section>

          {/* Damaged or Tampered Packages */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> Damaged or Tampered Packages
            </h2>
            <p>
              If your outer parcel arrives visibly damaged, torn, or tampered with:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>Do not accept the delivery from the courier agent if the damage is severe.</li>
              <li>Take clear photos or videos of the parcel before opening.</li>
              <li>Contact our customer support team immediately at <a href="mailto:support@fyxen.in" className="text-[#c6a87c] font-bold hover:underline">support@fyxen.in</a> with your Order ID and supporting media.</li>
            </ol>
            <p className="text-xs text-neutral-500">
              We will conduct an immediate investigation with the logistics carrier and arrange an expedited replacement or full refund.
            </p>
          </section>

          {/* Contact Us */}
          <section className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#c6a87c]" /> Shipping Support &amp; Enquiries
            </h2>
            <p>
              For any questions regarding your package dispatch, tracking, or delivery schedule, please reach out to our logistics team:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c6a87c]/15 flex items-center justify-center text-[#c6a87c]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Support Email</p>
                  <a href="mailto:support@fyxen.in" className="font-bold text-neutral-900 dark:text-white hover:text-[#c6a87c] transition-colors">
                    support@fyxen.in
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c6a87c]/15 flex items-center justify-center text-[#c6a87c]">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Live Tracking</p>
                  <Link href="/track-order" className="font-bold text-neutral-900 dark:text-white hover:text-[#c6a87c] transition-colors">
                    Track Your Package
                  </Link>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
