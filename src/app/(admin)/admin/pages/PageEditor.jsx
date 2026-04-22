'use client';

import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Heading2, Link as LinkIcon, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { updatePageContent } from './actions';

export default function PageEditor({ initialPage }) {
  const [content, setContent] = useState(initialPage.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, []);

  const handleCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus(null);
    
    const htmlContent = editorRef.current.innerHTML;
    const result = await updatePageContent(initialPage.slug, htmlContent);
    
    setIsSaving(false);
    if (result.success) {
      setStatus({ type: 'success', message: 'Page updated successfully!' });
      setTimeout(() => setStatus(null), 3000);
    } else {
      setStatus({ type: 'error', message: result.error });
    }
  };

  return (
    <div className="bg-white border border-primary-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="bg-primary-50/50 border-b border-primary-100 p-2 flex flex-wrap gap-1">
        <button onClick={() => handleCommand('bold')} className="p-2 hover:bg-white rounded-md transition-colors" title="Bold">
          <Bold className="w-4 h-4" />
        </button>
        <button onClick={() => handleCommand('italic')} className="p-2 hover:bg-white rounded-md transition-colors" title="Italic">
          <Italic className="w-4 h-4" />
        </button>
        <button onClick={() => handleCommand('underline')} className="p-2 hover:bg-white rounded-md transition-colors" title="Underline">
          <Underline className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-primary-200 mx-1 self-center" />
        <button onClick={() => handleCommand('formatBlock', 'h2')} className="p-2 hover:bg-white rounded-md transition-colors font-bold text-sm" title="Heading">
          H2
        </button>
        <button onClick={() => handleCommand('insertUnorderedList')} className="p-2 hover:bg-white rounded-md transition-colors" title="Bullet List">
          <List className="w-4 h-4" />
        </button>
        <button onClick={() => handleCommand('insertOrderedList')} className="p-2 hover:bg-white rounded-md transition-colors" title="Numbered List">
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-primary-200 mx-1 self-center" />
        <button 
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) handleCommand('createLink', url);
          }} 
          className="p-2 hover:bg-white rounded-md transition-colors" 
          title="Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Area */}
      <div 
        ref={editorRef}
        contentEditable
        className="p-8 min-h-[400px] focus:outline-none prose prose-primary max-w-none"
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
      />

      {/* Footer */}
      <div className="bg-primary-50/30 border-t border-primary-100 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {status?.type === 'success' && (
            <span className="text-green-600 text-sm flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> {status.message}
            </span>
          )}
          {status?.type === 'error' && (
            <span className="text-red-600 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {status.message}
            </span>
          )}
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 px-6 py-2 rounded-xl disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
