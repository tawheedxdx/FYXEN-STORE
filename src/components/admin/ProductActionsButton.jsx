'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteProduct, toggleProductStatus } from '@/app/(admin)/admin/products/actions';
import { Pencil, Trash2, EyeOff, Eye, Loader2 } from 'lucide-react';

export default function ProductActionsButton({ product }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${product.title}"? This cannot be undone.`)) return;
    setLoading(true);
    await deleteProduct(product.id);
    setLoading(false);
  };

  const handleToggle = async () => {
    setLoading(true);
    await toggleProductStatus(product.id, !product.is_active);
    setLoading(false);
  };

  if (loading) return <Loader2 className="w-5 h-5 animate-spin text-primary-400" />;

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/products/${product.id}/edit`}
        className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-100 rounded-md transition-colors"
        title="Edit"
      >
        <Pencil className="w-4 h-4" />
      </Link>
      <button
        onClick={handleToggle}
        className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-100 rounded-md transition-colors"
        title={product.is_active ? 'Deactivate' : 'Activate'}
      >
        {product.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
      <button
        onClick={handleDelete}
        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
