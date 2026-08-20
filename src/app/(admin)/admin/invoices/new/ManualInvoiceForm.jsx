'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createManualInvoice } from '@/app/(admin)/admin/invoices/actions';
import { calculateTaxInclusiveItem, isWestBengalState, numberToWordsIndian } from '@/lib/invoiceUtils';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  Building2, 
  User, 
  CreditCard, 
  FileText,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function ManualInvoiceForm({ catalogProducts = [], settings }) {
  const router = useRouter();
  const defaultGstRate = Number(settings?.default_gst_rate) || 18;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('Jangipur');
  const [state, setState] = useState('West Bengal');
  const [postalCode, setPostalCode] = useState('742213');

  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState(settings?.invoice_terms || '');

  const [items, setItems] = useState([
    {
      id: 1,
      productId: '',
      title: '',
      sku: '',
      hsn: '9617',
      quantity: 1,
      unitPriceInclusive: '',
      taxRate: defaultGstRate
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check state for tax calculation
  const isIntraState = useMemo(() => {
    return isWestBengalState(state, postalCode, city);
  }, [state, postalCode, city]);

  // Handle line items
  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: Date.now(),
        productId: '',
        title: '',
        sku: '',
        hsn: '9617',
        quantity: 1,
        unitPriceInclusive: '',
        taxRate: defaultGstRate
      }
    ]);
  };

  const handleRemoveItem = (id) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;

      const updated = { ...item, [field]: value };

      // If user selected a catalog product
      if (field === 'productId' && value) {
        const prod = catalogProducts.find(p => p.id === value);
        if (prod) {
          updated.title = prod.title;
          updated.sku = prod.sku || '';
          updated.hsn = prod.hsn_code || '9617';
          updated.unitPriceInclusive = prod.price || '';
          updated.taxRate = Number(prod.tax_rate) > 0 ? Number(prod.tax_rate) : defaultGstRate;
        }
      }

      return updated;
    }));
  };

  // Calculations
  const calculations = useMemo(() => {
    let totalTaxable = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;
    let grandTotal = 0;

    const computedItems = items.map(item => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const price = Number(item.unitPriceInclusive) || 0;
      const rate = Number(item.taxRate) > 0 ? Number(item.taxRate) : defaultGstRate;

      const calc = calculateTaxInclusiveItem({
        quantity: qty,
        unitPriceInclusive: price,
        taxRate: rate,
        isIntraState
      });

      totalTaxable += calc.taxableAmount;
      totalCgst += calc.cgst;
      totalSgst += calc.sgst;
      totalIgst += calc.igst;
      grandTotal += calc.totalPriceInclusive;

      return {
        ...item,
        ...calc
      };
    });

    return {
      computedItems,
      totalTaxable: Number(totalTaxable.toFixed(2)),
      totalCgst: Number(totalCgst.toFixed(2)),
      totalSgst: Number(totalSgst.toFixed(2)),
      totalIgst: Number(totalIgst.toFixed(2)),
      totalTax: Number((totalCgst + totalSgst + totalIgst).toFixed(2)),
      grandTotal: Number(grandTotal.toFixed(2)),
      amountInWords: numberToWordsIndian(grandTotal)
    };
  }, [items, isIntraState, defaultGstRate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate items
      const validItems = items.filter(i => i.title.trim() && Number(i.unitPriceInclusive) > 0);
      if (validItems.length === 0) {
        throw new Error('Please add at least one line item with a valid title and price.');
      }

      const payload = {
        customerName,
        customerPhone,
        customerEmail,
        customerGstin,
        addressLine1,
        city,
        state,
        postalCode,
        paymentMethod,
        transactionRef,
        rawItems: validItems.map(i => ({
          title: i.title,
          sku: i.sku,
          hsn: i.hsn,
          quantity: Number(i.quantity) || 1,
          unitPriceInclusive: Number(i.unitPriceInclusive) || 0,
          taxRate: Number(i.taxRate) || defaultGstRate
        })),
        notes
      };

      const res = await createManualInvoice(payload);
      if (res?.error) {
        setError(res.error);
      } else if (res?.invoiceNumber) {
        router.push(`/invoice/${encodeURIComponent(res.invoiceNumber)}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to create invoice.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/invoices"
            className="inline-flex items-center gap-1.5 text-xs text-primary-500 hover:text-primary-900 dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Invoices
          </Link>
          <h1 className="text-3xl font-bold text-primary-900 dark:text-white flex items-center gap-3">
            <Receipt className="w-8 h-8 text-[#c6a87c]" />
            Create Manual Tax Invoice
          </h1>
          <p className="text-primary-500 text-sm mt-1">
            Bill external, offline, or corporate B2B sales with custom GST itemization under {settings?.seller_legal_name || 'Bytread International Private Limited'}.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Customer Information */}
      <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-3xl border border-primary-100 dark:border-neutral-800 shadow-xs space-y-6">
        <h2 className="font-bold text-lg border-b border-primary-100 dark:border-neutral-800 pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-[#c6a87c]" /> Customer Details (Bill To)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Customer / Client Name *</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Ramesh Kumar or TechCorp Ltd"
              className="input-field text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Phone Number *</label>
            <input
              type="text"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="input-field text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Email Address (Optional)</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="customer@example.com"
              className="input-field text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Customer GSTIN (Optional B2B)</label>
            <input
              type="text"
              value={customerGstin}
              onChange={(e) => setCustomerGstin(e.target.value)}
              placeholder="e.g. 19AAACC1206D1ZM"
              className="input-field text-xs font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Address Line *</label>
          <input
            type="text"
            required
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            placeholder="Shop 12, Main Market, Station Road"
            className="input-field text-xs"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">City *</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="input-field text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">State *</label>
            <input
              type="text"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="input-field text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">PIN Code *</label>
            <input
              type="text"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="input-field text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* 2. Line Items Section (Tax Inclusive) */}
      <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-3xl border border-primary-100 dark:border-neutral-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-primary-100 dark:border-neutral-800 pb-3 flex-wrap gap-2">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#c6a87c]" /> Invoice Line Items (Tax-Inclusive Pricing)
          </h2>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-neutral-500 uppercase tracking-wider">Item #{index + 1}</span>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                {/* Optional Catalog Selector */}
                {catalogProducts.length > 0 && (
                  <div className="md:col-span-4">
                    <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Pick From Store Catalog</label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemChange(item.id, 'productId', e.target.value)}
                      className="input-field text-xs py-2"
                    >
                      <option value="">-- Custom Item or Pick Product --</option>
                      {catalogProducts.map(p => (
                        <option key={p.id} value={p.id}>{p.title} (₹{p.price})</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Title */}
                <div className={catalogProducts.length > 0 ? "md:col-span-4" : "md:col-span-5"}>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Item Description / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Product name or service"
                    value={item.title}
                    onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                    className="input-field text-xs py-2"
                  />
                </div>

                {/* HSN Code */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">HSN/SAC (Optional)</label>
                  <input
                    type="text"
                    placeholder="9617"
                    value={item.hsn}
                    onChange={(e) => handleItemChange(item.id, 'hsn', e.target.value)}
                    className="input-field text-xs py-2 font-mono"
                  />
                </div>

                {/* Qty */}
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Qty</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                    className="input-field text-xs py-2 text-center"
                  />
                </div>

                {/* Rate Incl */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Unit Rate (₹ Incl.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    value={item.unitPriceInclusive}
                    onChange={(e) => handleItemChange(item.id, 'unitPriceInclusive', e.target.value)}
                    className="input-field text-xs py-2 font-mono font-bold"
                  />
                </div>

                {/* GST Rate */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">GST Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={String(defaultGstRate)}
                    value={item.taxRate}
                    onChange={(e) => handleItemChange(item.id, 'taxRate', e.target.value)}
                    className="input-field text-xs py-2 text-center font-mono"
                  />
                </div>

                {/* Item Computed Total */}
                <div className="md:col-span-3 pb-2 text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Item Total</span>
                  <span className="font-mono font-bold text-neutral-950 dark:text-white text-sm">
                    ₹{((Number(item.quantity) || 1) * (Number(item.unitPriceInclusive) || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Payment Mode & Notes */}
      <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-3xl border border-primary-100 dark:border-neutral-800 shadow-xs space-y-6">
        <h2 className="font-bold text-lg border-b border-primary-100 dark:border-neutral-800 pb-3 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#c6a87c]" /> Payment &amp; Terms
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Payment Method *</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input-field text-xs font-bold"
            >
              <option value="CASH">Cash Payment</option>
              <option value="UPI">UPI / QR Code</option>
              <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS/IMPS)</option>
              <option value="CARD">Credit / Debit Card</option>
              <option value="CHEQUE">Cheque / Demand Draft</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Transaction Ref / Cheque No. (Optional)</label>
            <input
              type="text"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="e.g. UPI-99882211 or CHQ-00129"
              className="input-field text-xs font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Invoice Notes &amp; Terms</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-field text-xs resize-none font-mono"
          />
        </div>
      </div>

      {/* 4. Live Financial Preview & Submit */}
      <div className="bg-neutral-950 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-black tracking-tight">Invoice Financial Breakdown</h3>
            <p className="text-xs text-neutral-400">
              Place of Supply: <strong>{state}</strong> ({isIntraState ? 'Intra-State: CGST + SGST' : 'Inter-State: IGST'})
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-neutral-400 block uppercase tracking-wider">Grand Total</span>
            <span className="text-3xl font-black text-[#c6a87c] font-mono">
              ₹{calculations.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 space-y-1">
            <span className="text-neutral-400 text-[10px] uppercase font-bold">Taxable Amount</span>
            <p className="text-lg font-bold font-mono">₹{calculations.totalTaxable.toFixed(2)}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 space-y-1">
            <span className="text-neutral-400 text-[10px] uppercase font-bold">
              {isIntraState ? 'CGST + SGST' : 'Integrated GST (IGST)'}
            </span>
            <p className="text-lg font-bold font-mono text-[#c6a87c]">
              ₹{calculations.totalTax.toFixed(2)}
            </p>
            {isIntraState && (
              <p className="text-[10px] text-neutral-400 font-mono">
                CGST: ₹{calculations.totalCgst.toFixed(2)} | SGST: ₹{calculations.totalSgst.toFixed(2)}
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white/5 space-y-1">
            <span className="text-neutral-400 text-[10px] uppercase font-bold">Amount in Words</span>
            <p className="text-xs font-semibold leading-snug italic text-neutral-200">
              {calculations.amountInWords}
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#c6a87c] text-neutral-950 font-black text-sm hover:bg-[#d8be96] shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Official Invoice...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Generate &amp; Save Tax Invoice</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
