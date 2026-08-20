'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PartyPopper, X } from 'lucide-react';
import { markWelcomeAsSeen } from '@/app/(account)/account/wallet/actions';

const CONFETTI_DOTS = [
  { x: -140, duration: 2.4, delay: 0.2 },
  { x: -80, duration: 3.1, delay: 0.8 },
  { x: -30, duration: 2.7, delay: 1.4 },
  { x: 20, duration: 3.5, delay: 0.5 },
  { x: 90, duration: 2.9, delay: 1.1 },
  { x: 150, duration: 3.2, delay: 1.7 },
];

export default function WelcomeModal({ show }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setIsOpen(true), 1500); // Show after a short delay
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleClose = async () => {
    setIsOpen(false);
    await markWelcomeAsSeen();
  };

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

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-[#0c0c0e] rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
          >
            {/* Top Pattern/Glow */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#c6a87c]/20 to-transparent pointer-events-none" />

            <div className="p-8 text-center relative z-10">
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>

              <motion.div
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
                className="w-16 h-16 bg-[#c6a87c] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#c6a87c]/20"
              >
                <PartyPopper className="w-8 h-8 text-white" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-black mb-3 text-neutral-950 dark:text-white leading-tight">
                Welcome to <span className="text-[#c6a87c]">FYXEN!</span>
              </h2>
              
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-xs mx-auto leading-relaxed font-light">
                We&apos;re thrilled to have you. As a welcome gift, we&apos;ve credited your store wallet with:
              </p>

              <div className="inline-flex items-center gap-3 bg-[#c6a87c]/10 px-6 py-3 rounded-2xl mb-8 border border-[#c6a87c]/20">
                <Sparkles className="w-5 h-5 text-[#c6a87c] animate-pulse" />
                <span className="text-2xl font-black text-[#c6a87c]">₹15.00</span>
                <Sparkles className="w-5 h-5 text-[#c6a87c] animate-pulse" />
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleClose}
                  className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Start Exploring
                </button>
                <p className="text-[11px] text-neutral-400 font-medium">
                  Automatically applied at checkout on your first order!
                </p>
              </div>
            </div>

            {/* Confetti-like dots */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {CONFETTI_DOTS.map((dot, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    y: [0, 200],
                    x: dot.x,
                  }}
                  transition={{ 
                    duration: dot.duration, 
                    repeat: Infinity,
                    delay: dot.delay,
                  }}
                  className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-[#c6a87c]/40"
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
