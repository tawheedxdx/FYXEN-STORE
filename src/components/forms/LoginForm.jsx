'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { login, continueAsGuest } from '@/app/(auth)/actions';
import { ArrowRight, Loader2, User, Phone, Mail, Lock, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginForm() {
  const [mode, setMode] = useState('login'); // 'login' or 'guest'
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(formData) {
    setIsLoading(true);
    setError(null);
    const res = await login(formData);
    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    }
  }

  async function handleGuest(formData) {
    setIsLoading(true);
    setError(null);
    const res = await continueAsGuest(formData);
    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full min-h-screen">
      {/* Visual Section - Left Side */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 lg:p-16 bg-neutral-950 text-white relative overflow-hidden select-none border-r border-white/5">
        {/* Decorative Grid and Ambient Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(198,168,124,0.12),transparent_70%)] pointer-events-none" />
        
        {/* Brand Logo Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-block">
            <img src="/logo.png" alt="FYXEN" className="h-10 w-auto object-contain brightness-0 invert" />
          </Link>
        </div>

        {/* Center: Luxury Editorial Badge & Card */}
        <div className="relative z-10 my-auto py-8 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#c6a87c] text-xs font-bold uppercase tracking-widest border border-white/10">
              <Sparkles className="w-3.5 h-3.5" /> Premium Essentials
            </div>

            <h2 className="text-3xl xl:text-4xl font-black tracking-tight text-white leading-tight">
              Thoughtfully Engineered for Modern Living.
            </h2>

            <p className="text-sm text-neutral-400 leading-relaxed font-light">
              Sign in to manage your orders, track shipments in real-time, and unlock exclusive VIP pricing on every drop.
            </p>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-neutral-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pan-India express delivery tracking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>7-Day hassle-free return guarantee</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>VIP inner circle access &amp; instant offers</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Guarantee */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-neutral-500">
          <ShieldCheck className="w-4 h-4 text-[#c6a87c]" />
          <span>256-Bit SSL Encrypted &amp; Secure Verification</span>
        </div>
      </div>

      {/* Form Section - Right Side */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-16 md:py-24 bg-white dark:bg-[#09090b]">
        <div className="w-full max-w-sm space-y-6">
          {error && (
            <div className="p-3.5 text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-xl animate-in fade-in slide-in-from-top-1 font-semibold">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form action={handleLogin} className="space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-xs text-neutral-500 mt-1.5 font-light">
                  Sign in to your FYXEN account to continue.
                </p>
              </div>

              <div>
                <label htmlFor="identifier" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input 
                    id="identifier" 
                    name="identifier" 
                    type="text" 
                    required 
                    className="pl-10 h-11 w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans" 
                    placeholder="you@example.com or 9876543210"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Password
                  </label>
                  <Link href="/forgot-password" size="sm" className="text-xs font-bold text-neutral-900 dark:text-white hover:underline transition-colors underline-offset-2">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    className="pl-10 h-11 w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans" 
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-primary w-full h-11 rounded-xl shadow-lg shadow-neutral-900/10 cursor-pointer font-bold text-xs uppercase tracking-wider"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Sign In'}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-100 dark:border-neutral-900"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white dark:bg-[#09090b] px-4 text-neutral-400 font-bold tracking-widest">Or</span>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => setMode('guest')}
                className="w-full h-11 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 text-neutral-900 dark:text-white font-bold rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
              >
                Continue as Guest
              </button>

              <div className="text-center mt-6">
                <p className="text-xs text-neutral-500 font-light">
                  New to FYXEN?{' '}
                  <Link href="/signup" className="font-bold text-neutral-900 dark:text-white hover:underline transition-colors underline-offset-4">
                    Create an account
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <form action={handleGuest} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
                  Guest Checkout
                </h2>
                <p className="text-xs text-neutral-500 mt-1.5 font-light">
                  Complete your order quickly without creating a password.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input 
                    name="fullName" 
                    type="text" 
                    required 
                    className="pl-10 h-11 w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans" 
                    placeholder="Aarav Sharma"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input 
                    name="phone" 
                    type="tel" 
                    required 
                    className="pl-10 h-11 w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans" 
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-primary w-full h-11 rounded-xl shadow-lg shadow-neutral-900/10 cursor-pointer font-bold text-xs uppercase tracking-wider"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (
                  <span className="flex items-center justify-center gap-2 font-bold">
                    Continue to Bag <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>

              <button 
                type="button" 
                onClick={() => setMode('login')}
                className="w-full text-xs font-bold text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
