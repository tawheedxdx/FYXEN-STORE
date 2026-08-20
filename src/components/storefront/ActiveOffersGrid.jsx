'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gift, Calendar, ArrowRight, Clock, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function ActiveOffersGrid({ offers = [] }) {
  const [expandedTermsId, setExpandedTermsId] = useState(null);

  if (!offers || offers.length === 0) return null;

  const toggleTerms = (id) => {
    setExpandedTermsId(prev => prev === id ? null : id);
  };

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-[#09090b] border-b border-neutral-100 dark:border-neutral-900">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c6a87c]/10 text-[#c6a87c] text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Special Events
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
            Promotions &amp; <span className="font-light italic text-neutral-500">Giveaways</span>
          </h2>
          <p className="text-sm text-neutral-500 font-light">
            Participate in our ongoing seasonal events to unlock exclusive rewards and special pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offers.map((offer) => {
            const isSiteWide = !offer.eligible_product_ids || offer.eligible_product_ids.length === 0;
            const isExpanded = expandedTermsId === offer.id;

            return (
              <div 
                key={offer.id} 
                className="bg-neutral-50/70 dark:bg-neutral-900/50 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-xl transition-all group"
              >
                <div>
                  {/* Image */}
                  {offer.image_url ? (
                    <div className="h-56 md:h-64 w-full relative bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <Image 
                        src={offer.image_url} 
                        alt={offer.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#c6a87c] text-white uppercase tracking-wider mb-2 inline-block shadow-md">
                          Active Event
                        </span>
                        <h3 className="text-2xl font-black leading-tight drop-shadow-sm">
                          {offer.title}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <div className="h-44 w-full bg-gradient-to-br from-neutral-950 to-neutral-900 p-6 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-[#c6a87c]/20 blur-2xl pointer-events-none" />
                      <div className="flex justify-between items-start">
                        <Gift className="w-8 h-8 text-[#c6a87c] animate-pulse" />
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#c6a87c] text-white uppercase tracking-wider">
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
                      <p className="text-xs font-bold text-[#c6a87c] uppercase tracking-widest">
                        {offer.subtitle}
                      </p>
                    )}

                    {offer.description && (
                      <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed font-light">
                        {offer.description}
                      </p>
                    )}

                    {/* Metadata details */}
                    <div className="space-y-2 border-t border-neutral-200/60 dark:border-neutral-800 pt-4 text-xs text-neutral-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        <span>
                          Valid until: {new Date(offer.ends_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral-400" />
                        <span>
                          {isSiteWide ? (
                            <span className="text-emerald-600 font-semibold dark:text-emerald-400">Site-wide Campaign (All items qualify)</span>
                          ) : (
                            <span>Eligible on specific collection items</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Expandable Terms */}
                    {offer.terms && (
                      <div className="border-t border-neutral-200/60 dark:border-neutral-800 pt-4">
                        <button
                          onClick={() => toggleTerms(offer.id)}
                          className="flex items-center justify-between w-full text-xs font-bold text-neutral-500 hover:text-[#c6a87c] transition-colors cursor-pointer"
                        >
                          <span>Terms &amp; Conditions</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        
                        {isExpanded && (
                          <div className="mt-3 text-xs text-neutral-500 bg-neutral-100/70 dark:bg-neutral-800/50 p-4 rounded-xl whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">
                            {offer.terms}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer action */}
                <div className="px-6 py-4 md:px-8 md:py-6 border-t border-neutral-200/60 dark:border-neutral-800 bg-neutral-100/40 dark:bg-neutral-850/40">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm font-bold text-neutral-950 dark:text-white hover:text-[#c6a87c] dark:hover:text-[#c6a87c] transition-colors group/btn"
                  >
                    {isSiteWide ? 'Shop Entire Store' : 'View Eligible Products'}{' '}
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
