'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, MessageSquare, Send, User, ShieldCheck, CheckCircle2, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { submitReview } from '@/app/(store)/product/actions';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductReviews({
  productId,
  slug,
  reviews = [],
  user = null,
  canReview = false,
  hasReviewed = false,
  userReview = null,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage({ type: 'error', text: 'Please sign in to submit a review.' });
      return;
    }

    if (!canReview) {
      setMessage({ type: 'error', text: 'Only verified buyers who have purchased this product can submit a review.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('rating', rating);
    formData.append('comment', comment);

    const res = await submitReview(formData);

    if (res?.error) {
      setMessage({ type: 'error', text: res.error });
    } else {
      setSubmittedSuccessfully(true);
      setMessage({ type: 'success', text: 'Thank you! Your verified review has been published.' });
      setComment('');
    }
    setIsSubmitting(false);
  };

  return (
    <section className="mt-16 pt-16 border-t border-neutral-200/80 dark:border-neutral-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#c6a87c]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#c6a87c]">
              Community Feedback
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
            Verified Customer Reviews
          </h2>
          {averageRating ? (
            <div className="flex items-center gap-3 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(Number(averageRating)) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {averageRating} / 5.0
              </span>
              <span className="text-xs text-neutral-400">
                &bull; Based on {reviews.length} verified review{reviews.length !== 1 ? 's' : ''}
              </span>
            </div>
          ) : (
            <p className="text-xs text-neutral-500 mt-1">
              Real reviews from verified buyers across India.
            </p>
          )}
        </div>

        {canReview && !hasReviewed && !submittedSuccessfully && (
          <button
            onClick={() => {
              document.getElementById('review-form-box')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider self-start md:self-auto cursor-pointer"
          >
            Write a Review
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Real Reviews List */}
        <div className="lg:col-span-7 space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-neutral-50/70 dark:bg-neutral-900/30 rounded-3xl p-10 text-center border border-dashed border-neutral-200 dark:border-neutral-800">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3 text-neutral-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">
                No reviews yet
              </h4>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                Be the first verified customer to share your thoughts on this product.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => {
                const author = rev.author_name || rev.profiles?.full_name || 'Verified Buyer';
                const city = rev.author_city || null;
                const isVerified = rev.is_verified ?? true;

                return (
                  <motion.div
                    key={rev.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 shadow-xs transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[#c6a87c] font-bold text-xs shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-xs text-neutral-950 dark:text-white">
                              {author}
                            </p>
                            {isVerified && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                                <ShieldCheck className="w-3 h-3" /> Verified Buyer
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-neutral-400 mt-0.5">
                            {city ? `${city} &bull; ` : ''}
                            {new Date(rev.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex text-amber-400 text-xs shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < (rev.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-neutral-200 dark:text-neutral-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-light pl-12">
                      {rev.comment}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Review Status / Verified Submission Gate */}
        <div id="review-form-box" className="lg:col-span-5">
          <div className="bg-neutral-50 dark:bg-neutral-900/60 rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800 sticky top-24 shadow-sm space-y-6">
            
            {/* Condition 1: User is NOT logged in */}
            {!user && (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-neutral-950 dark:text-white">
                    Purchased this item?
                  </h3>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed max-w-xs mx-auto">
                    Sign in to your FYXEN account to submit your verified buyer review.
                  </p>
                </div>
                <Link
                  href={`/login?redirect=/product/${slug}`}
                  className="btn-primary inline-flex items-center justify-center w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Sign In to Review
                </Link>
              </div>
            )}

            {/* Condition 2: Logged in, but has NOT purchased */}
            {user && !canReview && (
              <div className="space-y-4 py-4">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/50 text-amber-800 dark:text-amber-300">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold">Verified Buyers Only</p>
                    <p className="text-[11px] leading-relaxed opacity-90">
                      To ensure genuine authenticity, only customers who have placed an order for this product can submit a review.
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400 text-center font-light">
                  Order this item today to share your experience with other shoppers.
                </p>
              </div>
            )}

            {/* Condition 3: Logged in & already reviewed */}
            {user && (hasReviewed || submittedSuccessfully) && (
              <div className="space-y-4 py-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-neutral-950 dark:text-white">
                    Thank You for Your Feedback!
                  </h3>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    You have successfully submitted a verified review for this product.
                  </p>
                </div>
                {userReview && (
                  <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-left space-y-2">
                    <div className="flex text-amber-400 text-xs">
                      {'★'.repeat(userReview.rating || 5)}
                    </div>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 italic">
                      &ldquo;{userReview.comment}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Condition 4: Logged in, verified buyer, NOT yet reviewed */}
            {user && canReview && !hasReviewed && !submittedSuccessfully && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      Verified Buyer
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                    Share Your Experience
                  </h3>
                  <p className="text-xs text-neutral-500 font-light mt-0.5">
                    How was the quality, design, and performance?
                  </p>
                </div>

                {/* Rating selection */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Your Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-2xl transition-transform hover:scale-125 cursor-pointer"
                        aria-label={`${star} star rating`}
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-300 dark:text-neutral-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback comment */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Written Review
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked about this product, its build quality, and usability..."
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
                  />
                </div>

                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-3.5 rounded-xl text-xs font-semibold ${
                        message.type === 'success'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {message.text}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 border-2 border-white dark:border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Submit Verified Review <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
