'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function OffersPopup({ offers = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const currentOffer = offers && offers.length > 0 ? offers[0] : null;

  useEffect(() => {
    if (!currentOffer) return;

    const lastPopupTime = localStorage.getItem('fyxen_last_offer_popup_time');
    const now = Date.now();
    
    // Show if 24 hours have passed since last seen
    if (!lastPopupTime || now - Number(lastPopupTime) > 24 * 60 * 60 * 1000) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500); // Show 1.5 seconds after page load
      return () => clearTimeout(timer);
    }
  }, [currentOffer]);

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
            className="relative w-full max-w-md bg-white dark:bg-[#0c0c0e] rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
          >
            {/* Top Image or Pattern */}
            {currentOffer.image_url ? (
              <div className="h-52 w-full relative bg-neutral-100 dark:bg-neutral-900">
                <Image 
                  src={currentOffer.image_url} 
                  alt={currentOffer.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#c6a87c] text-white uppercase tracking-wider mb-2 inline-block shadow-md">
                    Limited Time Event
                  </span>
                  <h3 className="text-xl font-bold leading-tight drop-shadow-md">
                    {currentOffer.title}
                  </h3>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 p-8 text-center relative overflow-hidden text-white">
                <div className="absolute -top-12 -left-12 w-44 h-44 rounded-full bg-[#c6a87c]/20 blur-3xl pointer-events-none" />
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#c6a87c] text-white uppercase tracking-wider mb-3 inline-block">
                  Special Campaign
                </span>
                <Gift className="w-12 h-12 text-[#c6a87c] mx-auto mb-3 animate-pulse" />
                <h3 className="text-2xl font-black leading-tight">
                  {currentOffer.title}
                </h3>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 sm:p-8 relative">
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>

              <div className="space-y-4">
                {currentOffer.subtitle && (
                  <p className="text-xs font-bold text-[#c6a87c] uppercase tracking-widest">
                    {currentOffer.subtitle}
                  </p>
                )}

                {currentOffer.description && !showTerms && (
                  <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed font-light">
                    {currentOffer.description}
                  </p>
                )}

                {showTerms ? (
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 bg-neutral-50 dark:bg-neutral-900/50 max-h-40 overflow-y-auto text-xs text-neutral-500 space-y-2">
                    <p className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-1 text-[11px]">Terms &amp; Conditions</p>
                    <p className="whitespace-pre-line leading-relaxed">{currentOffer.terms || 'No specific terms provided. Site-wide promotion rules apply.'}</p>
                  </div>
                ) : (
                  currentOffer.terms && (
                    <button
                      onClick={() => setShowTerms(true)}
                      className="text-xs font-bold text-neutral-400 hover:text-[#c6a87c] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      View Terms &amp; Conditions
                    </button>
                  )
                )}

                {showTerms && (
                  <button
                    onClick={() => setShowTerms(false)}
                    className="text-xs font-bold text-[#c6a87c] hover:underline cursor-pointer"
                  >
                    &larr; Back to Offer Details
                  </button>
                )}

                {/* Primary Button */}
                <div className="pt-2">
                  <Link
                    href={currentOffer.eligible_product_ids && currentOffer.eligible_product_ids.length > 0 ? `/shop` : `/`}
                    onClick={handleClose}
                    className="btn-primary w-full py-3.5 text-center text-xs font-bold uppercase tracking-wider rounded-xl transition-all block"
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
