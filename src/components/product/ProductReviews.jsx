'use client';

import { useState } from 'react';
import { Star, MessageSquare, Send, User } from 'lucide-react';
import { submitReview } from '@/app/(store)/product/actions';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductReviews({ productId, reviews = [], user }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage({ type: 'error', text: 'Please log in to submit a review.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('rating', rating);
    formData.append('comment', comment);

    const res = await submitReview(formData);

    if (res.error) {
      setMessage({ type: 'error', text: res.error });
    } else {
      setMessage({ type: 'success', text: 'Review submitted successfully!' });
      setComment('');
      setRating(5);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mt-16 pt-16 border-t border-primary-100 dark:border-white/10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h2 className="text-3xl font-bold text-primary-900 dark:text-white flex items-center gap-3">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="text-primary-500 font-medium">
              {averageRating} out of 5 based on {reviews.length} reviews
            </span>
          </div>
        </div>

        {user && (
          <button 
            onClick={() => document.getElementById('review-form').scrollIntoView({ behavior: 'smooth' })}
            className="btn-outline px-6 py-2.5 rounded-xl text-sm font-bold"
          >
            Write a Review
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-8">
          {reviews.length === 0 ? (
            <div className="bg-primary-50 dark:bg-white/5 rounded-3xl p-12 text-center">
              <MessageSquare className="w-12 h-12 text-primary-300 mx-auto mb-4" />
              <p className="text-primary-500">No reviews yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={review.id} 
                  className="bg-white dark:bg-black/40 border border-primary-50 dark:border-white/5 rounded-3xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-white/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="font-bold text-primary-900 dark:text-white">{review.profiles?.full_name || 'Verified Buyer'}</p>
                        <p className="text-xs text-primary-400">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-primary-700 dark:text-primary-300 leading-relaxed">
                    {review.comment}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Review Form */}
        <div id="review-form" className="lg:col-span-1">
          <div className="bg-primary-900 text-white rounded-3xl p-8 sticky top-24 shadow-2xl shadow-primary-900/20">
            <h3 className="text-xl font-bold mb-6">Leave a Review</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-primary-300 mb-3">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125"
                    >
                      <Star className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-white/20'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-primary-300 mb-3">Your Feedback</label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 min-h-[150px] resize-none"
                  placeholder="Tell us what you liked or didn't like..."
                />
              </div>

              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 rounded-xl text-xs font-medium ${
                      message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-primary-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-50 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-primary-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Submit Review <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
