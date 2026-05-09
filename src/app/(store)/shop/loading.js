import Skeleton from '@/components/ui/Skeleton';

export default function ShopLoading() {
  return (
    <div className="container-custom py-8 md:py-12 animate-in fade-in duration-500">
      {/* Page header */}
      <div className="mb-8 text-center">
        <Skeleton className="h-10 w-64 rounded-full mx-auto mb-3" />
        <Skeleton className="h-4 w-96 max-w-full rounded-full mx-auto opacity-50" />
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Filter sidebar skeleton */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-primary-900/20 p-6 rounded-xl border border-primary-100 dark:border-white/10 space-y-4 shadow-sm">
            <Skeleton className="h-5 w-24 rounded-full" />
            <div className="space-y-3 pt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 rounded-full" style={{ width: `${60 + i * 8}%` }} />
              ))}
            </div>
            <div className="pt-4 border-t border-primary-100 dark:border-white/10 mt-4">
              <Skeleton className="h-5 w-24 rounded-full mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 rounded-lg" />
                <Skeleton className="h-10 flex-1 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Product grid skeleton */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-[4/5] rounded-xl" />
              <Skeleton className="h-3 w-1/3 rounded-full opacity-50" />
              <Skeleton className="h-4 w-3/4 rounded-full" />
              <Skeleton className="h-4 w-1/3 rounded-full opacity-80" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
