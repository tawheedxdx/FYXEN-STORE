export default function StoreLoading() {
  return (
    <div className="flex flex-col w-full bg-white dark:bg-black overflow-hidden animate-pulse">
      {/* Hero skeleton */}
      <div className="relative h-screen w-full bg-primary-900/30 dark:bg-primary-800/20 flex items-center justify-center">
        <div className="text-center space-y-6 px-6">
          <div className="h-4 w-32 bg-white/10 rounded-full mx-auto" />
          <div className="h-24 md:h-36 w-3/4 bg-white/10 rounded-xl mx-auto" />
          <div className="h-6 w-1/2 bg-white/10 rounded-full mx-auto" />
          <div className="flex gap-4 justify-center pt-4">
            <div className="h-14 w-40 bg-white/10 rounded-2xl" />
            <div className="h-14 w-40 bg-white/10 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Trust markers skeleton */}
      <div className="py-12 md:py-16 bg-white dark:bg-black -mt-10 rounded-t-[2.5rem]">
        <div className="container-custom px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-2xl" />
                <div className="h-5 w-32 bg-primary-100 dark:bg-primary-800 rounded-full" />
                <div className="h-3 w-48 bg-primary-50 dark:bg-primary-800/50 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category showcase skeleton */}
      <div className="py-20 container-custom px-6">
        <div className="h-8 w-48 bg-primary-100 dark:bg-primary-800 rounded-full mb-12 mx-auto" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-primary-100 dark:bg-primary-800 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Featured products skeleton */}
      <div className="py-20 bg-primary-50 dark:bg-primary-950/40">
        <div className="container-custom px-6">
          <div className="h-8 w-64 bg-primary-100 dark:bg-primary-800 rounded-full mb-12 mx-auto" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[4/5] bg-primary-200 dark:bg-primary-800 rounded-lg" />
                <div className="h-4 w-3/4 bg-primary-100 dark:bg-primary-800 rounded-full" />
                <div className="h-4 w-1/2 bg-primary-100 dark:bg-primary-800 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
