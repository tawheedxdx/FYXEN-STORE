export default function AccountLoading() {
  return (
    <div className="flex flex-col md:flex-row gap-8 animate-pulse">
      {/* Sidebar skeleton */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-primary-100 overflow-hidden">
          <div className="p-6 border-b border-primary-100">
            <div className="h-5 w-28 bg-primary-100 rounded-full" />
          </div>
          <div className="p-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-primary-50 rounded-lg" />
            ))}
            <div className="mt-4 pt-4 border-t border-primary-100">
              <div className="h-10 bg-red-50 rounded-lg" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content skeleton */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-primary-100 p-6 md:p-8 space-y-6">
        <div className="h-7 w-40 bg-primary-100 rounded-full" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 bg-primary-50 rounded-full" />
              <div className="h-10 w-full bg-primary-50 rounded-lg" />
            </div>
          ))}
        </div>
        <div className="h-11 w-32 bg-primary-100 rounded-lg" />
      </div>
    </div>
  );
}
