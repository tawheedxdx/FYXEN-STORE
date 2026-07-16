'use client';

import { Gift, PartyPopper } from 'lucide-react';

export default function CheckoutOffersBadge({ items = [], offers = [] }) {
  if (!offers || offers.length === 0 || !items || items.length === 0) return null;

  // Find all offers the cart items qualify for
  const qualifiedOffers = offers.filter(offer => {
    const isSiteWide = !offer.eligible_product_ids || offer.eligible_product_ids.length === 0;
    if (isSiteWide) return true;

    // Check if any cart item matches an eligible product ID
    return items.some(item => offer.eligible_product_ids.includes(item.product_id));
  });

  if (qualifiedOffers.length === 0) return null;

  return (
    <div className="bg-green-500/10 dark:bg-green-500/5 border border-green-500/25 dark:border-green-500/10 rounded-2xl p-5 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
          <PartyPopper className="w-5.5 h-5.5" />
        </div>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-bold text-green-800 dark:text-green-400">
              Eligible Promotion Active!
            </h4>
            <p className="text-xs text-green-700/80 dark:text-green-500/75 mt-0.5 font-medium leading-relaxed">
              Your order qualifies for the following campaign promotions. Complete your purchase to participate!
            </p>
          </div>
          <div className="space-y-2">
            {qualifiedOffers.map(offer => (
              <div 
                key={offer.id} 
                className="flex items-center gap-2 text-xs bg-white/60 dark:bg-white/2 border border-green-500/10 dark:border-white/5 py-2 px-3 rounded-lg text-primary-800 dark:text-primary-200"
              >
                <Gift className="w-4 h-4 text-accent shrink-0" />
                <span className="font-semibold">{offer.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
