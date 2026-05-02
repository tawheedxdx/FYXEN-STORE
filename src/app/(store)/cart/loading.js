export default function CartLoading() {
  return (
    <div className="container-custom py-12 animate-pulse">
      <div className="h-9 w-48 bg-primary-100 dark:bg-primary-800 rounded-full mb-8" />

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart items skeleton */}
        <div className="flex-1 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 bg-white dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-white/10">
              <div className="w-24 h-28 bg-primary-100 dark:bg-primary-800 rounded-lg shrink-0" />
              <div className="flex-1 space-y-3 py-1">
                <div className="h-4 w-3/4 bg-primary-100 dark:bg-primary-800 rounded-full" />
                <div className="h-3 w-1/3 bg-primary-50 dark:bg-primary-800/50 rounded-full" />
                <div className="h-5 w-20 bg-primary-100 dark:bg-primary-800 rounded-full" />
                <div className="flex items-center gap-3 pt-1">
                  <div className="h-8 w-24 bg-primary-50 dark:bg-primary-800/50 rounded-lg" />
                  <div className="h-8 w-8 bg-red-50 dark:bg-red-900/10 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary skeleton */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-xl border border-primary-100 dark:border-white/10 space-y-4">
            <div className="h-6 w-36 bg-primary-100 dark:bg-primary-800 rounded-full" />
            <div className="space-y-3 pb-6 border-b border-primary-200 dark:border-white/10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-20 bg-primary-100 dark:bg-primary-800 rounded-full" />
                  <div className="h-4 w-16 bg-primary-100 dark:bg-primary-800 rounded-full" />
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <div className="h-5 w-28 bg-primary-200 dark:bg-primary-700 rounded-full" />
              <div className="h-5 w-20 bg-primary-200 dark:bg-primary-700 rounded-full" />
            </div>
            <div className="h-12 w-full bg-primary-200 dark:bg-primary-700 rounded-xl mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
