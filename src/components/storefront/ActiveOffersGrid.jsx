'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Gift, Calendar, ArrowRight, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export default function ActiveOffersGrid({ offers = [] }) {
  const [expandedTermsId, setExpandedTermsId] = useState(null);

  if (!offers || offers.length === 0) return null;

  const toggleTerms = (id) => {
    setExpandedTermsId(prev => prev === id ? null : id);
  };

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-primary-950 border-t border-primary-100/60 dark:border-white/5">
      <div className="container-custom">
        <div className="mb-10 md:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-2">Ongoing Promotions</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-primary-900 dark:text-white">
            Giveaways <span className="italic font-light">& Offers</span>
          </h2>
          <p className="text-primary-500 text-sm md:text-base mt-2 max-w-xl">
            Participate in our current campaigns to win cash rewards, special gifts, or exclusive discounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offers.map((offer) => {
            const isSiteWide = !offer.eligible_product_ids || offer.eligible_product_ids.length === 0;
            const isExpanded = expandedTermsId === offer.id;

            return (
              <div 
                key={offer.id} 
                className="bg-primary-50/50 dark:bg-white/2 rounded-3xl border border-primary-150 dark:border-white/5 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  {/* Image */}
                  {offer.image_url ? (
                    <div className="h-56 md:h-64 w-full relative bg-primary-100 dark:bg-primary-900 overflow-hidden">
                      <img 
                        src={offer.image_url} 
                        alt={offer.title} 
                        className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-[1.02]" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-accent text-white uppercase tracking-wider mb-2 inline-block">
                          Active Event
                        </span>
                        <h3 className="text-2xl font-black leading-tight drop-shadow-sm">
                          {offer.title}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <div className="h-44 w-full bg-gradient-to-br from-primary-900 to-black p-6 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-accent/20 blur-2xl pointer-events-none" />
                      <div className="flex justify-between items-start">
                        <Gift className="w-8 h-8 text-accent animate-pulse" />
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-accent text-white uppercase tracking-wider">
                          Active Event
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white leading-tight">
                          {offer.title}
                        </h3>
                      </div>
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-6 md:p-8 space-y-4">
                    {offer.subtitle && (
                      <p className="text-xs font-bold text-accent uppercase tracking-widest">
                        {offer.subtitle}
                      </p>
                    )}

                    {offer.description && (
                      <p className="text-primary-600 dark:text-primary-300 text-sm leading-relaxed">
                        {offer.description}
                      </p>
                    )}

                    {/* Metadata details */}
                    <div className="space-y-2 border-t border-primary-100/60 dark:border-white/5 pt-4 text-xs text-primary-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-400" />
                        <span>
                          Valid until: {new Date(offer.ends_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary-400" />
                        <span>
                          {isSiteWide ? (
                            <span className="text-green-600 font-semibold dark:text-green-400">Site-wide Campaign (All items qualify)</span>
                          ) : (
                            <span>Eligible on specific collection items</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Expandable Terms */}
                    {offer.terms && (
                      <div className="border-t border-primary-100/60 dark:border-white/5 pt-4">
                        <button
                          onClick={() => toggleTerms(offer.id)}
                          className="flex items-center justify-between w-full text-xs font-bold text-primary-400 hover:text-accent transition-colors"
                        >
                          <span>Terms & Conditions</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        
                        {isExpanded && (
                          <div className="mt-3 text-xs text-primary-500 bg-primary-100/50 dark:bg-white/2 p-4 rounded-xl whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">
                            {offer.terms}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer action */}
                <div className="px-6 py-4 md:px-8 md:py-6 border-t border-primary-100/60 dark:border-white/5 bg-primary-100/10 dark:bg-white/1">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary-900 dark:text-white hover:text-accent dark:hover:text-accent transition-colors group/btn"
                  >
                    {isSiteWide ? 'Shop the Entire Store' : 'View Eligible Products'}{' '}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
