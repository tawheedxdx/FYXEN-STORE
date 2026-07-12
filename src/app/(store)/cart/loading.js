import Skeleton from '@/components/ui/Skeleton';

export default function CartLoading() {
  return (
    <div className="container-custom py-12">
      <Skeleton className="h-10 w-48 mb-8" />
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items Skeleton */}
        <div className="flex-1 space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4 p-4 border border-primary-100 dark:border-white/10 rounded-xl">
              <Skeleton className="w-24 h-24 rounded-lg shrink-0" />
              <div className="flex-1 space-y-3 py-2">
                <Skeleton className="h-5 w-3/4 max-w-sm" />
                <Skeleton className="h-4 w-1/4" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary Skeleton */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-xl border border-primary-100 dark:border-white/10">
            <Skeleton className="h-6 w-32 mb-6" />
            
            <div className="space-y-4 mb-6 border-b border-primary-200 dark:border-white/10 pb-6">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
            
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
