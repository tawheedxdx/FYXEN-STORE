'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signup } from '@/app/(auth)/actions';
import { Loader2 } from 'lucide-react';

export default function SignupForm() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData) {
    setIsLoading(true);
    setError(null);
    const res = await signup(formData);
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
        <label htmlFor="fullName" className="block text-sm font-medium text-primary-900 mb-2">Full Name</label>
        <input 
          id="fullName" 
          name="fullName" 
          type="text" 
          required 
          className="input-field" 
          placeholder="John Doe"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-primary-900 mb-2">Email Address</label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          required 
          className="input-field" 
          placeholder="you@example.com"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-primary-900 mb-2">Password</label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          required 
          className="input-field" 
          placeholder="••••••••"
          minLength={6}
        />
        <p className="text-xs text-primary-400 mt-2">Must be at least 6 characters.</p>
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
      </button>

      <div className="text-center mt-6">
        <p className="text-sm text-primary-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary-900 hover:text-accent transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
}
