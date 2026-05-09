import Skeleton from '@/components/ui/Skeleton';

export default function ProductLoading() {
  return (
    <div className="bg-white dark:bg-black min-h-screen animate-in fade-in duration-500">
      <div className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image gallery skeleton */}
          <div className="flex flex-col gap-4">
            <Skeleton className="aspect-square w-full rounded-[2rem]" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          </div>

          {/* Product info skeleton */}
          <div className="flex flex-col gap-6">
            {/* Brand + title */}
            <div className="space-y-4 pb-6 border-b border-primary-100 dark:border-white/10">
              <Skeleton className="h-4 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-3/4 rounded-lg" />
              </div>
              <div className="flex items-center gap-4 pt-2">
                <Skeleton className="h-12 w-32 rounded-full" />
                <Skeleton className="h-12 w-32 rounded-full" />
              </div>
              <Skeleton className="h-5 w-28 rounded-full opacity-50" />
              <div className="space-y-3 pt-4">
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-5/6 rounded-full" />
                <Skeleton className="h-4 w-4/6 rounded-full" />
              </div>
            </div>

            {/* Availability + buttons */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
              <Skeleton className="h-14 w-full rounded-xl" />
              <div className="flex gap-4">
                <Skeleton className="h-14 flex-1 rounded-2xl" />
                <Skeleton className="h-14 flex-1 rounded-2xl" />
              </div>
            </div>

            {/* Trust box skeleton */}
            <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-2xl border border-primary-100 dark:border-white/10 space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-6 h-6 rounded-full shrink-0" />
                  <Skeleton className="h-4 w-48 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
