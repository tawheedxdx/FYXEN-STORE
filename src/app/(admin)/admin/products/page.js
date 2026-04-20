import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Pencil, Eye, EyeOff, Trash2, Package } from 'lucide-react';
import ProductActionsButton from '@/components/admin/ProductActionsButton';

export const metadata = { title: 'Products | Admin' };

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name), product_images(image_url, sort_order)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Products</h1>
          <p className="text-primary-500 text-sm mt-1">{products?.length || 0} total products</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 h-11">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-xl border border-primary-100">
          <Package className="w-16 h-16 text-primary-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Products Yet</h2>
          <p className="text-primary-500 mb-6">Add your first product to get started.</p>
          <Link href="/admin/products/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add First Product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-primary-100 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-50 text-primary-600 text-sm">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {products.map(product => {
                const mainImage = product.product_images?.sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url;
                return (
                  <tr key={product.id} className="hover:bg-primary-50/50 transition-colors text-sm">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-primary-100 shrink-0 border border-primary-200">
                          {mainImage ? (
                            <img src={mainImage} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary-300 text-xs">No img</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-primary-900">{product.title}</p>
                          <p className="text-primary-400 text-xs">{product.sku || 'No SKU'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-primary-600">{product.categories?.name || '—'}</td>
                    <td className="p-4">
                      <span className="font-semibold">₹{product.price}</span>
                      {product.compare_at_price && (
                        <span className="ml-2 text-primary-400 line-through text-xs">₹{product.compare_at_price}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`font-medium ${product.stock_quantity < 10 ? 'text-red-500' : 'text-green-600'}`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4">
                      <ProductActionsButton product={product} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
