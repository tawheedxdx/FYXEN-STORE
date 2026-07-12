'use client';

import { useState, useEffect } from 'react';
import { Save, Trash2, Loader2, HelpCircle } from 'lucide-react';
import { upsertQuestion, deleteQuestion } from './actions';
import { useRouter } from 'next/navigation';

export default function QuestionForm({ question = null, onCancel = null }) {
  const [isPending, setIsPending] = useState(false);
  const [type, setType] = useState(question?.type || 'text');
  const [optionsText, setOptionsText] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (question) {
      setType(question.type);
      if (question.options) {
        setOptionsText(Array.isArray(question.options) ? question.options.join(', ') : '');
      }
    } else {
      setType('text');
      setOptionsText('');
    }
  }, [question]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.target);
    
    // Parse options list
    if (type === 'mcq') {
      const optionsArray = optionsText
        .split(',')
        .map(o => o.trim())
        .filter(Boolean);
      formData.set('options', JSON.stringify(optionsArray));
    } else {
      formData.set('options', '[]');
    }

    const res = await upsertQuestion(formData);
    setIsPending(false);
    
    if (res.success) {
      router.refresh();
      if (!question) {
        e.target.reset();
        setType('text');
        setOptionsText('');
      }
      if (onCancel) onCancel();
    } else {
      alert(res.error);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this question?')) return;
    setIsPending(true);
    const res = await deleteQuestion(question.id);
    setIsPending(false);
    if (res.success) {
      router.refresh();
      if (onCancel) onCancel();
    } else {
      alert(res.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-primary-100 shadow-sm space-y-6">
      {question && <input type="hidden" name="id" value={question.id} />}
      
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg text-primary-900">
          {question ? 'Edit Return Question' : 'Create New Return Question'}
        </h3>
        {question && (
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
          <label className="block text-sm font-medium text-primary-700 mb-1">Question Text</label>
          <input 
            type="text"
            name="questionText" 
            required 
            defaultValue={question?.question_text || ''}
            className="input-field"
            placeholder="E.g. What is the reason for return?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Response Type</label>
            <select 
              name="type" 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field"
            >
              <option value="text">Text Response (Textarea)</option>
              <option value="mcq">Multiple Choice (Dropdown Select)</option>
              <option value="image">Image Upload (Photo Proof)</option>
            </select>
          </div>

          <div className="flex items-center gap-6 pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                name="required" 
                value="true"
                defaultChecked={question ? question.required : true}
                className="w-5 h-5 rounded border-primary-200 text-accent focus:ring-accent"
              />
              <span className="text-sm font-medium text-primary-900">Required Question</span>
            </label>
          </div>
        </div>

        {type === 'mcq' && (
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">
              MCQ Options (Comma Separated)
            </label>
            <input 
              type="text" 
              value={optionsText}
              onChange={(e) => setOptionsText(e.target.value)}
              required
              className="input-field"
              placeholder="E.g. Size was too small, Item was defective, Changed my mind"
            />
            <p className="text-[10px] text-primary-400 mt-1">Separate each option with a comma.</p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="btn-outline flex-1 py-3 rounded-xl text-center"
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          disabled={isPending}
          className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 rounded-xl shadow-lg shadow-primary-900/10"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {question ? 'Update Question' : 'Add Question'}
        </button>
      </div>
    </form>
  );
}
