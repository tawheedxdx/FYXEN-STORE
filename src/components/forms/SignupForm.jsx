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

  async function handleSubmit(formData) {
    setIsLoading(true);
    setError(null);

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

        <button 
          type="submit" 
          disabled={isLoading}
          className="btn-primary w-full h-11 rounded-xl shadow-lg shadow-primary-900/10 mt-2"
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
            <Link href="/login" className="font-bold text-primary-900 hover:text-accent transition-colors underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
