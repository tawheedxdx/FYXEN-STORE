'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendOTP, verifyOTP, completeSignup } from '@/app/(auth)/actions';
import { Loader2, Phone, Hash, User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SignupForm() {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Details
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendOTP(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const res = await sendOTP(phone);
    if (res.error) {
      setError(res.error);
    } else {
      setStep(2);
    }
    setIsLoading(false);
  }

  async function handleVerifyOTP(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const res = await verifyOTP(phone, otp);
    if (res.error) {
      setError(res.error);
    } else {
      setStep(3);
    }
    setIsLoading(false);
  }

  async function handleCompleteSignup(formData) {
    setIsLoading(true);
    setError(null);
    const res = await completeSignup(formData);
    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`h-1.5 w-10 rounded-full transition-colors ${
              step >= s ? 'bg-primary-900 dark:bg-white' : 'bg-primary-100 dark:bg-white/10'
            }`} 
          />
        ))}
      </div>

      {error && (
        <div className="mb-6 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleSendOTP} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-1">Verify your Phone</h2>
            <p className="text-sm text-primary-500">We'll send you a 6-digit OTP code.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
              <input 
                type="tel" 
                required 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field pl-10" 
                placeholder="9876543210"
              />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full gap-2">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send OTP Code <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-1">Enter OTP</h2>
            <p className="text-sm text-primary-500">Sent to <span className="font-semibold text-primary-900">{phone}</span></p>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">6-Digit Code</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
              <input 
                type="text" 
                required 
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-field pl-10 tracking-[0.5em] font-mono text-center" 
                placeholder="000000"
              />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
          </button>
          <button 
            type="button" 
            onClick={() => setStep(1)} 
            className="w-full text-sm text-primary-500 hover:text-primary-900 transition-colors"
          >
            Edit Phone Number
          </button>
        </form>
      )}

      {step === 3 && (
        <form action={handleCompleteSignup} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-xl font-bold mb-1">Identity Verified!</h2>
            <p className="text-sm text-primary-500">Last step: Setup your account details.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
              <input 
                name="fullName" 
                type="text" 
                required 
                className="input-field pl-10" 
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
              <input 
                name="email" 
                type="email" 
                required 
                className="input-field pl-10" 
                placeholder="you@example.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">Create Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
              <input 
                name="password" 
                type="password" 
                required 
                className="input-field pl-10" 
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Setup'}
          </button>
        </form>
      )}

      {step < 3 && (
        <div className="text-center mt-6">
          <p className="text-sm text-primary-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary-900 hover:text-accent transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
