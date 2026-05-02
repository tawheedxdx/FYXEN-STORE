export default function CategoryLoading() {
  return (
    <div className="container-custom py-12 animate-pulse">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="h-10 w-64 bg-primary-100 dark:bg-primary-800 rounded-full mx-auto mb-4" />
        <div className="h-4 w-80 bg-primary-50 dark:bg-primary-800/50 rounded-full mx-auto" />
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Sidebar skeleton */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-primary-900/20 p-6 rounded-xl border border-primary-100 dark:border-white/10 space-y-3">
            <div className="h-5 w-24 bg-primary-100 dark:bg-primary-800 rounded-full" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-primary-50 dark:bg-primary-800/50 rounded-full" style={{ width: `${50 + i * 10}%` }} />
            ))}
          </div>
        </aside>

        {/* Product grid skeleton */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
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
