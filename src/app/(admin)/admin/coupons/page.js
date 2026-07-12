import { getCoupons, deleteCoupon, toggleCouponStatus } from './actions';
import CouponForm from '@/components/admin/CouponForm';
import { Tag, Trash2, Power, PowerOff, Calendar, Users } from 'lucide-react';

export const metadata = {
  title: 'Manage Coupons | Admin',
};

export default async function CouponsPage() {
  const coupons = await getCoupons();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Discount Coupons</h1>
          <p className="text-primary-500 mt-1">Manage promotional codes and offers.</p>
        </div>
        <CouponForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div 
            key={coupon.id} 
            className={`bg-white dark:bg-primary-900 rounded-xl border p-6 shadow-sm relative overflow-hidden group transition-all hover:shadow-md ${
              !coupon.active ? 'opacity-70 grayscale-[0.5]' : 'border-primary-100 dark:border-white/10'
            }`}
          >
            {/* Status Ribbon */}
            <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
              coupon.active ? 'bg-green-500 text-white' : 'bg-primary-200 text-primary-700'
            }`}>
              {coupon.active ? 'Active' : 'Inactive'}
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Tag className="w-6 h-6 text-accent" />
              </div>
              <div className="flex gap-2">
                <form action={toggleCouponStatus.bind(null, coupon.id, coupon.active)}>
                  <button className={`p-2 rounded-lg transition-colors ${
                    coupon.active ? 'hover:bg-amber-50 text-amber-600' : 'hover:bg-green-50 text-green-600'
                  }`} title={coupon.active ? 'Deactivate' : 'Activate'}>
                    {coupon.active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                  </button>
                </form>
                <form action={deleteCoupon.bind(null, coupon.id)}>
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            <h3 className="text-2xl font-black tracking-tight mb-1 uppercase">{coupon.code}</h3>
            <p className="text-lg font-bold text-primary-900 dark:text-white mb-4">
              {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
            </p>

            <div className="space-y-2 text-sm text-primary-500">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Used: <strong>{coupon.used_count || 0}</strong> / {coupon.usage_limit || '∞'} times</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {coupon.ends_at ? `Expires: ${new Date(coupon.ends_at).toLocaleDateString()}` : 'No Expiry'}
                </span>
              </div>
              {coupon.min_order_amount > 0 && (
                <p className="text-xs italic mt-2">Min. order value: ₹{coupon.min_order_amount}</p>
              )}
            </div>
          </div>
        ))}

        {coupons.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-primary-100 rounded-2xl">
            <Tag className="w-12 h-12 text-primary-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-primary-900">No coupons found</h3>
            <p className="text-primary-500">Create your first discount code to start promotions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
