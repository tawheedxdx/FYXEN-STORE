'use client';

import { useState } from 'react';
import { updateProfile } from '@/app/(account)/account/actions';
import { Loader2, Check } from 'lucide-react';

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
  );
}
