'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Truck, ArrowRight, Check, X, Star, Gift } from 'lucide-react';

export default function PaymentSelectionModal({ isOpen, onClose, onConfirm, amount }) {
  const [step, setStep] = useState('choice'); // 'choice' or 'confirm'
  const [selectedMethod, setSelectedMethod] = useState(null); // 'COD' or 'ONLINE'
  const [isSliding, setIsSliding] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const sliderRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setStep('choice');
      setSelectedMethod(null);
      setSliderPosition(0);
    }
  }, [isOpen]);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setStep('confirm');
  };

  const handleSliderMove = (e) => {
    if (!isSliding || !trackRef.current) return;
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const trackRect = trackRef.current.getBoundingClientRect();
    const newPos = Math.max(0, Math.min(clientX - trackRect.left - 24, trackRect.width - 48 - 4));
    
    setSliderPosition(newPos);

    // If reached end
    if (newPos >= trackRect.width - 48 - 10) {
      setIsSliding(false);
      setSliderPosition(trackRect.width - 48 - 4);
      onConfirm(selectedMethod);
    }
  };

  const handleSliderEnd = () => {
    if (!isSliding) return;
    setIsSliding(false);
    if (sliderPosition < (trackRef.current?.offsetWidth - 60)) {
      setSliderPosition(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-primary-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-primary-100 dark:border-white/10"
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-primary-100 dark:border-white/5 bg-primary-50/50 dark:bg-white/5">
          <h3 className="text-lg font-bold">Payment Method</h3>
          <button onClick={onClose} className="p-2 hover:bg-primary-100 dark:hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 'choice' ? (
              <motion.div 
                key="choice"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <p className="text-center text-primary-600 dark:text-primary-400 font-medium mb-6">
                  Which mode you preffer?
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => handleMethodSelect('COD')}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary-100 dark:border-white/5 hover:border-accent hover:bg-accent/5 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-primary-900 dark:text-white">CoD (Cash on Delivery)</p>
                      <p className="text-sm text-primary-500">Pay when you receive the order</p>
                      <p className="text-[10px] text-primary-400 mt-2 flex items-center gap-1 font-bold italic">
                        No points earned on CoD
                      </p>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleMethodSelect('ONLINE')}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary-100 dark:border-white/5 hover:border-accent hover:bg-accent/5 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-primary-900 dark:text-white">Online Payment</p>
                          <p className="text-sm text-primary-500">Fast & Secure via Razorpay</p>
                        </div>
                        <div className="bg-accent/10 text-accent px-2 py-1 rounded-md flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-[10px] font-black">{Math.floor(amount / 100) * 10}</span>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-[10px] font-bold text-green-600 dark:text-green-400 flex items-center gap-1.5 uppercase tracking-tight">
                          <Gift className="w-3 h-3" />
                          Earn extra benefits!
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <p className="text-sm text-primary-500 mb-1">Confirm your order for</p>
                  <p className="text-3xl font-black text-primary-900 dark:text-white">₹{amount.toFixed(2)}</p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-white/10 text-xs font-bold uppercase tracking-wider">
                    {selectedMethod === 'COD' ? <Truck className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                    {selectedMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                  </div>
                </div>

                {/* Slide to Confirm */}
                <div className="relative group">
                  <p className="text-center text-xs font-bold text-primary-400 mb-4 uppercase tracking-widest">Slide to confirm order</p>
                  
                  <div 
                    ref={trackRef}
                    className="h-16 bg-primary-100 dark:bg-white/5 rounded-full relative p-1 overflow-hidden"
                    onMouseMove={handleSliderMove}
                    onMouseUp={handleSliderEnd}
                    onMouseLeave={handleSliderEnd}
                    onTouchMove={handleSliderMove}
                    onTouchEnd={handleSliderEnd}
                  >
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="text-sm font-bold text-primary-400 flex items-center gap-2">
                        {selectedMethod === 'COD' ? 'PLACE ORDER' : 'PROCEED TO PAY'}
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      </p>
                    </div>

                    <motion.div
                      className="absolute top-1 bottom-1 bg-accent rounded-full flex items-center justify-center text-white cursor-grab active:cursor-grabbing shadow-lg"
                      style={{ 
                        left: sliderPosition + 4,
                        width: 56,
                        height: 56
                      }}
                      onMouseDown={() => setIsSliding(true)}
                      onTouchStart={() => setIsSliding(true)}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }} // We handle logic manually for cleaner feel
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  </div>

                  <button 
                    onClick={() => setStep('choice')}
                    className="w-full mt-6 text-sm text-primary-500 hover:text-primary-900 dark:hover:text-white font-medium transition-colors"
                  >
                    Change Payment Method
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
