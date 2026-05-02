export default function OrdersLoading() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 bg-primary-100 rounded-xl shrink-0" />
        <div className="space-y-2">
          <div className="h-6 w-40 bg-primary-100 rounded-full" />
          <div className="h-3 w-56 bg-primary-50 rounded-full" />
        </div>
      </div>

      {/* Order cards skeleton */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-primary-100 shadow-sm p-5 space-y-4">
            {/* Order header */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-primary-100 rounded-full" />
                <div className="h-3 w-24 bg-primary-50 rounded-full" />
              </div>
              <div className="h-6 w-20 bg-primary-100 rounded-full" />
            </div>
            {/* Order items row */}
            <div className="flex gap-3">
              {[1, 2].map((j) => (
                <div key={j} className="w-14 h-14 bg-primary-100 rounded-lg shrink-0" />
              ))}
            </div>
            {/* Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-primary-50">
              <div className="h-4 w-24 bg-primary-100 rounded-full" />
              <div className="h-8 w-28 bg-primary-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
