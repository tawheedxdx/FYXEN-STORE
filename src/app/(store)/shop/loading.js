export default function ShopLoading() {
  return (
    <div className="container-custom py-8 md:py-12 animate-pulse">
      {/* Page header */}
      <div className="mb-8 text-center">
        <div className="h-10 w-64 bg-primary-100 dark:bg-primary-800 rounded-full mx-auto mb-3" />
        <div className="h-4 w-96 bg-primary-50 dark:bg-primary-800/50 rounded-full mx-auto" />
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Filter sidebar skeleton */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-primary-900/20 p-6 rounded-xl border border-primary-100 dark:border-white/10 space-y-4">
            <div className="h-5 w-24 bg-primary-100 dark:bg-primary-800 rounded-full" />
            <div className="space-y-3 pt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-primary-50 dark:bg-primary-800/50 rounded-full" style={{ width: `${60 + i * 8}%` }} />
              ))}
            </div>
            <div className="pt-4 border-t border-primary-100 dark:border-white/10">
              <div className="h-5 w-24 bg-primary-100 dark:bg-primary-800 rounded-full mb-3" />
              <div className="flex gap-2">
                <div className="h-10 flex-1 bg-primary-50 dark:bg-primary-800/50 rounded-lg" />
                <div className="h-10 flex-1 bg-primary-50 dark:bg-primary-800/50 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Product grid skeleton */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-[4/5] bg-primary-100 dark:bg-primary-800 rounded-lg" />
              <div className="h-3 w-1/3 bg-primary-50 dark:bg-primary-800/50 rounded-full" />
              <div className="h-4 w-3/4 bg-primary-100 dark:bg-primary-800 rounded-full" />
              <div className="h-4 w-1/3 bg-primary-100 dark:bg-primary-800 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
