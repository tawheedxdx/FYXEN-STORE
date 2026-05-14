import Skeleton from '@/components/ui/Skeleton';

export default function CheckoutLoading() {
  return (
    <div className="container-custom py-12">
      <Skeleton className="h-10 w-48 mb-8" />
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Checkout Form Skeleton */}
        <div className="flex-1 space-y-8">
          <div className="bg-primary-50 dark:bg-primary-900/10 p-6 rounded-2xl border border-primary-100 dark:border-white/10">
            <Skeleton className="h-6 w-40 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-11 w-full rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-11 w-full rounded-lg" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
          <div className="bg-primary-50 dark:bg-primary-900/10 p-6 rounded-2xl border border-primary-100 dark:border-white/10">
            <Skeleton className="h-6 w-32 mb-6" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        </div>
        
        {/* Order Summary Skeleton */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-2xl border border-primary-100 dark:border-white/10 sticky top-24">
            <Skeleton className="h-6 w-40 mb-6" />
            
            <div className="space-y-4 mb-6 border-b border-primary-200 dark:border-white/10 pb-6">
              {[1, 2].map(i => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-8 border-t border-primary-200 dark:border-white/10 pt-4">
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
