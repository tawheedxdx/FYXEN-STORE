'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

/**
 * Razorpay Affordability Widget
 * Displays EMI, Pay Later, and other affordability offers for a given price.
 * 
 * @param {Object} props
 * @param {number} props.price - The product price in Rupees (e.g. 999)
 */
export default function RazorpayAffordabilityWidget({ price }) {
  const widgetInstanceRef = useRef(null);
  const widgetContainerId = 'razorpay-affordability-widget';

  // Function to initialize or re-render the widget
  const initWidget = () => {
    if (typeof window === 'undefined' || !window.RazorpayAffordabilitySuite) return;

    // Convert price to paise (₹1 = 100 paise)
    const amountInPaise = Math.round(price * 100);

    try {
      // Clear previous widget content if any
      const container = document.getElementById(widgetContainerId);
      if (container) container.innerHTML = '';

      // Initialize the widget suite
      widgetInstanceRef.current = new window.RazorpayAffordabilitySuite({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amountInPaise,
        theme: {
          color: "#111111" // Fyxen primary dark theme
        }
      });

      // Render the widget into the container
      widgetInstanceRef.current.render();
    } catch (err) {
      console.error('Razorpay Affordability Widget initialization failed:', err);
    }
  };

  // Re-run initialization whenever the price changes
  useEffect(() => {
    // If the script is already loaded, re-init immediately
    if (window.RazorpayAffordabilitySuite) {
      initWidget();
    }

    // Cleanup on unmount or before next effect
    return () => {
      const container = document.getElementById(widgetContainerId);
      if (container) container.innerHTML = '';
      widgetInstanceRef.current = null;
    };
  }, [price]);

  return (
    <div className="my-4 min-h-[40px]">
      <Script
        src="https://cdn.razorpay.com/widgets/affordability/affordability.js"
        strategy="afterInteractive"
        onLoad={initWidget}
      />
      
      {/* The widget will be rendered inside this div */}
      <div 
        id={widgetContainerId}
        className="razorpay-affordability-widget-container"
      ></div>
      
      <style jsx>{`
        .razorpay-affordability-widget-container :global(iframe) {
          max-width: 100% !important;
          margin: 0 auto !important;
        }
      `}</style>
    </div>
  );
}
