import Skeleton from '@/components/ui/Skeleton';

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Page Header Skeleton */}
      <div className="border-b border-primary-100 dark:border-white/5 py-12 md:py-16">
        <div className="container-custom">
          <Skeleton className="h-3 w-24 mb-4" />
          <Skeleton className="h-14 md:h-20 w-3/4 max-w-lg mb-4" />
          <Skeleton className="h-4 w-full max-w-md mb-2" />
          <Skeleton className="h-4 w-32 mt-4" />
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-10 w-full">
          {/* Sidebar Skeleton */}
          <div className="w-full md:w-56 shrink-0">
            <Skeleton className="h-4 w-20 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-4 w-full max-w-[150px]" />
              ))}
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton className="aspect-[4/5] rounded-xl mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full mt-2 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
