import { Star, CheckCircle, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Aarav Sharma',
    city: 'Mumbai, Maharashtra',
    product: 'Cooking Oil Sprayer Dispenser',
    rating: 5,
    date: '2 weeks ago',
    comment: 'The FYXEN oil sprayer has completely transformed my daily cooking routine. The mist is super fine and even, the glass build is sturdy, and it saves so much oil. Truly premium quality.',
  },
  {
    name: 'Priya Patel',
    city: 'Bengaluru, Karnataka',
    product: 'Portable Neck Fan Pro',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Fast express delivery to Bangalore! The neck fan is lightweight, whisper-quiet, and the battery easily lasts throughout my daily metro commute. Excellent build.',
  },
  {
    name: 'Rohan Mehta',
    city: 'New Delhi, Delhi',
    product: 'Inkless Bluetooth Pocket Printer',
    rating: 5,
    date: '1 month ago',
    comment: 'Works seamlessly with my iPhone. Clean packaging, genuine thermal paper rolls included, and the app connects within 2 seconds. Highly recommend FYXEN.',
  },
  {
    name: 'Ananya Deshmukh',
    city: 'Pune, Maharashtra',
    product: 'BPA-Free Motivational Water Bottle',
    rating: 5,
    date: '1 month ago',
    comment: 'Solid matte finish, zero leaks even when tossed in my gym bag, and the one-click lid lock is very satisfying. Feels twice as expensive as it actually is.',
  },
];

export default function HomeReviewsWall() {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-[#09090b] border-b border-neutral-100 dark:border-neutral-900">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-widest">
            <Star className="w-3 h-3 fill-current" /> Verified Customer Love
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
            Loved by Thousands <br />
            <span className="font-light italic text-neutral-500">Across India</span>
          </h2>
          <p className="text-sm text-neutral-500 font-light">
            Real feedback from verified buyers who use FYXEN products every single day.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="rounded-3xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 p-6 md:p-7 flex flex-col justify-between hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Stars & Verified Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 text-xs">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-light italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Author & Product */}
              <div className="pt-4 mt-6 border-t border-neutral-200/60 dark:border-neutral-800 space-y-1">
                <p className="font-bold text-xs text-neutral-950 dark:text-white">
                  {rev.name}
                </p>
                <p className="text-[10px] text-neutral-400">
                  {rev.city} • {rev.date}
                </p>
                <div className="pt-1">
                  <span className="inline-block text-[10px] font-semibold text-[#c6a87c] bg-[#c6a87c]/10 px-2 py-0.5 rounded-md">
                    {rev.product}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
