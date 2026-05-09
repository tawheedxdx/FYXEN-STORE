'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PartyPopper, X } from 'lucide-react';
import { markWelcomeAsSeen } from '@/app/(account)/account/wallet/actions';

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
            className="relative w-full max-w-lg bg-white dark:bg-primary-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Top Pattern/Glow */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-accent/20 to-transparent pointer-events-none" />

            <div className="p-8 md:p-12 text-center relative z-10">
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-primary-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-primary-400" />
              </button>

              <motion.div
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
                className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-accent/20"
              >
                <PartyPopper className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-900 dark:text-white leading-tight">
                Welcome to <span className="text-accent">Fyxen!</span>
              </h2>
              
              <p className="text-lg text-primary-600 dark:text-primary-400 mb-8 max-w-sm mx-auto">
                We're excited to have you here. As a special gift, we've credited your wallet with
              </p>

              <div className="inline-flex items-center gap-3 bg-accent/10 px-8 py-4 rounded-2xl mb-10 border border-accent/20">
                <Sparkles className="w-6 h-6 text-accent animate-pulse" />
                <span className="text-3xl font-black text-accent">₹15.00</span>
                <Sparkles className="w-6 h-6 text-accent animate-pulse" />
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleClose}
                  className="btn-primary w-full py-4 text-lg font-bold rounded-2xl shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Start Shopping
                </button>
                <p className="text-xs text-primary-400">
                  Use this balance at checkout on your first order!
                </p>
              </div>
            </div>

            {/* Confetti-like dots */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
               {[...Array(12)].map((_, i) => (
                 <motion.div
                   key={i}
                   initial={{ opacity: 0, y: -20 }}
                   animate={{ 
                     opacity: [0, 1, 0], 
                     y: [0, 200],
                     x: Math.random() * 400 - 200
                   }}
                   transition={{ 
                     duration: 2 + Math.random() * 2, 
                     repeat: Infinity,
                     delay: Math.random() * 5
                   }}
                   className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-accent/30"
                 />
               ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
