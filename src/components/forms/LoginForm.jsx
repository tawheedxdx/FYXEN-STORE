'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    <div className="w-full max-w-sm mx-auto">
      {error && (
        <div className="mb-6 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

      {mode === 'login' ? (
        <form action={handleLogin} className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white">Welcome Back</h2>
            <p className="text-sm text-primary-500 mt-1">Sign in to your Fyxen account.</p>
          </div>

          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-primary-900 mb-1.5 ml-1">Email or Phone Number</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
              <input 
                id="identifier" 
                name="identifier" 
                type="text" 
                required 
                className="input-field pl-10 h-11" 
                placeholder="you@example.com or 9876543210"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1.5 ml-1">
              <label htmlFor="password" className="block text-sm font-medium text-primary-900">Password</label>
              <Link href="/forgot-password" size="sm" className="text-xs font-bold text-accent hover:text-accent-hover transition-colors underline underline-offset-2">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="input-field pl-10 h-11" 
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full h-11 rounded-xl shadow-lg shadow-primary-900/10"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Sign In'}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-primary-100"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-primary-400 font-bold tracking-widest">Or</span>
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => setMode('guest')}
            className="w-full h-11 border-2 border-primary-900 text-primary-900 font-bold rounded-xl hover:bg-primary-50 transition-all flex items-center justify-center gap-2"
          >
            Continue as Guest
          </button>

          <div className="text-center mt-8">
            <p className="text-sm text-primary-500">
              New to Fyxen?{' '}
              <Link href="/signup" className="font-bold text-primary-900 hover:text-accent transition-colors underline underline-offset-4">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      ) : (
        <form action={handleGuest} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white">Guest Checkout</h2>
            <p className="text-sm text-primary-500 mt-1">Quick checkout without an account.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-900 mb-1.5 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
              <input 
                name="fullName" 
                type="text" 
                required 
                className="input-field pl-10 h-11" 
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-900 mb-1.5 ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
              <input 
                name="phone" 
                type="tel" 
                required 
                className="input-field pl-10 h-11" 
                placeholder="9876543210"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full h-11 rounded-xl shadow-lg shadow-primary-900/10"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
              <span className="flex items-center justify-center gap-2 font-bold">
                Continue <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>

          <button 
            type="button" 
            onClick={() => setMode('login')}
            className="w-full text-sm font-bold text-primary-400 hover:text-primary-900 transition-colors"
          >
            Back to Sign In
          </button>
        </form>
      )}
    </div>
  );
}
