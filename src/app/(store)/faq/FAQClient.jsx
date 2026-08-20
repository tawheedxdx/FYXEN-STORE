'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  HelpCircle, 
  Package, 
  CreditCard, 
  Truck, 
  RotateCcw, 
  User, 
  Building2, 
  ChevronDown, 
  Mail, 
  Phone,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

const FAQ_DATA = [
  {
    category: 'Orders & Products',
    icon: Package,
    items: [
      {
        q: 'What products does FYXEN offer?',
        a: 'FYXEN offers high-quality lifestyle, tech, and daily essentials designed for exceptional reliability, durability, and modern usage needs. We focus on delivering curated products that meet both individual and business requirements with rigorous quality standards.'
      },
      {
        q: 'How can I place an order?',
        a: 'Placing an order is quick and seamless:\n1. Browse our catalog and select your desired products.\n2. Add items to your Cart and proceed to Checkout.\n3. Enter your accurate delivery address and choose your delivery speed (Standard, Express, or Founder In-Hand Delivery for West Bengal).\n4. Complete payment securely via Prepaid (Razorpay) or choose Cash on Delivery (COD).\nOnce confirmed, you will instantly receive an order confirmation via email and SMS.'
      },
      {
        q: 'Can I modify or cancel my order after placing it?',
        a: 'Orders can only be modified or canceled before they are processed or handed over to our courier partners. To request a change or cancellation, please contact our support team immediately or manage your order from your Account Orders tab.'
      },
      {
        q: 'Will I receive an order confirmation?',
        a: 'Yes, absolutely! As soon as your order is successfully placed, a confirmation message containing your Order ID and itemized breakdown will be sent to your registered email and phone number.'
      }
    ]
  },
  {
    category: 'Payments',
    icon: CreditCard,
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We support all major payment options via 256-bit encrypted Razorpay gateway:\n• UPI (Google Pay, PhonePe, Paytm, BHIM, Cred)\n• Credit & Debit Cards (Visa, MasterCard, RuPay, Amex)\n• Net Banking across 50+ Indian banks\n• Wallets (Paytm, Mobikwik, etc.)\n• Cash on Delivery (COD) with a nominal ₹15 compliance fee\n(Note: Founder In-Hand Delivery requires online prepaid payment).'
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes. All transactions are processed through RBI-compliant, PCI-DSS Level 1 certified payment gateways with end-to-end SSL encryption. FYXEN never stores your sensitive credit card numbers or UPI PINs.'
      }
    ]
  },
  {
    category: 'Shipping & Delivery',
    icon: Truck,
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Delivery timelines vary by selected shipping speed:\n• Standard Delivery: 3–7 business days (FREE for orders above ₹499, otherwise ₹30).\n• Express Delivery: 2–5 business days (Flat ₹50 priority dispatch).\n• Hand Delivered By Founder: Direct personal handover coordinated across all West Bengal districts and cities.'
      },
      {
        q: 'How can I track my order?',
        a: 'Once your package is dispatched, we send an AWB tracking number and live link via email/SMS. You can also view live tracking milestones anytime on our Track Order page or within your Account dashboard.'
      },
      {
        q: 'Do you deliver across India?',
        a: 'Yes, we deliver across all serviceable PIN codes throughout India in partnership with top-tier courier networks including BlueDart, Delhivery, DTDC, and Xpressbees.'
      }
    ]
  },
  {
    category: 'Returns & Cancellations',
    icon: RotateCcw,
    items: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within the specified return window if the product is received in a damaged/defective condition, if an incorrect item was delivered, or if it is unused in original packaging with all tags and invoice intact.'
      },
      {
        q: 'How long does it take to receive a refund?',
        a: 'Once your returned product is inspected and verified at our fulfillment hub, refunds are approved and processed within 2 working days directly to your original payment method or store wallet.'
      },
      {
        q: 'Can I cancel my order after it has shipped?',
        a: 'Orders that have already been dispatched cannot be cancelled in transit. However, you may initiate an eligible return request after delivery in accordance with our Cancellation & Refund Policy.'
      },
      {
        q: 'Is there any return processing fee?',
        a: 'For voluntary returns of products with an order value below ₹1,000, a ₹150 return processing fee is deducted to cover reverse logistics and handling. This fee is 100% waived if the return is due to a defect, damage, or error on our part.'
      }
    ]
  },
  {
    category: 'Account & Support',
    icon: User,
    items: [
      {
        q: 'Do I need an account to place an order?',
        a: 'While guest browsing is available, creating an account enables you to track live orders, earn wallet reward points, manage saved shipping addresses, and enjoy faster 1-click checkouts.'
      },
      {
        q: 'How can I contact FYXEN customer support?',
        a: 'You can reach us through:\n• Email: support@fyxen.in\n• Phone / WhatsApp: +91 9332939274 (Mon–Sat, 10 AM – 7 PM)\n• Online Contact Form on our website.'
      },
      {
        q: 'What should I do if I receive a damaged product?',
        a: 'Please take clear photos or a short video of the package/product and reach out to us at support@fyxen.in with your Order ID. We will promptly issue an expedited replacement or refund.'
      }
    ]
  },
  {
    category: 'Company & Trust',
    icon: Building2,
    items: [
      {
        q: 'Who operates FYXEN?',
        a: 'FYXEN is a premium brand owned and operated under Bytread International Private Limited, committed to top-tier craftsmanship, customer delight, and quality assurance.'
      },
      {
        q: 'Why should I choose FYXEN?',
        a: 'We stand apart through our obsession with product quality, transparent policies, fast 2-day refund processing, statewide founder in-hand delivery in West Bengal, and responsive customer care.'
      }
    ]
  }
];

