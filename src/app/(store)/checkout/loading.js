import Skeleton from '@/components/ui/Skeleton';

export default function CheckoutLoading() {
  return (
    <div className="bg-primary-50 dark:bg-primary-900/10 min-h-screen py-8 md:py-12 animate-in fade-in duration-500">
      <div className="container-custom max-w-6xl">
        <Skeleton className="h-9 w-56 rounded-full mb-8" />

        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">
          {/* Checkout form skeleton */}
          <div className="flex-1 space-y-6">
            <div className="bg-white dark:bg-black p-6 rounded-xl border border-primary-100 dark:border-white/10 space-y-4 shadow-sm">
              <Skeleton className="h-6 w-40 rounded-full" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={`space-y-2 ${i === 3 || i === 5 ? 'sm:col-span-2' : ''}`}>
                    <Skeleton className="h-3 w-20 rounded-full opacity-50" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-black p-6 rounded-xl border border-primary-100 dark:border-white/10 space-y-4 shadow-sm">
              <Skeleton className="h-6 w-36 rounded-full" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            </div>

            <Skeleton className="h-14 w-full rounded-xl" />
          </div>

          {/* Order summary skeleton */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-white dark:bg-black p-6 rounded-xl border border-primary-200 dark:border-white/10 space-y-4 shadow-sm">
              <Skeleton className="h-6 w-36 rounded-full" />
              <div className="space-y-4 max-h-[40vh] overflow-hidden">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-16 h-20 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <Skeleton className="h-4 w-full rounded-full" />
                      <Skeleton className="h-3 w-1/3 rounded-full opacity-50" />
                      <Skeleton className="h-4 w-1/4 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 border-t border-primary-100 dark:border-white/10 pt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-4 w-20 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t border-primary-200 dark:border-white/20 pt-4">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
