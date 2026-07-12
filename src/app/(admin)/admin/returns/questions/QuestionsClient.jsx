'use client';

import { useState } from 'react';
import { HelpCircle, ToggleLeft, ToggleRight, Plus, AlertCircle } from 'lucide-react';
import QuestionForm from './QuestionForm';
import { toggleQuestionStatus } from './actions';

export default function QuestionsClient({ initialQuestions }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  async function handleToggle(id, currentStatus) {
    setLoadingId(id);
    const newStatus = !currentStatus;
    const res = await toggleQuestionStatus(id, newStatus);
    setLoadingId(null);
    if (res.success) {
      setQuestions(prev => 
        prev.map(q => q.id === id ? { ...q, is_active: newStatus } : q)
      );
    } else {
      alert(res.error || 'Failed to toggle question status');
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* List of Questions */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-primary-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-primary-900">Configured Questions</h2>
            {selectedQuestion && (
              <button
                onClick={() => setSelectedQuestion(null)}
                className="flex items-center gap-1.5 text-xs text-accent hover:underline font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Create New Question
              </button>
            )}
          </div>

          <div className="divide-y divide-primary-100">
            {questions.map((q, index) => (
              <div key={q.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-primary-400 font-mono font-medium">#{index + 1}</span>
                    <span className="font-semibold text-primary-900">{q.question_text}</span>
                    {q.required && (
                      <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        Required
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-primary-500 flex items-center gap-3">
                    <span className="capitalize">Type: <strong>{q.type}</strong></span>
                    {q.type === 'mcq' && q.options && (
                      <span className="text-primary-400">
                        Options: {Array.isArray(q.options) ? q.options.join(', ') : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    disabled={loadingId === q.id}
                    onClick={() => handleToggle(q.id, q.is_active)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      q.is_active 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-primary-300 hover:bg-primary-50'
                    }`}
                    title={q.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {q.is_active ? (
                      <ToggleRight className="w-6 h-6" />
                    ) : (
                      <ToggleLeft className="w-6 h-6" />
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedQuestion(q)}
                    className="btn-outline px-3 py-1.5 text-xs rounded-lg"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-12 text-primary-500">
                <HelpCircle className="w-12 h-12 text-primary-200 mx-auto mb-3" />
                <p className="font-medium">No return questions configured.</p>
                <p className="text-xs mt-1">Questions will be asked to users when requesting a return.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Question Form */}
      <div className="lg:col-span-1">
        <QuestionForm 
          question={selectedQuestion} 
          onCancel={selectedQuestion ? () => setSelectedQuestion(null) : null} 
        />
      </div>
    </div>
  );
}
