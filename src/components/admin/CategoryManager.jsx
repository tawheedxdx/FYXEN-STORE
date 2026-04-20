'use client';

import { useState } from 'react';
import { createCategory, deleteCategory } from '@/app/(admin)/admin/categories/actions';
import { Plus, Trash2, Loader2, FolderOpen, Check } from 'lucide-react';

export default function CategoryManager({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const slugify = (text) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').trim();

  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading('add');
    setError(null);

    const formData = new FormData();
    formData.set('name', newName);
    formData.set('slug', slugify(newName));
    formData.set('description', newDescription);

    const res = await createCategory(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setNewName('');
      setNewDescription('');
      setIsAdding(false);
      // Refresh would happen via revalidatePath
      setTimeout(() => window.location.reload(), 500);
    }
    setLoading(null);
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (!confirm(`Delete "${categoryName}"? Products in this category will be unassigned.`)) return;
    setLoading(categoryId);
    await deleteCategory(categoryId);
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    setLoading(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Add New Category */}
      <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg">Add New Category</h2>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
            <Check className="w-4 h-4" /> Category added!
          </div>
        )}

        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category Name *</label>
            <input
              type="text"
              required
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="input-field"
              placeholder="e.g. Accessories"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Slug (auto-generated)</label>
            <input
              type="text"
              readOnly
              value={slugify(newName)}
              className="input-field bg-primary-50 text-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder="Optional short description"
            />
          </div>
          <button type="submit" disabled={loading === 'add'} className="btn-primary w-full">
            {loading === 'add' ? (
              <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Adding...</span>
            ) : (
              <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add Category</span>
            )}
          </button>
        </form>
      </div>

      {/* Existing Categories */}
      <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm">
        <h2 className="font-bold text-lg mb-6">Existing Categories ({categories.length})</h2>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-primary-200 mx-auto mb-3" />
            <p className="text-primary-500">No categories yet. Add one to the left.</p>
          </div>
        ) : (
          <div className="divide-y divide-primary-100">
            {categories.map(cat => (
              <div key={cat.id} className="py-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-xs text-primary-400">/category/{cat.slug}</p>
                  {cat.description && <p className="text-sm text-primary-500 mt-1">{cat.description}</p>}
                </div>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  disabled={loading === cat.id}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors shrink-0"
                >
                  {loading === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
