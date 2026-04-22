'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function RazorpayAffordabilityWidget({ price }) {
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const renderWidget = () => {
      if (window.RazorpayAffordabilitySuite && price >= 1000) {
        const container = document.getElementById('razorpay-affordability-widget');
        if (container) {
          container.innerHTML = ''; // Clear previous widget
          
          try {
            const amountInPaise = Math.round(price * 100);
            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;

            new window.RazorpayAffordabilitySuite({
              key: razorpayKey,
              amount: amountInPaise,
            }).render();
          } catch (error) {
            console.error('Razorpay Affordability Widget initialization failed:', error);
          }
        }
      }
    };

    // Initial render attempt
    renderWidget();

    // Listen for script load if not already loaded
    window.addEventListener('razorpay-affordability-loaded', renderWidget);

    return () => {
      window.removeEventListener('razorpay-affordability-loaded', renderWidget);
      const container = document.getElementById('razorpay-affordability-widget');
      if (container) container.innerHTML = '';
    };
  }, [price]);

  if (price < 1000) return null;

  return (
    <>
      <Script
        src="https://cdn.razorpay.com/widgets/affordability/affordability.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.dispatchEvent(new Event('razorpay-affordability-loaded'));
        }}
      />
      <div id="razorpay-affordability-widget" className="my-2"></div>
    </>
  );
}
