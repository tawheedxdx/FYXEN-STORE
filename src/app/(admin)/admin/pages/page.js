import { createClient } from '@/lib/supabase/server';
import PageEditor from './PageEditor';
import { FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Manage Site Pages | Fyxen Admin',
};

export default async function AdminPages({ searchParams }) {
  const { slug } = await searchParams;
  const supabase = await createClient();
  
  // Fetch all editable pages
  const { data: pages } = await supabase
    .from('site_pages')
    .select('*')
    .order('title');

  const selectedSlug = slug || pages?.[0]?.slug;
  const currentPage = pages?.find(p => p.slug === selectedSlug);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-900">Site Pages</h1>
        <p className="text-primary-500 mt-1">Edit legal, policy, and FAQ content for the storefront.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Page List */}
        <aside className="lg:col-span-1 space-y-2">
          {pages?.map((page) => (
            <Link
              key={page.id}
              href={`/admin/pages?slug=${page.slug}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                selectedSlug === page.slug 
                  ? 'bg-primary-900 text-white shadow-md' 
                  : 'bg-white text-primary-600 hover:bg-primary-50 border border-primary-100'
              }`}
            >
              <FileText className={`w-4 h-4 ${selectedSlug === page.slug ? 'text-accent' : 'text-primary-400'}`} />
              <span className="text-sm font-medium">{page.title}</span>
            </Link>
          ))}
        </aside>

        {/* Main: Editor */}
        <div className="lg:col-span-3">
          {currentPage ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-primary-100">
                <h2 className="font-bold text-lg text-primary-900">{currentPage.title}</h2>
                <span className="text-xs text-primary-400">Slug: /{currentPage.slug}</span>
              </div>
              <PageEditor key={currentPage.slug} initialPage={currentPage} />
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-primary-100 shadow-sm">
              <p className="text-primary-500">Select a page from the sidebar to start editing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
