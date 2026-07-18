'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { signup } from '@/app/(auth)/actions';
import { Loader2, Phone, User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

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
                src="/signup SVGS/Mobile signup-rafiki.svg"
                alt="Signup Illustration"
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
            Join the Fyxen Community
          </h2>
          <p className="text-sm text-neutral-400 max-w-sm leading-relaxed font-light font-sans">
            Create an account to gain early access to new product drops, members-only discount codes, and seamless track-order updates.
          </p>
        </div>
      </div>

      {/* Form Section - Right Side */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-16 md:py-24 bg-white dark:bg-[#09090b]">
        <div className="w-full max-w-sm space-y-5">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white font-sans">Create Account</h2>
            <p className="text-sm text-neutral-500 mt-1 font-sans">Join the Fyxen community today.</p>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl animate-in fade-in slide-in-from-top-1 font-sans">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1 font-sans">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  name="email" 
                  type="email" 
                  required 
                  className="input-field pl-10 h-11 w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans" 
                  placeholder="you@example.com"
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

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1 font-sans">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={passwords.password}
                  onChange={(e) => setPasswords({...passwords, password: e.target.value})}
                  className="input-field pl-10 pr-10 h-11 w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans" 
                  placeholder="••••••••"
                  minLength={6}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1 font-sans">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  name="confirmPassword" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                  className="input-field pl-10 h-11 w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans" 
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
              <label htmlFor="acceptPolicies" className="text-xs text-neutral-500 select-none leading-relaxed cursor-pointer font-sans">
                I have read and agree to the{' '}
                <Link href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="font-semibold text-neutral-900 dark:text-white hover:underline transition-all font-sans">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-semibold text-neutral-900 dark:text-white hover:underline transition-all font-sans">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !acceptedPolicies}
              className="btn-primary w-full h-11 rounded-xl shadow-lg shadow-neutral-900/10 mt-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer font-sans"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                <span className="flex items-center justify-center gap-2 font-bold font-sans">
                  Create Account <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-sm text-neutral-500 font-sans">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-neutral-900 dark:text-white hover:underline transition-colors underline-offset-4 font-sans">
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
