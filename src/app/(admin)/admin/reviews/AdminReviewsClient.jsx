'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Trash2, Search, Filter, ShieldCheck, MessageSquare, X, Loader2, Sparkles, CheckCircle2, Home, Check } from 'lucide-react';
import { adminCreateReview, adminDeleteReview, adminToggleFeaturedOnHome } from './actions';
import Link from 'next/link';

export default function AdminReviewsClient({ products = [], initialReviews = [], initialProductId = '' }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [selectedProductId, setSelectedProductId] = useState(initialProductId);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewFilter, setViewFilter] = useState('all'); // 'all' | 'featured'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Form State
  const [formProduct, setFormProduct] = useState(initialProductId || (products[0]?.id || ''));
  const [formAuthor, setFormAuthor] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [formVerified, setFormVerified] = useState(true);
  const [formFeaturedOnHome, setFormFeaturedOnHome] = useState(false);
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchProduct = !selectedProductId || r.product_id === selectedProductId;
      const matchFeatured = viewFilter === 'all' || (viewFilter === 'featured' && Boolean(r.featured_on_home));
      const matchSearch =
        !searchQuery ||
        (r.author_name && r.author_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.profiles?.full_name && r.profiles.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.comment && r.comment.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.products?.title && r.products.title.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchProduct && matchFeatured && matchSearch;
    });
  }, [reviews, selectedProductId, viewFilter, searchQuery]);

  // Stats calculation
  const totalCount = reviews.length;
  const featuredCount = reviews.filter((r) => Boolean(r.featured_on_home)).length;
  const verifiedCount = reviews.filter((r) => r.is_verified !== false).length;

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMsg(null);

    const formData = new FormData();
    formData.append('productId', formProduct);
    formData.append('authorName', formAuthor);
    formData.append('authorCity', formCity);
    formData.append('rating', formRating);
    formData.append('comment', formComment);
    formData.append('isVerified', formVerified ? 'true' : 'false');
    formData.append('featuredOnHome', formFeaturedOnHome ? 'true' : 'false');
    formData.append('createdAt', formDate);

    const res = await adminCreateReview(formData);

    if (res?.error) {
      setFeedbackMsg({ type: 'error', text: res.error });
    } else {
      setFeedbackMsg({ type: 'success', text: 'Review published successfully!' });
      // Optimistic update
      const targetProduct = products.find((p) => p.id === formProduct);
      const newReview = {
        id: 'temp-' + Date.now(),
        product_id: formProduct,
        author_name: formAuthor || 'Verified Customer',
        author_city: formCity || null,
        rating: formRating,
        comment: formComment,
        is_verified: formVerified,
        featured_on_home: formFeaturedOnHome,
        created_at: new Date(formDate).toISOString(),
        products: targetProduct ? { id: targetProduct.id, title: targetProduct.title, slug: targetProduct.slug } : null,
      };

      setReviews([newReview, ...reviews]);
      // Reset form
      setFormAuthor('');
      setFormCity('');
      setFormRating(5);
      setFormComment('');
      setFormFeaturedOnHome(false);
      setTimeout(() => {
        setIsModalOpen(false);
        setFeedbackMsg(null);
      }, 1000);
    }
    setIsSubmitting(false);
  };

  const handleToggleFeatured = async (reviewId, currentStatus) => {
    const nextStatus = !currentStatus;
    setTogglingId(reviewId);

    // Optimistic UI update
    setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, featured_on_home: nextStatus } : r)));

    const res = await adminToggleFeaturedOnHome(reviewId, nextStatus);
    if (res?.error) {
      alert(res.error);
      // Revert on error
      setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, featured_on_home: currentStatus } : r)));
    }
    setTogglingId(null);
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    setDeletingId(reviewId);
    const res = await adminDeleteReview(reviewId);

    if (res?.error) {
      alert(res.error);
    } else {
      setReviews(reviews.filter((r) => r.id !== reviewId));
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
            Product Reviews Management
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage real customer reviews and choose which ones to feature on the Homepage Reviews Wall.
          </p>
        </div>

        <button
          onClick={() => {
            setFeedbackMsg(null);
            setIsModalOpen(true);
          }}
          className="btn-primary px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Review to Product
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-neutral-900/60 p-6 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Store Reviews</p>
          <p className="text-3xl font-black text-neutral-950 dark:text-white mt-2">{totalCount}</p>
          <p className="text-xs text-neutral-500 mt-1">Across all catalog products</p>
        </div>

        <div className="bg-white dark:bg-neutral-900/60 p-6 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Featured on Homepage</p>
            <span className="p-1 rounded-lg bg-[#c6a87c]/10 text-[#c6a87c]">
              <Home className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-[#c6a87c] mt-2">{featuredCount}</p>
          <p className="text-xs text-neutral-500 mt-1">Shown in &apos;Real Reviews From Verified Buyers&apos;</p>
        </div>

        <div className="bg-white dark:bg-neutral-900/60 p-6 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Verified Buyer Badge</p>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{verifiedCount}</p>
          <p className="text-xs text-neutral-500 mt-1">100% genuine purchase verified</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white dark:bg-neutral-900/60 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* View Filter Switch Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setViewFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              viewFilter === 'all'
                ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            All Reviews ({totalCount})
          </button>
          <button
            onClick={() => setViewFilter('featured')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewFilter === 'featured'
                ? 'bg-[#c6a87c] text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Homepage Wall ({featuredCount})
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search author, comment, or product..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          {/* Product Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full sm:w-56 px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >
              <option value="">All Products ({products.length})</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Table / List */}
      <div className="bg-white dark:bg-neutral-900/60 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-xs">
        {filteredReviews.length === 0 ? (
          <div className="p-16 text-center">
            <MessageSquare className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">No reviews found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
              {viewFilter === 'featured'
                ? 'No reviews are currently featured on the homepage. Toggle "Feature on Home" on any review below.'
                : searchQuery || selectedProductId
                ? 'Try adjusting your search or product filter.'
                : 'Click "Add Review to Product" above to create the first review.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-950/60 border-b border-neutral-200/80 dark:border-neutral-800 text-neutral-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Product</th>
                  <th className="py-3.5 px-5">Customer / Author</th>
                  <th className="py-3.5 px-5">Rating</th>
                  <th className="py-3.5 px-5">Review Feedback</th>
                  <th className="py-3.5 px-5">Homepage Wall</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-neutral-700 dark:text-neutral-300">
                {filteredReviews.map((rev) => {
                  const author = rev.author_name || rev.profiles?.full_name || 'Verified Customer';
                  const city = rev.author_city || null;
                  const isVerified = rev.is_verified !== false;
                  const isFeatured = Boolean(rev.featured_on_home);
                  const product = rev.products;

                  return (
                    <tr key={rev.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/30 transition-colors">
                      {/* Product */}
                      <td className="py-4 px-5 max-w-[200px]">
                        {product ? (
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="font-bold text-neutral-900 dark:text-white hover:underline line-clamp-2"
                          >
                            {product.title}
                          </Link>
                        ) : (
                          <span className="text-neutral-400 font-mono text-[11px]">{rev.product_id}</span>
                        )}
                      </td>

                      {/* Author */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <p className="font-bold text-neutral-950 dark:text-white">{author}</p>
                          {city && <p className="text-[10px] text-neutral-400">{city}</p>}
                          {isVerified && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded-full">
                              <ShieldCheck className="w-2.5 h-2.5" /> Verified Buyer
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < (rev.rating || 5)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-neutral-200 dark:text-neutral-800'
                              }`}
                            />
                          ))}
                        </div>
                      </td>

                      {/* Comment */}
                      <td className="py-4 px-5 max-w-[280px]">
                        <p className="line-clamp-2 leading-relaxed text-neutral-600 dark:text-neutral-300">
                          {rev.comment}
                        </p>
                      </td>

                      {/* Homepage Wall Toggle */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(rev.id, isFeatured)}
                          disabled={togglingId === rev.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                            isFeatured
                              ? 'bg-[#c6a87c] text-white shadow-xs hover:bg-[#b09265]'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700'
                          }`}
                        >
                          {togglingId === rev.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : isFeatured ? (
                            <>
                              <Home className="w-3 h-3" /> Featured on Home
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" /> Show on Home
                            </>
                          )}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-5 whitespace-nowrap text-[11px] text-neutral-400">
                        {new Date(rev.created_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(rev.id)}
                          disabled={deletingId === rev.id}
                          className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                          title="Delete review"
                        >
                          {deletingId === rev.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Review Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0c0c0e] rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#c6a87c]" />
                  <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                    Add Product Review
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-950 dark:hover:text-white rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                {/* Select Product */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Target Product *
                  </label>
                  <select
                    required
                    value={formProduct}
                    onChange={(e) => setFormProduct(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (₹{Number(p.price).toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author Name & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Reviewer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      City / State
                    </label>
                    <input
                      type="text"
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      placeholder="e.g. Mumbai, Maharashtra"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  </div>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Rating ({formRating} Stars)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= formRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-300 dark:text-neutral-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Textarea */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Review Feedback *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    placeholder="Enter the customer review text, product experience, quality evaluation..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
                  />
                </div>

                {/* Date, Verified & Homepage Feature Toggles */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Review Date
                    </label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="verifiedCheck"
                        checked={formVerified}
                        onChange={(e) => setFormVerified(e.target.checked)}
                        className="w-4 h-4 rounded text-black accent-black cursor-pointer"
                      />
                      <label htmlFor="verifiedCheck" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer">
                        Verified Buyer Badge
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featuredHomeCheck"
                        checked={formFeaturedOnHome}
                        onChange={(e) => setFormFeaturedOnHome(e.target.checked)}
                        className="w-4 h-4 rounded text-[#c6a87c] accent-[#c6a87c] cursor-pointer"
                      />
                      <label htmlFor="featuredHomeCheck" className="text-xs font-bold text-[#c6a87c] cursor-pointer flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" /> Feature on Homepage Wall
                      </label>
                    </div>
                  </div>
                </div>

                {/* Message feedback */}
                {feedbackMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold ${
                      feedbackMsg.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    {feedbackMsg.text}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Publish Review
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
