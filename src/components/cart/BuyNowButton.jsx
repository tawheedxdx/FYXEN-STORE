'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { addToCart } from '@/app/(store)/cart/actions';
import { useRouter } from 'next/navigation';

export default function BuyNowButton({ product }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBuyNow = async () => {
    setIsProcessing(true);
    
    // 1. Add to cart
    const res = await addToCart(product.id, 1);
    
    if (res?.error) {
      if (res.error.includes('sign in')) {
        router.push('/login?redirect=/product/' + product.slug);
      } else {
        alert(res.error);
      }
    } else {
      // 2. Redirect to checkout immediately
      router.push('/checkout');
    }
    
    setIsProcessing(false);
  };

  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <button 
      onClick={handleBuyNow}
      disabled={isOutOfStock || isProcessing}
      className="btn-outline flex-1 h-12 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black transition-all px-2 text-xs md:text-sm whitespace-nowrap"
    >
      <span className="flex items-center justify-center gap-1.5 font-bold">
        <CreditCard className="w-4 h-4" />
        {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
      </span>
    </button>
  );
}
