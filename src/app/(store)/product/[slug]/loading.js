import Skeleton from '@/components/ui/Skeleton';

export default function ProductLoading() {
  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <div className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Product Images Skeleton */}
          <div className="space-y-4">
            <Skeleton className="w-full aspect-square rounded-2xl" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>

          {/* Right: Product Info Skeleton */}
          <div className="flex flex-col pt-4">
            <div className="mb-6 border-b border-primary-100 dark:border-white/10 pb-6">
              <Skeleton className="h-4 w-24 mb-3" />
              <div className="flex justify-between items-start gap-4 mb-4">
                <Skeleton className="h-10 w-3/4 max-w-md" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>

              <Skeleton className="h-4 w-40 mb-6" />
              
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>

            <div className="mb-8 space-y-6">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              
              <Skeleton className="h-20 w-full rounded-xl" />

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Skeleton className="h-12 flex-1 rounded-xl" />
                <Skeleton className="h-12 flex-1 rounded-xl" />
              </div>
            </div>

            {/* Trust Highlights Skeleton */}
            <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-2xl border border-primary-100 dark:border-white/10 space-y-4 mt-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
