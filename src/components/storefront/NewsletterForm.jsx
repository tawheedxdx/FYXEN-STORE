'use client';

import { useState } from 'react';
import { subscribeNewsletter } from '@/app/(store)/actions';
import { Loader2, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export default function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const res = await subscribeNewsletter(formData);

    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      e.target.reset();
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-center max-w-md mx-auto animate-in fade-in zoom-in duration-500 shadow-2xl">
        <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight mb-2">
          You&apos;re on the VIP List!
        </h3>
        <p className="text-neutral-300 text-sm leading-relaxed mb-4">
          Use promo code <strong className="text-amber-300 font-mono bg-white/10 px-2 py-1 rounded-md">WELCOME10</strong> on your next purchase for 10% OFF.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <div className="flex-1 relative">
        <input 
          type="email" 
          name="email"
          required
          placeholder="Enter your email address..." 
          className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#c6a87c] transition-all text-sm"
        />
        {error && (
          <p className="absolute -bottom-5 left-2 text-[11px] text-rose-400 font-bold tracking-wide">
            {error}
          </p>
        )}
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="px-7 py-4 bg-white text-neutral-950 hover:bg-neutral-100 active:scale-98 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Subscribe <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
