'use client';

import { useState } from 'react';
import { createCategory, updateCategory, deleteCategory } from '@/app/(admin)/admin/categories/actions';
import { Plus, Trash2, Loader2, FolderOpen, Check, Edit2, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function CategoryManager({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const slugify = (text) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').trim();

  // Create Form State
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState(null);

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading('add');
    setError(null);

    const formData = new FormData();
    formData.set('name', newName);
    formData.set('slug', slugify(newName));
    formData.set('description', newDescription);
    if (newImage) formData.set('image', newImage);

    const res = await createCategory(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess('Category added successfully!');
      setNewName('');
      setNewDescription('');
      setNewImage(null);
      setTimeout(() => window.location.reload(), 500);
    }
    setLoading(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(editingCategory.id);
    setError(null);

    const formData = new FormData();
    formData.set('name', editName);
    formData.set('slug', slugify(editName));
    formData.set('description', editDescription);
    formData.set('existingImageUrl', editingCategory.image_url);
    if (editImage) formData.set('image', editImage);

    const res = await updateCategory(editingCategory.id, formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess('Category updated successfully!');
      setEditingCategory(null);
      setTimeout(() => window.location.reload(), 500);
    }
    setLoading(null);
  };

  const startEdit = (cat) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditDescription(cat.description || '');
    setEditImage(null);
    setError(null);
    setSuccess(false);
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (!confirm(`Delete "${categoryName}"? Products in this category will be unassigned.`)) return;
    setLoading(categoryId);
    const res = await deleteCategory(categoryId);
    if (res?.error) {
      setError(res.error);
    } else {
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    }
    setLoading(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm">
          <h2 className="font-bold text-lg mb-6">
            {editingCategory ? `Edit: ${editingCategory.name}` : 'Add New Category'}
          </h2>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
              <Check className="w-4 h-4" /> {success}
            </div>
          )}

          <form onSubmit={editingCategory ? handleUpdate : handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name *</label>
              <input
                type="text"
                required
                value={editingCategory ? editName : newName}
                onChange={e => editingCategory ? setEditName(e.target.value) : setNewName(e.target.value)}
                className="input-field"
                placeholder="e.g. Accessories"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={editingCategory ? editDescription : newDescription}
                onChange={e => editingCategory ? setEditDescription(e.target.value) : setNewDescription(e.target.value)}
                className="input-field resize-none"
                rows={3}
                placeholder="Optional short description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cover Image</label>
              <div className="flex flex-col gap-4">
                {(editingCategory?.image_url || (editingCategory ? editImage : newImage)) && (
                  <div className="relative w-full h-32 bg-primary-50 rounded-lg overflow-hidden border border-primary-100">
                    <Image
                      src={editingCategory && !editImage ? editingCategory.image_url : URL.createObjectURL(editingCategory ? editImage : newImage)}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => editingCategory ? setEditImage(e.target.files[0]) : setNewImage(e.target.files[0])}
                  className="block w-full text-sm text-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                type="submit" 
                disabled={loading} 
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-all ${
                  editingCategory 
                    ? 'bg-primary-900 text-white hover:bg-black' 
                    : 'bg-accent text-primary-900 hover:bg-primary-900 hover:text-white'
                }`}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : editingCategory ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingCategory ? 'Update Category' : 'Add Category'}
              </button>
              
              {editingCategory && (
                <button 
                  type="button" 
                  onClick={() => setEditingCategory(null)}
                  className="p-2.5 bg-primary-50 text-primary-900 rounded-lg hover:bg-primary-100 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Existing Categories */}
      <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm">
        <h2 className="font-bold text-lg mb-6">Existing Categories ({categories.length})</h2>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-primary-200 mx-auto mb-3" />
            <p className="text-primary-500">No categories yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-primary-100">
            {categories.map(cat => (
              <div key={cat.id} className={`py-4 flex items-center justify-between gap-4 transition-all ${editingCategory?.id === cat.id ? 'bg-primary-50 -mx-6 px-6' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg overflow-hidden relative flex-shrink-0">
                    {cat.image_url ? (
                      <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary-300">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-primary-900">{cat.name}</p>
                    <p className="text-xs text-primary-400">/category/{cat.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-2 text-primary-400 hover:text-primary-900 hover:bg-white rounded-md transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={loading === cat.id}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    {loading === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
