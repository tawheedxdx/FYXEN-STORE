'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteOffer, toggleOfferStatus } from '@/app/(admin)/admin/offers/actions';
import OfferForm from '@/components/admin/OfferForm';
import { Trash2, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Sparkles, Gift } from 'lucide-react';

export default function OffersListClient({ initialOffers = [], products = [] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    setDeletingId(id);
    const res = await deleteOffer(id);
    if (res.error) {
      alert('Failed to delete: ' + res.error);
    } else {
      startTransition(() => {
        router.refresh();
      });
    }
    setDeletingId(null);
  };

  const handleToggleActive = async (id, currentStatus) => {
    setTogglingId(id);
    const res = await toggleOfferStatus(id, currentStatus);
    if (res.error) {
      alert('Failed to toggle status: ' + res.error);
    } else {
      startTransition(() => {
        router.refresh();
      });
    }
    setTogglingId(null);
  };

  const getOfferStatus = (offer) => {
    if (!offer.active) return { label: 'Inactive', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle };
    const now = new Date();
    const start = new Date(offer.starts_at);
    const end = new Date(offer.ends_at);

    if (now < start) {
      return { label: 'Scheduled', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock };
    }
    if (now > end) {
      return { label: 'Expired', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle };
    }
    return { label: 'Active Live', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 };
  };

  return (
    <div className="space-y-6">
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-primary-950 p-6 rounded-2xl border border-primary-100 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-primary-500 uppercase tracking-wider font-bold">Active Offers</p>
            <p className="text-2xl font-black text-primary-900 dark:text-white">
              {initialOffers.filter(o => getOfferStatus(o).label === 'Active Live').length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-primary-950 p-6 rounded-2xl border border-primary-100 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-primary-500 uppercase tracking-wider font-bold">Scheduled</p>
            <p className="text-2xl font-black text-primary-900 dark:text-white">
              {initialOffers.filter(o => getOfferStatus(o).label === 'Scheduled').length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-primary-950 p-6 rounded-2xl border border-primary-100 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-white/5 text-primary-500">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-primary-500 uppercase tracking-wider font-bold">Total Campaigns</p>
            <p className="text-2xl font-black text-primary-900 dark:text-white">{initialOffers.length}</p>
          </div>
        </div>
      </div>

      {initialOffers.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-primary-950 rounded-2xl border border-primary-100 dark:border-white/10 shadow-sm">
          <Gift className="w-16 h-16 text-primary-200 dark:text-white/10 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-1">No Offers or Giveaways Yet</h3>
          <p className="text-primary-500 text-sm max-w-md mx-auto mb-6">
            Create active promotions, attach them to products or make them site-wide, and display them on the storefront.
          </p>
          <OfferForm products={products} onSuccess={() => router.refresh()} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {initialOffers.map((offer) => {
            const status = getOfferStatus(offer);
            const StatusIcon = status.icon;
            const isSiteWide = !offer.eligible_product_ids || offer.eligible_product_ids.length === 0;

            return (
              <div 
                key={offer.id} 
                className="bg-white dark:bg-primary-950 rounded-2xl border border-primary-150 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Banner Image thumbnail */}
                  {offer.image_url ? (
                    <div className="h-44 w-full relative bg-primary-100 dark:bg-primary-900">
                      <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${status.color} flex items-center gap-1.5 backdrop-blur-sm bg-white/90`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 w-full bg-gradient-to-br from-primary-900 to-black p-4 flex flex-col justify-between relative">
                      <div className="flex justify-between items-start">
                        <Sparkles className="w-6 h-6 text-accent" />
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${status.color} flex items-center gap-1.5`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/50 uppercase tracking-widest font-black">Offer Banner</span>
                    </div>
                  )}

                  {/* Body Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-primary-900 dark:text-white leading-tight">
                        {offer.title}
                      </h3>
                      {offer.subtitle && (
                        <p className="text-xs font-semibold text-accent mt-1 uppercase tracking-wider">
                          {offer.subtitle}
                        </p>
                      )}
                    </div>

                    {offer.description && (
                      <p className="text-sm text-primary-600 dark:text-primary-300 line-clamp-2">
                        {offer.description}
                      </p>
                    )}

                    <div className="space-y-2 text-xs font-medium text-primary-500 border-t border-primary-50 dark:border-white/5 pt-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-400" />
                        <span>
                          Validity: {new Date(offer.starts_at).toLocaleDateString()} - {new Date(offer.ends_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-primary-400" />
                        <span>
                          {isSiteWide ? (
                            <span className="text-green-600 font-bold">Eligible: Site-wide (All Products)</span>
                          ) : (
                            <span>Eligible: {offer.eligible_product_ids.length} specific products</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-6 py-4 bg-primary-50/50 dark:bg-white/2 border-t border-primary-100 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleActive(offer.id, offer.active)}
                      disabled={togglingId === offer.id || isPending}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        offer.active
                          ? 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100'
                          : 'border-primary-200 text-primary-500 bg-white hover:bg-primary-50'
                      }`}
                    >
                      {togglingId === offer.id ? '...' : offer.active ? 'Active' : 'Draft'}
                    </button>
                    
                    <OfferForm 
                      offer={offer} 
                      products={products} 
                      onSuccess={() => router.refresh()} 
                    />
                  </div>

                  <button
                    onClick={() => handleDelete(offer.id)}
                    disabled={deletingId === offer.id}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                    title="Delete Offer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
