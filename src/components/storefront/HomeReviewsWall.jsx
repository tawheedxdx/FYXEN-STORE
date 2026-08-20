import Link from 'next/link';
import { Star, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function HomeReviewsWall({ reviews = [] }) {
  // If there are no real reviews in the database yet, do not display placeholder dummy reviews
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-[#09090b] border-b border-neutral-100 dark:border-neutral-900">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-widest">
            <Star className="w-3.5 h-3.5 fill-current" /> Verified Customer Love
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
            Real Reviews From <br />
            <span className="font-light italic text-neutral-500">Verified Buyers</span>
          </h2>
          <p className="text-sm text-neutral-500 font-light">
            Read authentic feedback from customers who use FYXEN products daily across India.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => {
            const author = rev.author_name || rev.profiles?.full_name || 'Verified Buyer';
            const city = rev.author_city || 'Verified Buyer';
            const isVerified = rev.is_verified ?? true;
            const product = rev.products;

            return (
              <div
                key={rev.id}
                className="rounded-3xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 p-6 md:p-7 flex flex-col justify-between hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Stars & Verified Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 text-xs">
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
                    {isVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-light italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                {/* Author & Product */}
                <div className="pt-4 mt-6 border-t border-neutral-200/60 dark:border-neutral-800 space-y-1">
                  <p className="font-bold text-xs text-neutral-950 dark:text-white">
                    {author}
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    {city} &bull;{' '}
                    {new Date(rev.created_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  {product?.title && (
                    <div className="pt-1.5">
                      <Link
                        href={`/product/${product.slug}`}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#c6a87c] bg-[#c6a87c]/10 hover:bg-[#c6a87c]/20 px-2 py-0.5 rounded-md transition-colors"
                      >
                        {product.title} <ArrowRight className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
