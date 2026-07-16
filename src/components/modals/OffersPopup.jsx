'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function OffersPopup({ offers = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);

  useEffect(() => {
    if (offers && offers.length > 0) {
      // Find the latest active offer (already ordered by created_at desc from database query)
      const latestOffer = offers[0];
      setCurrentOffer(latestOffer);

      const lastPopupTime = localStorage.getItem('fyxen_last_offer_popup_time');
      const now = Date.now();
      
      // Show if 24 hours have passed since last seen
      if (!lastPopupTime || now - Number(lastPopupTime) > 24 * 60 * 60 * 1000) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1500); // Show 1.5 seconds after page load
        return () => clearTimeout(timer);
      }
    }
  }, [offers]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('fyxen_last_offer_popup_time', String(Date.now()));
  };

  if (!currentOffer) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-primary-950 rounded-[2.5rem] shadow-2xl overflow-hidden border border-primary-100 dark:border-white/10"
          >
            {/* Top Image or Pattern */}
            {currentOffer.image_url ? (
              <div className="h-56 w-full relative bg-primary-100 dark:bg-primary-900">
                <img 
                  src={currentOffer.image_url} 
                  alt={currentOffer.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-accent text-white uppercase tracking-wider mb-2 inline-block">
                    Limited Time Offer
                  </span>
                  <h3 className="text-2xl font-black leading-tight drop-shadow-md">
                    {currentOffer.title}
                  </h3>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-primary-900 to-black p-10 text-center relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute -top-12 -left-12 w-44 h-44 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-44 h-44 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
                
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-accent text-white uppercase tracking-wider mb-4 inline-block">
                  Special Campaign
                </span>
                
                <Gift className="w-16 h-16 text-accent mx-auto mb-4 animate-bounce" />
                
                <h3 className="text-3xl font-black text-white leading-tight">
                  {currentOffer.title}
                </h3>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-8 relative">
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-primary-100 dark:hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-primary-400" />
              </button>

              <div className="space-y-4">
                {currentOffer.subtitle && (
                  <p className="text-xs font-bold text-accent uppercase tracking-widest">
                    {currentOffer.subtitle}
                  </p>
                )}

                {currentOffer.description && !showTerms && (
                  <p className="text-primary-600 dark:text-primary-300 text-sm leading-relaxed">
                    {currentOffer.description}
                  </p>
                )}

                {showTerms ? (
                  <div className="border border-primary-100 dark:border-white/5 rounded-2xl p-4 bg-primary-50/50 dark:bg-white/2 max-h-40 overflow-y-auto text-xs text-primary-500 space-y-2">
                    <p className="font-bold text-primary-700 dark:text-white uppercase tracking-wider mb-2">Terms & Conditions</p>
                    <p className="whitespace-pre-line">{currentOffer.terms || 'No specific terms provided. Site-wide promotion rules apply.'}</p>
                  </div>
                ) : (
                  currentOffer.terms && (
                    <button
                      onClick={() => setShowTerms(true)}
                      className="text-xs font-bold text-primary-400 hover:text-accent flex items-center gap-1.5 transition-colors"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      View Terms & Conditions
                    </button>
                  )
                )}

                {showTerms && (
                  <button
                    onClick={() => setShowTerms(false)}
                    className="text-xs font-bold text-accent hover:underline"
                  >
                    ← Back to Offer Details
                  </button>
                )}

                {/* Primary Button */}
                <div className="pt-2">
                  <Link
                    href={currentOffer.eligible_product_ids && currentOffer.eligible_product_ids.length > 0 ? `/shop` : `/`}
                    onClick={handleClose}
                    className="btn-primary w-full py-4 text-center text-md font-bold rounded-2xl shadow-xl shadow-accent/20 hover:scale-[1.01] active:scale-98 transition-all block"
                  >
                    {currentOffer.eligible_product_ids && currentOffer.eligible_product_ids.length > 0
                      ? 'Shop Eligible Products'
                      : 'Explore Store'}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
