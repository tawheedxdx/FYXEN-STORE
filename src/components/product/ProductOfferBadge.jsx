'use client';

import { useState } from 'react';
import { Gift, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductOfferBadge({ offers = [] }) {
  const [activeTerms, setActiveTerms] = useState(null);

  if (!offers || offers.length === 0) return null;

  return (
    <div className="space-y-3 mt-4">
      {offers.map((offer) => {
        const isSiteWide = !offer.eligible_product_ids || offer.eligible_product_ids.length === 0;

        return (
          <div 
            key={offer.id}
            className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-accent/5 dark:bg-accent/10 border border-accent/15 dark:border-accent/20 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 dark:bg-accent/20 flex items-center justify-center text-accent shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black text-primary-900 dark:text-white leading-tight">
                    {offer.title}
                  </p>
                  {isSiteWide && (
                    <span className="text-[9px] font-bold text-accent uppercase tracking-wider bg-accent/10 dark:bg-accent/20 px-1.5 py-0.5 rounded">
                      Site-wide
                    </span>
                  )}
                </div>
                {offer.subtitle && (
                  <p className="text-xs text-primary-500 dark:text-primary-400 mt-0.5 font-medium">
                    {offer.subtitle}
                  </p>
                )}
              </div>
            </div>

            {offer.terms && (
              <button
                onClick={() => setActiveTerms(offer)}
                className="p-1.5 text-primary-400 hover:text-accent dark:hover:text-accent rounded-lg transition-colors"
                title="View Offer Terms"
              >
                <HelpCircle className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
        );
      })}

      {/* Terms Modal */}
      <AnimatePresence>
        {activeTerms && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTerms(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-primary-950 rounded-3xl p-6 shadow-2xl border border-primary-100 dark:border-white/10 z-10"
            >
              <button
                onClick={() => setActiveTerms(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-primary-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-primary-400" />
              </button>

              <h4 className="text-lg font-bold text-primary-900 dark:text-white pr-8 mb-1">
                {activeTerms.title}
              </h4>
              {activeTerms.subtitle && (
                <p className="text-xs font-bold text-accent uppercase tracking-wider mb-4">
                  {activeTerms.subtitle}
                </p>
              )}

              <div className="bg-primary-50/50 dark:bg-white/2 border border-primary-100 dark:border-white/5 rounded-2xl p-4 max-h-48 overflow-y-auto">
                <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1.5">Terms & Conditions</p>
                <p className="text-xs text-primary-500 leading-relaxed whitespace-pre-line">
                  {activeTerms.terms}
                </p>
              </div>

              <button
                onClick={() => setActiveTerms(null)}
                className="btn-primary w-full py-3 mt-6 text-sm font-bold rounded-xl"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
