'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signup } from '@/app/(auth)/actions';
import { Loader2, Phone, User, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SignupForm() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  async function handleSubmit(formData) {
    setIsLoading(true);
    setError(null);

    const acceptPolicies = formData.get('acceptPolicies') === 'on' || formData.get('acceptPolicies') === 'true';
    if (!acceptPolicies) {
      setError('Please accept the Terms & Conditions and Privacy Policy before creating your account.');
      setIsLoading(false);
      return;
    }

    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    const res = await signup(formData);
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
        
        {/* Brand Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-block">
            <img src="/logo.png" alt="FYXEN" className="h-10 w-auto object-contain brightness-0 invert" />
          </Link>
        </div>

        {/* Center: Luxury Editorial Badge & Text */}
        <div className="relative z-10 my-auto py-8 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#c6a87c] text-xs font-bold uppercase tracking-widest border border-white/10">
              <Sparkles className="w-3.5 h-3.5" /> Join The Club
            </div>

            <h2 className="text-3xl xl:text-4xl font-black tracking-tight text-white leading-tight">
              Unlock Exclusive VIP Privileges.
            </h2>

            <p className="text-sm text-neutral-400 leading-relaxed font-light">
              Become a FYXEN member to receive secret discount codes, 24-hour priority dispatch, and early access to limited edition drops.
            </p>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-neutral-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant 10% discount on your first order</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Saved addresses and 1-click checkout</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Exclusive member-only seasonal drops</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-neutral-500">
          <ShieldCheck className="w-4 h-4 text-[#c6a87c]" />
          <span>Strict Data Privacy &bull; Zero Spam Guarantee</span>
        </div>
      </div>

      {/* Form Section - Right Side */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-16 md:py-24 bg-white dark:bg-[#09090b]">
        <div className="w-full max-w-sm space-y-5">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
              Create Account
            </h2>
            <p className="text-xs text-neutral-500 mt-1.5 font-light">
              Join the FYXEN community in seconds.
            </p>
          </div>

          {error && (
            <div className="p-3.5 text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-xl animate-in fade-in slide-in-from-top-1 font-semibold">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
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
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  name="email" 
                  type="email" 
                  required 
                  className="pl-10 h-11 w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans" 
                  placeholder="you@example.com"
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={passwords.password}
                  onChange={(e) => setPasswords({...passwords, password: e.target.value})}
                  className="pl-10 pr-10 h-11 w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans" 
                  placeholder="••••••••"
                  minLength={6}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  name="confirmPassword" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                  className="pl-10 h-11 w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans" 
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex items-start gap-2.5 px-1 py-1">
              <input
                id="acceptPolicies"
                name="acceptPolicies"
                type="checkbox"
                checked={acceptedPolicies}
                onChange={(e) => setAcceptedPolicies(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-black focus:ring-black accent-black cursor-pointer"
                required
              />
              <label htmlFor="acceptPolicies" className="text-[11px] text-neutral-500 select-none leading-relaxed cursor-pointer">
                I have read and agree to the{' '}
                <Link href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="font-bold text-neutral-900 dark:text-white hover:underline transition-all">
                  Terms &amp; Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-bold text-neutral-900 dark:text-white hover:underline transition-all">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !acceptedPolicies}
              className="btn-primary w-full h-11 rounded-xl shadow-lg shadow-neutral-900/10 mt-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer font-bold text-xs uppercase tracking-wider"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (
                <span className="flex items-center justify-center gap-2 font-bold">
                  Create Account <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-neutral-500 font-light">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-neutral-900 dark:text-white hover:underline transition-colors underline-offset-4">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
