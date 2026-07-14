'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    <div className="w-full max-w-sm mx-auto">
      <form action={handleSubmit} className="space-y-5">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary-900 dark:text-white">Create Account</h2>
          <p className="text-sm text-primary-500 mt-1">Join the Fyxen community today.</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

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
          <label className="block text-sm font-medium text-primary-900 mb-1.5 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
            <input 
              name="email" 
              type="email" 
              required 
              className="input-field pl-10 h-11" 
              placeholder="you@example.com"
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

        <div>
          <label className="block text-sm font-medium text-primary-900 mb-1.5 ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              required 
              value={passwords.password}
              onChange={(e) => setPasswords({...passwords, password: e.target.value})}
              className="input-field pl-10 pr-10 h-11" 
              placeholder="••••••••"
              minLength={6}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-900 mb-1.5 ml-1">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
            <input 
              name="confirmPassword" 
              type={showPassword ? "text" : "password"} 
              required 
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
              className="input-field pl-10 h-11" 
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
            className="mt-0.5 w-4 h-4 rounded border-primary-300 text-accent focus:ring-accent accent-accent cursor-pointer"
            required
          />
          <label htmlFor="acceptPolicies" className="text-xs text-primary-500 select-none leading-relaxed cursor-pointer">
            I have read and agree to the{' '}
            <Link href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-900 dark:text-white hover:underline transition-all">
              Terms & Conditions
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-900 dark:text-white hover:underline transition-all">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        <button 
          type="submit" 
          disabled={isLoading || !acceptedPolicies}
          className="btn-primary w-full h-11 rounded-xl shadow-lg shadow-primary-900/10 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
            <span className="flex items-center justify-center gap-2 font-bold">
              Create Account <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </button>

        <div className="text-center pt-2">
          <p className="text-sm text-primary-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-primary-900 dark:text-white hover:underline transition-colors underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
