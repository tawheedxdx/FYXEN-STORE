export default function ProductLoading() {
  return (
    <div className="bg-white dark:bg-black min-h-screen animate-pulse">
      <div className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image gallery skeleton */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square w-full bg-primary-100 dark:bg-primary-800 rounded-xl" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-primary-100 dark:bg-primary-800 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Product info skeleton */}
          <div className="flex flex-col gap-6">
            {/* Brand + title */}
            <div className="space-y-3 pb-6 border-b border-primary-100 dark:border-white/10">
              <div className="h-3 w-20 bg-primary-100 dark:bg-primary-800 rounded-full" />
              <div className="h-8 w-full bg-primary-100 dark:bg-primary-800 rounded-lg" />
              <div className="h-8 w-3/4 bg-primary-100 dark:bg-primary-800 rounded-lg" />
              <div className="flex items-center gap-4 pt-2">
                <div className="h-10 w-24 bg-primary-50 dark:bg-primary-800/50 rounded-full" />
                <div className="h-10 w-32 bg-primary-100 dark:bg-primary-800 rounded-full" />
              </div>
              <div className="h-4 w-28 bg-primary-50 dark:bg-primary-800/50 rounded-full" />
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full bg-primary-50 dark:bg-primary-800/50 rounded-full" />
                <div className="h-4 w-5/6 bg-primary-50 dark:bg-primary-800/50 rounded-full" />
                <div className="h-4 w-4/6 bg-primary-50 dark:bg-primary-800/50 rounded-full" />
              </div>
            </div>

            {/* Availability + buttons */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="h-5 w-24 bg-primary-100 dark:bg-primary-800 rounded-full" />
                <div className="h-6 w-20 bg-green-100 dark:bg-green-900/20 rounded-full" />
              </div>
              <div className="h-12 w-full bg-primary-100 dark:bg-primary-800 rounded-xl" />
              <div className="flex gap-3">
                <div className="h-14 flex-1 bg-primary-100 dark:bg-primary-800 rounded-xl" />
                <div className="h-14 flex-1 bg-primary-50 dark:bg-primary-800/50 rounded-xl" />
              </div>
            </div>

            {/* Trust box skeleton */}
            <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-xl border border-primary-100 dark:border-white/10 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-5 h-5 bg-primary-200 dark:bg-primary-700 rounded-full shrink-0" />
                  <div className="h-4 w-40 bg-primary-100 dark:bg-primary-700 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
