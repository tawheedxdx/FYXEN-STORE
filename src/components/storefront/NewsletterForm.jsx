'use client';

import { useState } from 'react';
import { subscribeNewsletter } from '@/app/(store)/actions';
import { Loader2, CheckCircle2 } from 'lucide-react';

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

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      e.target.reset();
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-accent/20 backdrop-blur-sm border border-accent/30 p-8 rounded-[2rem] text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-primary-900" />
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">You're in!</h3>
        <p className="text-primary-200">Welcome to the elite. Check your inbox soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
      <div className="flex-1 relative">
        <input 
          type="email" 
          name="email"
          required
          placeholder="your@email.com" 
          className="w-full px-8 py-5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
        />
        {error && <p className="absolute -bottom-6 left-0 text-[10px] text-red-400 font-bold uppercase tracking-widest">{error}</p>}
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="bg-accent text-primary-900 px-10 py-5 rounded-2xl font-black uppercase hover:bg-white transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join Now'}
      </button>
    </form>
  );
}
