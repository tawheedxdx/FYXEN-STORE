'use client';

import { useState } from 'react';
import { updateProfile } from '@/app/(account)/account/actions';
import { Loader2, Check, Star } from 'lucide-react';

export default function ProfileForm({ profile, user }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    const res = await updateProfile(formData);
    
    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      {/* Loyalty Points Card */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-800 text-white rounded-3xl p-6 shadow-xl shadow-primary-900/20 max-w-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-accent">
              <Star className="w-8 h-8 fill-current" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary-200 uppercase tracking-widest">Available Points</p>
              <h2 className="text-4xl font-black">{profile?.loyalty_points || 0}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-primary-300 uppercase tracking-widest mb-1">Estimated Value</p>
            <p className="text-xl font-bold text-accent">₹{(profile?.loyalty_points * 0.5 || 0).toFixed(1)}</p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-primary-200 leading-relaxed italic">
            "Shop online to earn 10 points for every ₹100 spent. Redeem them at checkout for instant discounts!"
          </p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-6 max-w-xl">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
          <Check className="w-4 h-4" /> Profile updated successfully!
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-primary-900 mb-2">Full Name</label>
          <input 
            id="fullName" 
            name="fullName" 
            type="text" 
            defaultValue={profile?.full_name || ''}
            required 
            className="input-field" 
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-primary-900 mb-2">Email Address</label>
          <input 
            id="email" 
            type="email" 
            value={user?.email || ''}
            disabled 
            className="input-field bg-gray-50 text-gray-500 cursor-not-allowed" 
          />
          <p className="text-xs text-primary-400 mt-1">Email cannot be changed.</p>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-primary-900 mb-2">Phone Number</label>
          <input 
            id="phone" 
            name="phone" 
            type="tel" 
            defaultValue={profile?.phone || ''}
            className="input-field" 
            placeholder="+91 98765 43210"
          />
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading}
        className="btn-primary"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
        Save Changes
      </button>
    </form>
  </div>
);
}
