import { createClient } from '@/lib/supabase/server';
import PromoBannerForm from '@/components/admin/PromoBannerForm';
import { Megaphone, Layout, Trash2, Edit, AlertCircle } from 'lucide-react';
import { deletePromoBanner } from './actions';

export const metadata = {
  title: 'Manage Promo Banners | Fyxen Admin',
};

export default async function PromoBannerAdminPage() {
  const supabase = await createClient();
  const { data: banners } = await supabase
    .from('promo_banners')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 flex items-center gap-3">
            <Layout className="w-8 h-8 text-accent" /> Promo Banners
          </h1>
          <p className="text-primary-500 mt-1">Manage the high-impact promotional sections on your home page.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-primary-900 uppercase tracking-tight">Create New Banner</h2>
          <PromoBannerForm />
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-primary-900 uppercase tracking-tight">Existing Banners ({banners?.length || 0})</h2>
          <div className="space-y-4">
            {banners?.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-primary-200 text-center">
                <AlertCircle className="w-12 h-12 text-primary-200 mx-auto mb-4" />
                <p className="text-primary-500 font-medium">No banners found. Create your first one!</p>
              </div>
            ) : (
              banners.map((b) => (
                <div key={b.id} className="bg-white border border-primary-100 rounded-2xl overflow-hidden shadow-sm group">
                  <div className="p-4 border-b border-primary-50 flex justify-between items-center bg-primary-50/30">
                    <div className="flex items-center gap-2">
                      {b.is_active ? (
                        <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-100">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-400 text-[10px] font-black rounded-full uppercase tracking-widest">
                          Inactive
                        </span>
                      )}
                    </div>
                    <form action={async () => {
                      'use server';
                      await deletePromoBanner(b.id);
                    }}>
                      <button className="p-1.5 text-primary-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                  <div className="p-6">
                    <div 
                      className="p-4 rounded-xl mb-4 border border-primary-100"
                      style={{ backgroundColor: b.bg_color, color: b.text_color }}
                    >
                      <p className="text-[10px] font-bold uppercase opacity-80 mb-1">{b.badge_text}</p>
                      <p className="font-black text-lg leading-tight mb-1">{b.title}</p>
                      <p className="text-xs opacity-70 line-clamp-1">{b.subtitle}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-primary-50">
                      <PromoBannerForm banner={b} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
