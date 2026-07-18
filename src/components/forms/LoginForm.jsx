'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { login, continueAsGuest } from '@/app/(auth)/actions';
import { ArrowRight, Loader2, User, Phone, Mail, Lock } from 'lucide-react';

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
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-neutral-950 text-white relative overflow-hidden select-none">
        {/* Decorative Grid and Ambient Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-grid-white/[0.01]" />
        
        {/* Brand Slogan placeholder */}
        <div className="relative z-10">
          <Link href="/" className="text-xl font-bold tracking-tight text-white/90">
            FYXEN Store
          </Link>
        </div>

        {/* Floating SVG Illustration */}
        <div className="relative z-10 flex flex-col items-center justify-center py-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[340px] xl:max-w-[400px]"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/login SVGS/login-rafiki.svg"
                alt="Login Illustration"
                width={400}
                height={400}
                className="w-full h-auto object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Text Copy */}
        <div className="relative z-10 space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Smart Utilities for Modern Living
          </h2>
          <p className="text-sm text-neutral-400 max-w-sm leading-relaxed font-light font-sans">
            Sign in to track your shipments, access saved carts, and manage your premium kitchen & electronic gadgets with ease.
          </p>
        </div>
      </div>

      {/* Form Section - Right Side */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-16 md:py-24 bg-white dark:bg-[#09090b]">
        <div className="w-full max-w-sm space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl animate-in fade-in slide-in-from-top-1 font-sans">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form action={handleLogin} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white font-sans">Welcome Back</h2>
                <p className="text-sm text-neutral-500 mt-1 font-sans">Sign in to your Fyxen account.</p>
              </div>

              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1 font-sans">Email or Phone Number</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input 
                    id="identifier" 
                    name="identifier" 
                    type="text" 
                    required 
                    className="input-field pl-10 h-11 w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans" 
                    placeholder="you@example.com or 9876543210"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 font-sans">Password</label>
                  <Link href="/forgot-password" size="sm" className="text-xs font-bold text-neutral-900 dark:text-white hover:underline transition-colors underline-offset-2 font-sans">
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
                    className="input-field pl-10 h-11 w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans" 
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-primary w-full h-11 rounded-xl shadow-lg shadow-neutral-900/10 cursor-pointer font-sans"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Sign In'}
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-100 dark:border-neutral-900"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-[#09090b] px-4 text-neutral-400 font-bold tracking-widest font-sans">Or</span>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => setMode('guest')}
                className="w-full h-11 border border-neutral-900 dark:border-white text-neutral-900 dark:text-white font-bold rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all flex items-center justify-center gap-2 cursor-pointer font-sans text-sm"
              >
                Continue as Guest
              </button>

              <div className="text-center mt-8">
                <p className="text-sm text-neutral-500 font-sans">
                  New to Fyxen?{' '}
                  <Link href="/signup" className="font-bold text-neutral-900 dark:text-white hover:underline transition-colors underline-offset-4 font-sans">
                    Create an account
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <form action={handleGuest} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white font-sans">Guest Checkout</h2>
                <p className="text-sm text-neutral-500 mt-1 font-sans">Quick checkout without an account.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1 font-sans">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input 
                    name="fullName" 
                    type="text" 
                    required 
                    className="input-field pl-10 h-11 w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans" 
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1 font-sans">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input 
                    name="phone" 
                    type="tel" 
                    required 
                    className="input-field pl-10 h-11 w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans" 
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-primary w-full h-11 rounded-xl shadow-lg shadow-neutral-900/10 cursor-pointer font-sans"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                  <span className="flex items-center justify-center gap-2 font-bold font-sans">
                    Continue <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>

              <button 
                type="button" 
                onClick={() => setMode('login')}
                className="w-full text-sm font-bold text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer font-sans"
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
