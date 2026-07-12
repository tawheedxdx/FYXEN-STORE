import Skeleton from '@/components/ui/Skeleton';

export default function AccountLoading() {
  return (
    <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-500">
      {/* Sidebar skeleton */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white dark:bg-primary-900/20 rounded-xl shadow-sm border border-primary-100 dark:border-white/10 overflow-hidden">
          <div className="p-6 border-b border-primary-100 dark:border-white/10">
            <Skeleton className="h-5 w-28 rounded-full" />
          </div>
          <div className="p-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
            <div className="mt-4 pt-4 border-t border-primary-100 dark:border-white/10">
              <Skeleton className="h-10 rounded-lg bg-red-100 dark:bg-red-900/20" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content skeleton */}
      <div className="flex-1 bg-white dark:bg-primary-900/20 rounded-xl shadow-sm border border-primary-100 dark:border-white/10 p-6 md:p-8 space-y-6">
        <Skeleton className="h-7 w-40 rounded-full" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-24 rounded-full opacity-50" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <Skeleton className="h-11 w-32 rounded-lg" />
      </div>
    </div>
  );
}
