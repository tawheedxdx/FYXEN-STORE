'use client';

import { useState } from 'react';
import { subscribeNewsletter } from '@/app/(store)/actions';
import { Loader2, CheckCircle2, Copy, Check, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';

export default function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { alreadySubscribed: boolean, message: string }
  const [copied, setCopied] = useState(false);
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
      setResult({
        alreadySubscribed: Boolean(res.alreadySubscribed),
        message: res.message || 'Welcome to the FYXEN VIP Club!',
      });
      e.target.reset();
    }
    setLoading(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText('WELCOME10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (result) {
    const isAlready = result.alreadySubscribed;

    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-center max-w-md mx-auto animate-in fade-in zoom-in duration-500 shadow-2xl space-y-4">
        {isAlready ? (
          <div className="w-14 h-14 bg-[#c6a87c] rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg shadow-[#c6a87c]/30">
            <Sparkles className="w-7 h-7" />
          </div>
        ) : (
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        )}

        <div>
          <h3 className="text-2xl font-black text-white tracking-tight mb-1.5">
            {isAlready ? "You're Already Subscribed!" : result.message}
          </h3>
          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-light">
            {isAlready
              ? 'This email is already on the FYXEN VIP list. Your 10% discount code is active and ready to use:'
              : 'Thank you for joining our inner circle. Use your 10% discount code on your next purchase:'}
          </p>
        </div>

        {/* Promo code badge & copy button */}
        <div className="flex items-center justify-center gap-2 max-w-xs mx-auto pt-2">
          <div className="px-4 py-2.5 bg-white/15 border border-white/30 rounded-xl font-mono text-base font-black tracking-widest text-[#c6a87c]">
            WELCOME10
          </div>
          <button
            onClick={copyCode}
            className="px-4 py-2.5 bg-white text-neutral-950 hover:bg-neutral-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            title="Copy promo code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => setResult(null)}
          className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors pt-2 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" /> Subscribe a different email
        </button>
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
