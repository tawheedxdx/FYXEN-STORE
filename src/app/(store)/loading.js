import Skeleton from '@/components/ui/Skeleton';

export default function StoreLoading() {
  return (
    <div className="flex flex-col w-full bg-white dark:bg-black overflow-hidden animate-in fade-in duration-500">
      {/* Hero skeleton */}
      <div className="relative h-screen w-full bg-primary-900/30 dark:bg-primary-800/20 flex items-center justify-center">
        <div className="text-center space-y-6 px-6 w-full max-w-4xl mx-auto flex flex-col items-center">
          <Skeleton className="h-6 w-40 rounded-full bg-white/20 dark:bg-black/20" />
          <Skeleton className="h-24 md:h-36 w-full md:w-3/4 rounded-2xl bg-white/20 dark:bg-black/20" />
          <Skeleton className="h-6 w-1/2 rounded-full bg-white/20 dark:bg-black/20" />
          <div className="flex gap-4 justify-center pt-4">
            <Skeleton className="h-14 w-40 rounded-2xl bg-white/20 dark:bg-black/20" />
            <Skeleton className="h-14 w-40 rounded-2xl bg-white/20 dark:bg-black/20" />
          </div>
        </div>
      </div>

      {/* Trust markers skeleton */}
      <div className="py-12 md:py-16 bg-white dark:bg-black -mt-10 rounded-t-[2.5rem] relative z-20">
        <div className="container-custom px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-2xl" />
                <Skeleton className="h-5 w-32 rounded-full" />
                <Skeleton className="h-3 w-48 rounded-full opacity-50" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category showcase skeleton */}
      <div className="py-20 container-custom px-6">
        <Skeleton className="h-8 w-48 rounded-full mb-12 mx-auto" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-[4/5] rounded-[2rem]" />
          ))}
        </div>
      </div>

      {/* Featured products skeleton */}
      <div className="py-20 bg-primary-50 dark:bg-primary-950/40">
        <div className="container-custom px-6">
          <Skeleton className="h-8 w-64 rounded-full mb-12 mx-auto" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-[4/5] rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded-full" />
                <Skeleton className="h-4 w-1/2 rounded-full opacity-50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
