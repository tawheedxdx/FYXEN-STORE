import Skeleton from '@/components/ui/Skeleton';

export default function StoreLoading() {
  return (
    <div className="flex flex-col w-full bg-white dark:bg-black">
      {/* 1. Hero Skeleton */}
      <div className="relative h-[85vh] min-h-[600px] w-full bg-white dark:bg-black flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-[50vh] md:h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 z-10 pt-20">
          <Skeleton className="h-4 w-32 mb-6" />
          <Skeleton className="h-16 md:h-24 w-full max-w-md mb-4" />
          <Skeleton className="h-16 md:h-24 w-3/4 max-w-sm mb-6" />
          <Skeleton className="h-4 w-full max-w-md mb-2" />
          <Skeleton className="h-4 w-5/6 max-w-sm mb-10" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>
        <div className="w-full md:w-1/2 h-[50vh] md:h-full relative">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
      </div>

      {/* 2. Nav Strip Skeleton */}
      <div className="border-b border-primary-100 dark:border-white/10 py-4">
        <div className="container-custom flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-6 w-24 shrink-0" />
          ))}
        </div>
      </div>

      {/* 3. Trust Pillars Skeleton */}
      <div className="py-14 md:py-20 border-b border-primary-100 dark:border-white/5">
        <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col items-center md:items-start gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Editorial Section Skeleton */}
      <div className="py-16 md:py-24">
        <div className="container-custom grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 md:gap-16">
          <div>
            <Skeleton className="h-3 w-20 mb-4" />
            <Skeleton className="h-12 w-48 mb-2" />
            <Skeleton className="h-12 w-40 mb-6" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-3/4 mb-8" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-[4/5] rounded-xl mb-2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
