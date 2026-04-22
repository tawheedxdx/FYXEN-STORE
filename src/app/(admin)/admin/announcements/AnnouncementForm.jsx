'use client';

import { useState } from 'react';
import { Save, Trash2, Calendar, Link as LinkIcon, Palette, Loader2 } from 'lucide-react';
import { upsertAnnouncement, deleteAnnouncement } from './actions';
import { useRouter } from 'next/navigation';

export default function AnnouncementForm({ announcement = null }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.target);
    const res = await upsertAnnouncement(formData);
    setIsPending(false);
    
    if (res.success) {
      router.refresh();
      if (!announcement) e.target.reset();
    } else {
      alert(res.error);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    setIsPending(true);
    const res = await deleteAnnouncement(announcement.id);
    setIsPending(false);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-primary-100 shadow-sm space-y-6">
      {announcement && <input type="hidden" name="id" value={announcement.id} />}
      
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg text-primary-900">
          {announcement ? 'Edit Announcement' : 'Create New Announcement'}
        </h3>
        {announcement && (
          <button 
            type="button" 
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Banner Content (Text)</label>
          <textarea 
            name="content" 
            required 
            defaultValue={announcement?.content || ''}
            className="input-field min-h-[80px]"
            placeholder="E.g. Free shipping on orders over ₹999!"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1 flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary-400" /> Background Color
            </label>
            <div className="flex gap-2">
              <input 
                type="color" 
                name="bg_color" 
                defaultValue={announcement?.bg_color || '#09090b'}
                className="h-10 w-12 rounded border border-primary-100 p-1 bg-white"
              />
              <input 
                type="text" 
                defaultValue={announcement?.bg_color || '#09090b'}
                className="input-field py-2 text-sm"
                onChange={(e) => {
                  const picker = e.target.previousSibling;
                  if (picker) picker.value = e.target.value;
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1 flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary-400" /> Text Color
            </label>
            <div className="flex gap-2">
              <input 
                type="color" 
                name="text_color" 
                defaultValue={announcement?.text_color || '#ffffff'}
                className="h-10 w-12 rounded border border-primary-100 p-1 bg-white"
              />
              <input 
                type="text" 
                defaultValue={announcement?.text_color || '#ffffff'}
                className="input-field py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1 flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-primary-400" /> Link URL (Optional)
          </label>
          <input 
            type="text" 
            name="link_url" 
            defaultValue={announcement?.link_url || ''}
            className="input-field py-2"
            placeholder="/shop or https://..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-400" /> Starts At
            </label>
            <input 
              type="datetime-local" 
              name="starts_at" 
              defaultValue={announcement?.starts_at ? new Date(announcement.starts_at).toISOString().slice(0, 16) : ''}
              className="input-field py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-400" /> Ends At (Optional)
            </label>
            <input 
              type="datetime-local" 
              name="ends_at" 
              defaultValue={announcement?.ends_at ? new Date(announcement.ends_at).toISOString().slice(0, 16) : ''}
              className="input-field py-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 py-2">
          <input 
            type="checkbox" 
            name="is_active" 
            id="is_active"
            defaultChecked={announcement ? announcement.is_active : true}
            className="w-5 h-5 rounded border-primary-200 text-accent focus:ring-accent"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-primary-900">Active (Visible if within timing)</label>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl shadow-lg shadow-primary-900/10"
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {announcement ? 'Update Announcement' : 'Create Announcement'}
      </button>
    </form>
  );
}
