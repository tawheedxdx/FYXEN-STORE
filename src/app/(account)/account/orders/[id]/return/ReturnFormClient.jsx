'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { submitReturnRequest } from './actions';
import { Loader2, ArrowLeft, Check, Camera, Plus, Minus, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReturnFormClient({ order, questions, returnFeeUnder1000 = 0 }) {
  const [selectedItems, setSelectedItems] = useState({});
  const [quantities, setQuantities] = useState(
    order.order_items.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})
  );
  const [textAnswers, setTextAnswers] = useState({});
  const [imageFiles, setImageFiles] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  function handleItemCheckbox(itemId) {
    setSelectedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  }

  function handleQuantityChange(itemId, change, max) {
    setQuantities(prev => {
      const current = prev[itemId] || 1;
      const next = current + change;
      if (next < 1 || next > max) return prev;
      return { ...prev, [itemId]: next };
    });
  }

  function handleFileChange(questionId, e) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFiles(prev => ({ ...prev, [questionId]: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => ({ ...prev, [questionId]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // 1. Validate items selected
    const selectedItemIds = Object.keys(selectedItems).filter(id => selectedItems[id]);
    if (selectedItemIds.length === 0) {
      setError('Please select at least one item to return.');
      return;
    }

    // 2. Validate questions
    const answersPayload = [];
    const supabase = createClient();
    setIsPending(true);

    try {
      for (const q of questions) {
        let answerVal = '';
        let imageUrlVal = '';

        if (q.type === 'text' || q.type === 'mcq') {
          answerVal = textAnswers[q.id] || '';
          if (q.required && !answerVal) {
            throw new Error(`Please answer the question: "${q.question_text}"`);
          }
        } else if (q.type === 'image') {
          const file = imageFiles[q.id];
          if (q.required && !file) {
            throw new Error(`Please upload an image for: "${q.question_text}"`);
          }

          if (file) {
            // Upload to storage
            const fileExt = file.name.split('.').pop();
            const filePath = `${order.id}/${q.id}-${Date.now()}.${fileExt}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
               .from('return-images')
              .upload(filePath, file, { cacheControl: '3600', upsert: true });

            if (uploadError) {
              throw new Error(`Failed to upload image: ${uploadError.message}`);
            }

            answerVal = uploadData.path;
            imageUrlVal = uploadData.path;
          }
        }

        answersPayload.push({
          question_id: q.id,
          question_text: q.question_text,
          type: q.type,
          answer: answerVal,
          image_url: imageUrlVal
        });
      }

      // Compile items list
      const itemsPayload = selectedItemIds.map(id => {
        const orderItem = order.order_items.find(it => it.id === id);
        return {
          order_item_id: orderItem.id,
          product_title: orderItem.product_title_snapshot,
          quantity: quantities[id] || 1
        };
      });

      // Submit return request
      const res = await submitReturnRequest({
        orderId: order.id,
        items: itemsPayload,
        answers: answersPayload
      });

      if (res.error) {
        throw new Error(res.error);
      }

      // Success redirects back to order details page
      router.push(`/account/orders/${order.id}`);
      router.refresh();

    } catch (err) {
      setError(err.message);
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <Link 
          href={`/account/orders/${order.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-primary-500 hover:text-primary-950 font-semibold mb-2 group transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back to Order #{order.order_number}
        </Link>
        <h1 className="text-3xl font-bold text-primary-900">Request a Return</h1>
        <p className="text-primary-500">Select the items you wish to return and answer the questions below.</p>
      </div>

      {order.grand_total < 1000 && returnFeeUnder1000 > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-sm flex items-start gap-2 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <span className="font-bold">Return Fee Applicable:</span> As your order value is less than ₹1,000, a return fee of <span className="font-bold">₹{returnFeeUnder1000}</span> will be charged upon approval of this return request.
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm flex items-start gap-2 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Item Selector Section */}
      <div className="bg-white rounded-3xl border border-primary-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-primary-50">
          <h2 className="font-bold text-base text-primary-900">1. Select Items to Return</h2>
        </div>
        <div className="divide-y divide-primary-50">
          {order.order_items.map((item) => {
            const isChecked = !!selectedItems[item.id];
            const currentQty = quantities[item.id] || 1;

            return (
              <div 
                key={item.id} 
                className={`p-6 flex gap-4 transition-colors ${isChecked ? 'bg-primary-50/20' : ''}`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleItemCheckbox(item.id)}
                    className="w-5 h-5 rounded border-primary-200 text-accent focus:ring-accent cursor-pointer"
                  />
                </div>

                <div className="w-16 h-20 bg-primary-50 rounded-xl overflow-hidden border border-primary-100 shrink-0">
                  {item.image_snapshot ? (
                    <img 
                      src={item.image_snapshot} 
                      alt={item.product_title_snapshot}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[8px] text-primary-300 font-bold uppercase">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-primary-900 truncate">{item.product_title_snapshot}</h4>
                  <p className="text-xs text-primary-400 mt-0.5">Purchased quantity: {item.quantity}</p>
                  <p className="text-sm font-bold text-primary-900 mt-2">₹{item.unit_price.toLocaleString('en-IN')}</p>
                </div>

                {isChecked && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={currentQty <= 1}
                      onClick={() => handleQuantityChange(item.id, -1, item.quantity)}
                      className="w-8 h-8 rounded-lg border border-primary-100 hover:bg-primary-50 flex items-center justify-center text-primary-500 disabled:opacity-40 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-primary-950 text-sm w-4 text-center">{currentQty}</span>
                    <button
                      type="button"
                      disabled={currentQty >= item.quantity}
                      onClick={() => handleQuantityChange(item.id, 1, item.quantity)}
                      className="w-8 h-8 rounded-lg border border-primary-100 hover:bg-primary-50 flex items-center justify-center text-primary-500 disabled:opacity-40 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Questions Section */}
      {questions.length > 0 && (
        <div className="bg-white rounded-3xl border border-primary-100 shadow-sm p-6 space-y-6">
          <h2 className="font-bold text-base text-primary-900 border-b border-primary-50 pb-4">
            2. Return Information
          </h2>

          <div className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <label className="block text-sm font-semibold text-primary-800">
                  {q.question_text} {q.required && <span className="text-red-500">*</span>}
                </label>

                {q.type === 'text' && (
                  <textarea
                    rows={3}
                    required={q.required}
                    value={textAnswers[q.id] || ''}
                    onChange={(e) => setTextAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder="Provide details..."
                    className="input-field resize-none"
                  />
                )}

                {q.type === 'mcq' && (
                  <select
                    required={q.required}
                    value={textAnswers[q.id] || ''}
                    onChange={(e) => setTextAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Select an option...</option>
                    {Array.isArray(q.options) && q.options.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {q.type === 'image' && (
                  <div className="space-y-3">
                    <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-primary-200 hover:border-accent rounded-2xl p-6 cursor-pointer bg-primary-50/20 hover:bg-primary-50/50 transition-all group">
                      <input
                        type="file"
                        accept="image/*"
                        required={q.required && !imageFiles[q.id]}
                        onChange={(e) => handleFileChange(q.id, e)}
                        className="sr-only"
                      />
                      <Camera className="w-8 h-8 text-primary-400 group-hover:text-accent mb-2 transition-colors" />
                      <span className="text-xs font-semibold text-primary-600 group-hover:text-accent-hover transition-colors">
                        {imageFiles[q.id] ? 'Change Photo' : 'Upload Image Proof'}
                      </span>
                      <span className="text-[10px] text-primary-400 mt-1">JPEG, PNG up to 10MB</span>
                    </label>

                    {imagePreviews[q.id] && (
                      <div className="relative inline-block rounded-xl overflow-hidden border border-primary-100 bg-primary-50 p-2">
                        <img
                          src={imagePreviews[q.id]}
                          alt="Proof preview"
                          className="max-h-[160px] w-auto object-contain rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full btn-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary-900/10 text-base"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Uploading & Submitting...
          </>
        ) : (
          <>
            <Check className="w-5 h-5" />
            Submit Return Request
          </>
        )}
      </button>
    </form>
  );
}
