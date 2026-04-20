'use client';

import { useState } from 'react';
import Link from 'next/link';
import { login } from '@/app/(auth)/actions';
import { ArrowRight, Loader2, User } from 'lucide-react';

export default function LoginForm() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData) {
    setIsLoading(true);
    setError(null);
    const res = await login(formData);
    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 w-full max-w-sm mx-auto">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="identifier" className="block text-sm font-medium text-primary-900 mb-2">Email or Phone Number</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
          <input 
            id="identifier" 
            name="identifier" 
            type="text" 
            required 
            className="input-field pl-10" 
            placeholder="Email or +91..."
          />
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className="block text-sm font-medium text-primary-900">Password</label>
          <Link href="/forgot-password" className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">
            Forgot password?
          </Link>
        </div>
        <input 
          id="password" 
          name="password" 
          type="password" 
          required 
          className="input-field" 
          placeholder="••••••••"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
      </button>

      <div className="text-center mt-6">
        <p className="text-sm text-primary-500">
          New to Fyxen?{' '}
          <Link href="/signup" className="font-semibold text-primary-900 hover:text-accent transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </form>
  );
}
