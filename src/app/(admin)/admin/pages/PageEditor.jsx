'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { Save, CheckCircle, AlertCircle } from 'lucide-react';
import { updatePageContent } from './actions';

// Import ReactQuill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-primary-50 animate-pulse rounded-xl flex items-center justify-center text-primary-300">Loading Editor...</div>
});

export default function PageEditor({ initialPage }) {
  const [content, setContent] = useState(initialPage.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script', 'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'link', 'image', 'video'
  ];

  const handleSave = async () => {
    setIsSaving(true);
    setStatus(null);
    
    const result = await updatePageContent(initialPage.slug, content);
    
    setIsSaving(false);
    if (result.success) {
      setStatus({ type: 'success', message: 'Page updated successfully!' });
      setTimeout(() => setStatus(null), 3000);
    } else {
      setStatus({ type: 'error', message: result.error });
    }
  };

  return (
    <div className="bg-white border border-primary-100 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div className="flex-1 min-h-[450px]">
        <ReactQuill 
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          className="h-[400px] pb-12" // Padding at bottom for toolbar items if needed
        />
      </div>

      {/* Footer */}
      <div className="bg-primary-50/30 border-t border-primary-100 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          {status?.type === 'success' && (
            <span className="text-green-600 text-sm flex items-center gap-1 font-medium">
              <CheckCircle className="w-4 h-4" /> {status.message}
            </span>
          )}
          {status?.type === 'error' && (
            <span className="text-red-600 text-sm flex items-center gap-1 font-medium">
              <AlertCircle className="w-4 h-4" /> {status.message}
            </span>
          )}
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 px-8 py-2.5 rounded-xl disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-primary-900/10"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: none !important;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0 !important;
          padding: 12px !important;
        }
        .ql-container.ql-snow {
          border: none !important;
          font-family: inherit;
          font-size: 16px;
        }
        .ql-editor {
          min-height: 400px;
          padding: 2rem !important;
          line-height: 1.6;
        }
        .ql-editor h1, .ql-editor h2, .ql-editor h3 {
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item::before {
          content: 'Normal';
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
          content: 'Small';
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
          content: 'Large';
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
          content: 'Huge';
        }
      `}</style>
    </div>
  );
}
