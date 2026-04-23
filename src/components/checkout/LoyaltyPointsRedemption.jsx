'use client';

import { useState, useEffect } from 'react';
import { Star, Info, Loader2 } from 'lucide-react';

export default function LoyaltyPointsRedemption({ 
  profile, 
  onRedeem, 
  subtotal, 
  shipping, 
  tax,
  currentDiscount 
}) {
  const [pointsToUse, setPointsToUse] = useState(0);
  const [availablePoints, setAvailablePoints] = useState(0);
  
  useEffect(() => {
    // Fetch fresh points from profile if available
    setAvailablePoints(profile?.loyalty_points || 0);
  }, [profile]);

  const maxRedeemablePoints = availablePoints;
  const discountValue = pointsToUse * 0.5;
  
  // Calculate potential grand total to ensure points don't exceed order value
  const potentialTotal = Math.max(0, subtotal - currentDiscount + shipping + tax);
  const maxPointsByOrderValue = Math.floor(potentialTotal / 0.5);
  const realMaxPoints = Math.min(maxRedeemablePoints, maxPointsByOrderValue);

  const handleApply = () => {
    onRedeem(pointsToUse);
  };

  if (availablePoints <= 0) {
    return (
      <div className="p-4 bg-primary-50 dark:bg-white/5 rounded-2xl border border-primary-100 dark:border-white/10 mt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-primary-900 flex items-center justify-center text-primary-300">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary-900 dark:text-white uppercase tracking-tight">Loyalty Points</p>
            <p className="text-xs text-primary-500">Shop online to earn points and get discounts on future orders!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-black border border-primary-200 dark:border-white/10 rounded-2xl shadow-sm mt-8 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary-900 dark:text-white uppercase tracking-tight">Redeem Points</h3>
            <p className="text-sm text-primary-500 font-medium">Balance: <span className="text-primary-900 dark:text-accent">{availablePoints}</span> points</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-primary-400 uppercase font-bold tracking-widest">Discount</p>
          <p className="text-xl font-black text-green-600">₹{discountValue.toFixed(1)}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input 
            type="range" 
            min="0" 
            max={realMaxPoints} 
            step="1"
            value={pointsToUse}
            onChange={(e) => setPointsToUse(parseInt(e.target.value))}
            className="w-full h-2 bg-primary-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <div className="flex justify-between mt-2 text-[10px] font-bold text-primary-400 uppercase tracking-widest">
            <span>0</span>
            <span>{realMaxPoints} Max</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input 
              type="number" 
              min="0"
              max={realMaxPoints}
              value={pointsToUse}
              onChange={(e) => setPointsToUse(Math.min(realMaxPoints, parseInt(e.target.value) || 0))}
              className="input-field py-3 pl-4 pr-12 font-bold"
              placeholder="0"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary-400">PTS</span>
          </div>
          <button 
            type="button"
            onClick={handleApply}
            className="btn-primary py-3 px-8 h-auto"
          >
            Apply
          </button>
        </div>

        <p className="text-[10px] text-primary-400 flex items-center gap-1.5 leading-tight">
          <Info className="w-3 h-3" />
          1 point = ₹0.5. You can redeem up to your full balance or the order total.
        </p>
      </div>
    </div>
  );
}
