export default function AddressesLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-7 w-44 bg-primary-100 rounded-full" />
        <div className="h-10 w-36 bg-primary-100 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="border border-primary-100 rounded-lg p-6 space-y-3">
            <div className="h-5 w-36 bg-primary-100 rounded-full" />
            <div className="h-4 w-28 bg-primary-50 rounded-full" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-primary-50 rounded-full" />
              <div className="h-3 w-3/4 bg-primary-50 rounded-full" />
              <div className="h-3 w-1/2 bg-primary-50 rounded-full" />
            </div>
            <div className="pt-4 border-t border-primary-100 flex gap-4">
              <div className="h-4 w-10 bg-primary-100 rounded-full" />
              <div className="h-4 w-14 bg-red-50 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
