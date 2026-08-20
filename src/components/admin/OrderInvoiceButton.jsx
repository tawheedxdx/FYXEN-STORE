'use client';

import { useState } from 'react';
import { generateInvoiceForOrder } from '@/app/(admin)/admin/invoices/actions';
import { Receipt, Loader2, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function OrderInvoiceButton({ orderId, orderStatus, existingInvoiceNumber }) {
  const [invoiceNumber, setInvoiceNumber] = useState(existingInvoiceNumber);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const eligibleStatuses = ['confirmed', 'packed', 'shipped', 'delivered', 'completed', 'return_approved'];
  const isEligible = eligibleStatuses.includes(orderStatus);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await generateInvoiceForOrder(orderId);
      if (res?.error) {
        setError(res.error);
      } else if (res?.invoiceNumber) {
        setInvoiceNumber(res.invoiceNumber);
      }
    } catch (err) {
      setError(err?.message || 'Failed to generate invoice.');
    } finally {
      setIsLoading(false);
    }
  };

  if (invoiceNumber) {
    return (
      <Link
        href={`/invoice/${encodeURIComponent(invoiceNumber)}`}
        target="_blank"
        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold rounded-xl hover:opacity-90 shadow-sm transition-all"
      >
        <Receipt className="w-4 h-4 text-[#c6a87c]" />
        <span>View Tax Invoice ({invoiceNumber})</span>
        <ExternalLink className="w-3 h-3 opacity-60" />
      </Link>
    );
  }

  if (!isEligible) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 text-xs font-semibold rounded-xl cursor-not-allowed">
        <Receipt className="w-3.5 h-3.5" />
        <span>Invoice requires &quot;Confirmed&quot; status</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#c6a87c] text-white text-xs font-bold rounded-xl hover:bg-[#b5966a] shadow-sm transition-all cursor-pointer disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating GST Invoice...</span>
          </>
        ) : (
          <>
            <Receipt className="w-4 h-4" />
            <span>Generate Tax Invoice (1-Click)</span>
          </>
        )}
      </button>
      {error && (
        <span className="text-[11px] text-rose-500 font-bold flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </span>
      )}
    </div>
  );
}
