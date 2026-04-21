'use client';

import { useState } from 'react';
import { submitInquiry } from './actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const result = await submitInquiry(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center"
      >
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-green-900 dark:text-green-400 mb-2">Message Sent!</h3>
        <p className="text-green-700 dark:text-green-500">
          Thank you for reaching out. We've received your inquiry and will get back to you shortly.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm font-medium text-green-700 dark:text-green-400 underline underline-offset-4 hover:text-green-900"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <input 
          name="name"
          type="text" 
          required
          className="input-field" 
          placeholder="Your Name" 
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Email Address</label>
        <input 
          name="email"
          type="email" 
          required
          className="input-field" 
          placeholder="your@email.com" 
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Message</label>
        <textarea 
          name="message"
          required
          className="input-field h-32 resize-none" 
          placeholder="How can we help?"
          disabled={loading}
        ></textarea>
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="btn-primary w-full gap-2"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
        ) : (
          <><Send className="w-4 h-4" /> Send Message</>
        )}
      </button>
    </form>
  );
}
