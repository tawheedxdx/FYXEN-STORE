import Skeleton from '@/components/ui/Skeleton';

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-full" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-primary-900/20 p-6 rounded-2xl border border-primary-100 dark:border-white/10 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-32 rounded-lg mb-2" />
            <Skeleton className="h-3 w-20 rounded-full" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton (Charts / Tables) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large section */}
        <div className="lg:col-span-2 bg-white dark:bg-primary-900/20 p-6 rounded-2xl border border-primary-100 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-40 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          {/* Mock Chart Area */}
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>

        {/* Small section */}
        <div className="bg-white dark:bg-primary-900/20 p-6 rounded-2xl border border-primary-100 dark:border-white/10 shadow-sm space-y-6">
          <Skeleton className="h-6 w-32 rounded-lg mb-4" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4 rounded-full" />
                  <Skeleton className="h-3 w-1/2 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Table Skeleton */}
      <div className="bg-white dark:bg-primary-900/20 p-6 rounded-2xl border border-primary-100 dark:border-white/10 shadow-sm space-y-6">
        <Skeleton className="h-6 w-48 rounded-lg mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
