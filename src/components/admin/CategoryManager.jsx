'use client';

import { useState, useEffect } from 'react';
import { createCategory, updateCategory, deleteCategory } from '@/app/(admin)/admin/categories/actions';
import { Plus, Trash2, Loader2, FolderOpen, Check, Edit2, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CategoryManager({ initialCategories }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const slugify = (text) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').trim();

  const buildCategoryPath = (cat, allCategories) => {
    if (!cat) return '';
    const path = [cat.name];
    let current = cat;
    const visited = new Set();
    while (current.parent_id) {
      if (visited.has(current.parent_id)) break;
      visited.add(current.parent_id);
      const parent = allCategories.find(c => c.id === current.parent_id);
      if (!parent) break;
      path.unshift(parent.name);
      current = parent;
    }
    return path.join(' > ');
  };

  // Create Form State
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newParentId, setNewParentId] = useState('none');
  const [newImage, setNewImage] = useState(null);
  const [newIsActive, setNewIsActive] = useState(true);

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editParentId, setEditParentId] = useState('none');
  const [editImage, setEditImage] = useState(null);
  const [editIsActive, setEditIsActive] = useState(true);

  // Preview URLs
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!editingCategory && newImage) {
      const url = URL.createObjectURL(newImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (editingCategory && editImage) {
      const url = URL.createObjectURL(editImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (editingCategory && !editImage) {
      setPreviewUrl(editingCategory.image_url);
    } else {
      setPreviewUrl(null);
    }
  }, [newImage, editImage, editingCategory]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading('add');
    setError(null);

    const formData = new FormData();
    formData.set('name', newName);
    formData.set('slug', slugify(newName));
    formData.set('description', newDescription);
    formData.set('parentId', newParentId);
    formData.set('isActive', String(newIsActive));
    if (newImage) formData.set('image', newImage);

    try {
      const res = await createCategory(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess('Category added successfully!');
        setNewName('');
        setNewDescription('');
        setNewParentId('none');
        setNewImage(null);
        setNewIsActive(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(editingCategory.id);
    setError(null);

    const formData = new FormData();
    formData.set('name', editName);
    formData.set('slug', slugify(editName));
    formData.set('description', editDescription);
    formData.set('parentId', editParentId);
    formData.set('isActive', String(editIsActive));
    formData.set('existingImageUrl', editingCategory.image_url);
    if (editImage) formData.set('image', editImage);

    try {
      const res = await updateCategory(editingCategory.id, formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess('Category updated successfully!');
        setEditingCategory(null);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(null);
    }
  };

  const startEdit = (cat) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditDescription(cat.description || '');
    setEditParentId(cat.parent_id || 'none');
    setEditImage(null);
    setEditIsActive(cat.is_active ?? true);
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
      router.refresh();
    }
    setLoading(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-sm">
          <h2 className="font-bold text-lg mb-6 text-primary-900">
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
              <label className="block text-sm font-medium mb-2 text-primary-700">Category Name *</label>
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
              <label className="block text-sm font-medium mb-2 text-primary-700">Parent Category</label>
              <select
                value={editingCategory ? editParentId : newParentId}
                onChange={e => editingCategory ? setEditParentId(e.target.value) : setNewParentId(e.target.value)}
                className="input-field text-sm"
              >
                <option value="none">None (Top Level)</option>
                {categories
                  .filter(c => !editingCategory || c.id !== editingCategory.id)
                  .map(c => (
                    <option key={c.id} value={c.id}>
                      {buildCategoryPath(c, categories)}
                    </option>
                  ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-primary-700">Description</label>
              <textarea
                value={editingCategory ? editDescription : newDescription}
                onChange={e => editingCategory ? setEditDescription(e.target.value) : setNewDescription(e.target.value)}
                className="input-field resize-none"
                rows={3}
                placeholder="Optional short description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-primary-700">Cover Image</label>
              <div className="flex flex-col gap-4">
                {previewUrl && (
                  <div className="relative w-full h-32 bg-primary-50 rounded-lg overflow-hidden border border-primary-100 shadow-inner">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    id="category-image"
                    onChange={e => editingCategory ? setEditImage(e.target.files[0]) : setNewImage(e.target.files[0])}
                    className="hidden"
                  />
                  <label 
                    htmlFor="category-image"
                    className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-primary-200 rounded-lg text-primary-500 hover:border-primary-400 hover:bg-primary-50 transition-all cursor-pointer text-sm font-medium"
                  >
                    <ImageIcon className="w-4 h-4" />
                    {(editingCategory ? editImage : newImage) ? 'Change Image' : 'Select Category Image'}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 py-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={editingCategory ? editIsActive : newIsActive}
                  onChange={e => editingCategory ? setEditIsActive(e.target.checked) : setNewIsActive(e.target.checked)}
                />
                <div className="w-10 h-5 bg-primary-200 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></span>
              </label>
              <span className="text-sm font-medium text-primary-700">Active (visible in store)</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="submit" 
                disabled={loading} 
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-sm ${
                  editingCategory 
                    ? 'bg-primary-900 text-white hover:bg-black shadow-primary-200' 
                    : 'bg-accent text-primary-900 hover:bg-primary-900 hover:text-white shadow-accent/20'
                } disabled:opacity-50`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingCategory ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingCategory ? 'Update Category' : 'Add Category'}
              </button>
              
              {editingCategory && (
                <button 
                  type="button" 
                  onClick={() => setEditingCategory(null)}
                  className="p-3 bg-primary-50 text-primary-900 rounded-xl hover:bg-primary-100 transition-all border border-primary-100"
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
        <h2 className="font-bold text-lg mb-6 text-primary-900 flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-accent" />
          Existing Categories ({categories.length})
        </h2>

        {categories.length === 0 ? (
          <div className="text-center py-12 bg-primary-50/50 rounded-xl border border-dashed border-primary-100">
            <FolderOpen className="w-12 h-12 text-primary-200 mx-auto mb-3" />
            <p className="text-primary-500 font-medium">No categories yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map(cat => (
              <div key={cat.id} className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${editingCategory?.id === cat.id ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-primary-100 hover:border-primary-200 hover:bg-primary-50/50'}`}>
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-14 h-14 bg-primary-100 rounded-lg overflow-hidden relative flex-shrink-0 shadow-sm border border-primary-200">
                    {cat.image_url ? (
                      <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary-300">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-primary-900 truncate">{buildCategoryPath(cat, categories)}</p>
                      {!cat.is_active && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase font-bold">Hidden</span>}
                    </div>
                    <p className="text-xs text-primary-400 truncate">/category/{cat.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-2 text-primary-400 hover:text-primary-900 hover:bg-white rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={loading === cat.id}
                    className="p-2 text-primary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete"
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
