'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, Lock } from 'lucide-react';
import { createCheckoutSession } from '@/services/checkout/session';
import { useRouter } from 'next/navigation';

export default function ProceedToCheckoutButton({ 
  className = '', 
  children, 
  disabled = false,
  onInitiated = null 
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (disabled || loading) return;
    setLoading(true);
    if (onInitiated) onInitiated();

    try {
      const res = await createCheckoutSession();
      if (res.error) {
        if (res.error === 'auth_required' && res.redirectUrl) {
          router.push(res.redirectUrl);
          return;
        }
        alert(res.message || 'Unable to initiate checkout session. Please try again.');
        setLoading(false);
        return;
      }

      if (res.redirectUrl) {
        window.location.href = res.redirectUrl;
      }
    } catch (err) {
      console.error('Checkout session creation error:', err);
      alert('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled || loading}
      className={`btn-primary relative flex items-center justify-center gap-2 ${className} ${
        disabled || loading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-[#c6a87c]" />
          <span>Creating Secure Session...</span>
        </>
      ) : children ? (
        children
      ) : (
        <>
          <Lock className="w-3.5 h-3.5" />
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