export default function FAQClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (key) => {
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredCategories = useMemo(() => {
    return FAQ_DATA.map(group => {
      if (selectedCategory !== 'All' && group.category !== selectedCategory) {
        return null;
      }

      const matchingItems = group.items.filter(item => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
      });

      if (matchingItems.length === 0) return null;

      return {
        ...group,
        items: matchingItems
      };
    }).filter(Boolean);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Controls */}
      <div className="bg-white dark:bg-[#0c0c0e] p-6 md:p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., shipping, returns, payment, founder delivery)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#c6a87c] text-sm text-neutral-900 dark:text-white placeholder-neutral-400 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
          >
            All Questions
          </button>
          {FAQ_DATA.map((group) => {
            const Icon = group.icon;
            const isSelected = selectedCategory === group.category;
            return (
              <button
                key={group.category}
                onClick={() => setSelectedCategory(group.category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#c6a87c] text-white shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{group.category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion FAQ Groups */}
      {filteredCategories.length > 0 ? (
        <div className="space-y-8">
          {filteredCategories.map((group) => {
            const Icon = group.icon;
            return (
              <div 
                key={group.category}
                className="bg-white dark:bg-[#0c0c0e] rounded-3xl p-6 md:p-8 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4"
              >
                <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="w-8 h-8 rounded-xl bg-[#c6a87c]/15 text-[#c6a87c] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-black text-neutral-950 dark:text-white tracking-tight">
                    {group.category}
                  </h2>
                </div>

                <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {group.items.map((item, idx) => {
                    const itemKey = `${group.category}-${idx}`;
                    const isOpen = openItems[itemKey] ?? (idx === 0 && !searchQuery);

                    return (
                      <div key={item.q} className="py-4 first:pt-2 last:pb-0">
                        <button
                          onClick={() => toggleItem(itemKey)}
                          className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer"
                        >
                          <span className="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-[#c6a87c] transition-colors">
                            {item.q}
                          </span>
                          <span className={`w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#c6a87c]/15 text-[#c6a87c]' : ''}`}>
                            <ChevronDown className="w-4 h-4" />
                          </span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed whitespace-pre-line pl-1 border-l-2 border-[#c6a87c]/30">
                                {item.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0c0c0e] rounded-3xl p-12 text-center border border-neutral-200/80 dark:border-neutral-800">
          <HelpCircle className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-neutral-950 dark:text-white">No matching answers found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            We couldn&apos;t find any FAQs matching &ldquo;{searchQuery}&rdquo;. Try another search keyword or reach out directly to our team!
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Still Have Questions CTA */}
      <div className="bg-[#c6a87c]/10 dark:bg-[#c6a87c]/15 border border-[#c6a87c]/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-lg font-black text-neutral-950 dark:text-white">Still have questions?</h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            Our concierge support team is here to assist you Monday to Saturday from 10 AM to 7 PM IST.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <a
            href="mailto:support@fyxen.in"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold hover:opacity-90 transition-opacity shadow-xs"
          >
            <Mail className="w-4 h-4" /> Email Us
          </a>
          <a
            href="tel:+919332939274"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-white text-xs font-bold hover:border-[#c6a87c] transition-colors"
          >
            <Phone className="w-4 h-4 text-[#c6a87c]" /> +91 9332939274
          </a>
        </div>
      </div>
    </div>
  );
}
