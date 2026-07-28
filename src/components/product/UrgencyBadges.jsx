'use client';

import { useState, useEffect } from 'react';
import { Flame, Zap, ShoppingCart } from 'lucide-react';

export default function UrgencyBadges({ stockQuantity = 5, productId = '' }) {
  const [viewerCount, setViewerCount] = useState(14);
  const [purchasedTodayCount, setPurchasedTodayCount] = useState(6);

  useEffect(() => {
    // Generate a consistent pseudo-random number based on productId for realistic live activity
    let hash = 0;
    const str = String(productId || 'fyxen');
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const pseudoViewer = 11 + (Math.abs(hash) % 18); // Range 11 - 28
    const pseudoPurchased = 4 + (Math.abs(hash) % 10); // Range 4 - 13

    setViewerCount(pseudoViewer);
    setPurchasedTodayCount(pseudoPurchased);
  }, [productId]);

  const isLowStock = stockQuantity > 0 && stockQuantity <= 10;

  return (
    <div className="space-y-3 my-4">
      {/* Dynamic Low Stock Alert */}
      {isLowStock ? (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-semibold">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
          <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            ⚡ <strong className="font-extrabold text-amber-800 dark:text-amber-200">Only {stockQuantity} left in stock</strong> — order soon!
          </span>
        </div>
      ) : stockQuantity > 10 ? (
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span>⚡ High Demand: Fast dispatch guaranteed</span>
        </div>
      ) : null}

      {/* Live Activity & Social Proof Signal */}
      <div className="flex flex-wrap items-center gap-2.5 text-xs text-primary-600 dark:text-primary-300 font-medium">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-800 dark:text-orange-300">
          <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <span>🔥 <strong className="font-bold">{viewerCount} people</strong> viewed this in the last hour</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-300">
          <ShoppingCart className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>🛒 <strong className="font-bold">{purchasedTodayCount} orders</strong> placed today</span>
        </div>
      </div>
    </div>
  );
}
