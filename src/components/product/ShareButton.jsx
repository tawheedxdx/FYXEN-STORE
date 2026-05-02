'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ShareButton({ title, text }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: title || 'Fyxen Store',
      text: text || 'Check out this product on Fyxen Store',
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors shrink-0 flex items-center justify-center relative group"
      aria-label="Share product"
      title="Share Product"
    >
      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
      
      {copied && (
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Link Copied!
        </span>
      )}
    </button>
  );
}
