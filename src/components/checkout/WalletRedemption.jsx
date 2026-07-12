'use client';

import { useState, useEffect } from 'react';
import { Wallet, CheckCircle2 } from 'lucide-react';

export default function WalletRedemption({ profile, subtotal, shipping, tax, currentDiscount, loyaltyDiscount, onRedeem }) {
  const [useWallet, setUseWallet] = useState(false);
  const balance = profile?.wallet_balance || 0;

  // Calculate how much wallet balance can be applied
  const remainingTotal = Math.max(0, subtotal - currentDiscount - loyaltyDiscount + shipping + tax);
  const walletDeduction = Math.min(balance, remainingTotal);

  useEffect(() => {
    onRedeem(useWallet ? walletDeduction : 0);
  }, [useWallet, walletDeduction]);

  if (balance <= 0) return null;

  return (
    <div className="mt-6 pt-6 border-t border-primary-100 dark:border-white/10">
      <div 
        onClick={() => setUseWallet(!useWallet)}
        className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
          useWallet 
            ? 'border-accent bg-accent/5' 
            : 'border-primary-100 dark:border-white/10 hover:border-primary-300 dark:hover:border-white/20'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${useWallet ? 'bg-accent text-white' : 'bg-primary-100 dark:bg-white/5 text-primary-400'}`}>
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary-900 dark:text-white">Pay with Wallet Balance</p>
              <p className="text-xs text-primary-500">Available: ₹{balance.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {useWallet && (
              <span className="text-sm font-bold text-accent">-₹{walletDeduction.toFixed(2)}</span>
            )}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              useWallet ? 'border-accent bg-accent' : 'border-primary-200 dark:border-white/20'
            }`}>
              {useWallet && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
          </div>
        </div>

        {/* Hidden input for form submission */}
        <input type="hidden" name="useWallet" value={useWallet.toString()} />
      </div>
    </div>
  );
}
