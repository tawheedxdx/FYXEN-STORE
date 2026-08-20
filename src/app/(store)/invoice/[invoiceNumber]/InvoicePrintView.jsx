'use client';

import { Printer, ArrowLeft, Download, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function InvoicePrintView({ invoice, backUrl = '/account/orders' }) {
  const handlePrint = () => {
    window.print();
  };

  const seller = {
    legalName: invoice.seller_name || 'Bytread International Private Limited',
    brand: invoice.seller_brand || 'FYXEN',
    address: invoice.seller_address || 'Jangipur, Murshidabad, West Bengal - 742213, India',
    gstin: invoice.seller_gstin || '19ABCDE1234F1Z5',
    pan: invoice.seller_pan || 'ABCDE1234F',
    state: invoice.seller_state || 'West Bengal',
    stateCode: invoice.seller_state_code || '19',
    email: 'support@fyxen.in',
    phone: '+91 9332939274'
  };

  const customerBilling = invoice.billing_address || {};
  const isIntraState = Number(invoice.cgst_amount || 0) > 0 || Number(invoice.sgst_amount || 0) > 0;

  return (
    <div className="bg-[#f0ede6] dark:bg-neutral-950 min-h-screen py-8 print:py-0 print:bg-white text-neutral-900">
      {/* Floating Action Bar (Hidden on Print) */}
      <div className="max-w-4xl mx-auto px-4 mb-6 print:hidden">
        <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-lg flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              href={backUrl}
              className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <div>
              <p className="text-xs font-mono font-bold text-[#c6a87c]">{invoice.invoice_number}</p>
              <p className="text-[11px] text-neutral-500">Official GST Tax Invoice</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold hover:opacity-90 shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* A4 Tax Invoice Paper Container */}
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-2xl rounded-3xl print:rounded-none print:shadow-none print:p-0 print:max-w-none border border-neutral-200 print:border-none">
        
        {/* Top Header */}
        <div className="border-b-2 border-neutral-950 pb-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <img 
                  src="/logo.png" 
                  alt="FYXEN" 
                  className="h-9 w-auto object-contain" 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className="text-2xl font-black tracking-tight text-neutral-950">FYXEN</span>
              </div>
              <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                {seller.legalName}
              </p>
            </div>

            <div className="text-right space-y-1">
              <div className="inline-block px-3 py-1 bg-neutral-950 text-white text-xs font-black uppercase tracking-widest rounded-md">
                TAX INVOICE
              </div>
              <p className="text-[10px] text-neutral-500 italic">
                (Original for Recipient)
              </p>
            </div>
          </div>
        </div>

        {/* Invoice & Order Meta Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Invoice Number</span>
            <span className="font-mono font-bold text-neutral-950 text-sm">{invoice.invoice_number}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Invoice Date</span>
            <span className="font-bold text-neutral-800">
              {new Date(invoice.invoice_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Order Number</span>
            <span className="font-mono font-bold text-neutral-950">#{invoice.order_number}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Place of Supply</span>
            <span className="font-bold text-neutral-800">{invoice.place_of_supply || 'West Bengal (19)'}</span>
          </div>
        </div>

        {/* Seller & Buyer 2-Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-xs">
          
          {/* Seller / Sold By */}
          <div className="p-5 rounded-2xl border border-neutral-200 space-y-2 bg-neutral-50/40">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#c6a87c] border-b border-neutral-200 pb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Sold By (Supplier / Seller)
            </p>
            <p className="font-bold text-neutral-950 text-sm">{seller.legalName}</p>
            <p className="text-neutral-600 leading-relaxed">{seller.address}</p>
            <div className="pt-1 space-y-0.5 text-neutral-700 font-mono text-[11px]">
              <p><strong>GSTIN:</strong> {seller.gstin}</p>
              <p><strong>PAN:</strong> {seller.pan}</p>
              <p><strong>State:</strong> {seller.state} (Code: {seller.stateCode})</p>
              <p className="text-[11px] font-sans text-neutral-500 pt-0.5">Email: {seller.email} | Phone: {seller.phone}</p>
            </div>
          </div>

          {/* Buyer / Bill To / Ship To */}
          <div className="p-5 rounded-2xl border border-neutral-200 space-y-2 bg-neutral-50/40">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#c6a87c] border-b border-neutral-200 pb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Bill To &amp; Ship To (Customer)
            </p>
            <p className="font-bold text-neutral-950 text-sm">{invoice.customer_name}</p>
            <p className="text-neutral-600 leading-relaxed">
              {[customerBilling.line1, customerBilling.line2, customerBilling.city, customerBilling.state, customerBilling.postalCode, customerBilling.country || 'India'].filter(Boolean).join(', ')}
            </p>
            <div className="pt-1 space-y-0.5 text-neutral-700 text-[11px]">
              <p><strong>Phone:</strong> {invoice.customer_phone}</p>
              {invoice.customer_email && <p><strong>Email:</strong> {invoice.customer_email}</p>}
              {invoice.customer_gstin && <p className="font-mono"><strong>Customer GSTIN:</strong> {invoice.customer_gstin}</p>}
              <p><strong>State:</strong> {customerBilling.state || 'West Bengal'}</p>
            </div>
          </div>

        </div>

        {/* Transaction Reference Strip */}
        <div className="p-3 bg-neutral-100 rounded-xl text-[11px] flex items-center justify-between gap-4 flex-wrap mb-6 border border-neutral-200">
          <div>
            <span className="text-neutral-500">Payment Mode: </span>
            <strong className="text-neutral-900 uppercase">{invoice.payment_method || 'Online'}</strong>
          </div>
          {invoice.razorpay_payment_id && (
            <div>
              <span className="text-neutral-500">Razorpay Payment ID: </span>
              <strong className="font-mono text-neutral-900">{invoice.razorpay_payment_id}</strong>
            </div>
          )}
          {invoice.razorpay_order_id && (
            <div>
              <span className="text-neutral-500">Razorpay Order ID: </span>
              <strong className="font-mono text-neutral-900">{invoice.razorpay_order_id}</strong>
            </div>
          )}
          {invoice.transaction_ref && (
            <div>
              <span className="text-neutral-500">Ref / Txn No: </span>
              <strong className="font-mono text-neutral-900">{invoice.transaction_ref}</strong>
            </div>
          )}
          <div>
            <span className="text-neutral-500">Payment Status: </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
              {invoice.payment_status || 'PAID'}
            </span>
          </div>
        </div>

        {/* Itemized Table (Tax-Inclusive GST) */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left text-xs border-collapse border border-neutral-200">
            <thead>
              <tr className="bg-neutral-950 text-white font-bold uppercase text-[10px] tracking-wider">
                <th className="p-2.5 border border-neutral-800 text-center w-8">#</th>
                <th className="p-2.5 border border-neutral-800">Description of Goods / Services</th>
                <th className="p-2.5 border border-neutral-800 text-center">HSN/SAC</th>
                <th className="p-2.5 border border-neutral-800 text-center w-12">Qty</th>
                <th className="p-2.5 border border-neutral-800 text-right">Unit Rate (₹)</th>
                <th className="p-2.5 border border-neutral-800 text-right">Taxable (₹)</th>
                <th className="p-2.5 border border-neutral-800 text-center">GST %</th>
                {isIntraState ? (
                  <>
                    <th className="p-2.5 border border-neutral-800 text-right">CGST (₹)</th>
                    <th className="p-2.5 border border-neutral-800 text-right">SGST (₹)</th>
                  </>
                ) : (
                  <th className="p-2.5 border border-neutral-800 text-right">IGST (₹)</th>
                )}
                <th className="p-2.5 border border-neutral-800 text-right font-black">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {(invoice.items || []).map((item, index) => (
                <tr key={index} className="hover:bg-neutral-50/50">
                  <td className="p-2.5 border border-neutral-200 text-center font-mono text-neutral-500">{item.sr_no || index + 1}</td>
                  <td className="p-2.5 border border-neutral-200">
                    <p className="font-bold text-neutral-900">{item.title}</p>
                    {item.sku && <p className="text-[10px] font-mono text-neutral-400">SKU: {item.sku}</p>}
                  </td>
                  <td className="p-2.5 border border-neutral-200 text-center font-mono text-neutral-600">{item.hsn || '9617'}</td>
                  <td className="p-2.5 border border-neutral-200 text-center font-bold">{item.quantity}</td>
                  <td className="p-2.5 border border-neutral-200 text-right font-mono">₹{Number(item.unit_price).toFixed(2)}</td>
                  <td className="p-2.5 border border-neutral-200 text-right font-mono">₹{Number(item.taxable_amount).toFixed(2)}</td>
                  <td className="p-2.5 border border-neutral-200 text-center font-mono font-semibold">{item.tax_rate}%</td>
                  {isIntraState ? (
                    <>
                      <td className="p-2.5 border border-neutral-200 text-right font-mono text-neutral-600">₹{Number(item.cgst || 0).toFixed(2)}</td>
                      <td className="p-2.5 border border-neutral-200 text-right font-mono text-neutral-600">₹{Number(item.sgst || 0).toFixed(2)}</td>
                    </>
                  ) : (
                    <td className="p-2.5 border border-neutral-200 text-right font-mono text-neutral-600">₹{Number(item.igst || 0).toFixed(2)}</td>
                  )}
                  <td className="p-2.5 border border-neutral-200 text-right font-mono font-bold text-neutral-950">₹{Number(item.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation & Financial Totals Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Amount In Words & Notes */}
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Invoice Total in Words</span>
              <p className="font-bold text-neutral-900 leading-relaxed italic">
                {invoice.amount_in_words || 'Indian Rupees Zero Only'}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Terms &amp; Conditions</span>
              <p className="whitespace-pre-line leading-relaxed">
                {invoice.notes || '1. Goods once sold are covered under FYXEN return and replacement policy.\n2. Subject to Jangipur, West Bengal jurisdiction.\n3. This is a computer-generated Tax Invoice.'}
              </p>
            </div>
          </div>

          {/* Right Summary Totals */}
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
            <div className="flex justify-between text-neutral-600">
              <span>Total Taxable Value (Subtotal):</span>
              <span className="font-mono font-semibold text-neutral-900">₹{Number(invoice.subtotal_taxable || 0).toFixed(2)}</span>
            </div>

            {isIntraState ? (
              <>
                <div className="flex justify-between text-neutral-600">
                  <span>Central GST (CGST):</span>
                  <span className="font-mono text-neutral-900">₹{Number(invoice.cgst_amount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>State GST (SGST):</span>
                  <span className="font-mono text-neutral-900">₹{Number(invoice.sgst_amount || 0).toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-neutral-600">
                <span>Integrated GST (IGST):</span>
                <span className="font-mono text-neutral-900">₹{Number(invoice.igst_amount || 0).toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-neutral-600 border-t border-neutral-200 pt-2">
              <span>Total Tax Amount (Included):</span>
              <span className="font-mono font-bold text-neutral-900">₹{Number(invoice.tax_amount || 0).toFixed(2)}</span>
            </div>

            {Number(invoice.discount_amount || 0) > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon / Promotional Discount:</span>
                <span className="font-mono">- ₹{Number(invoice.discount_amount).toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-black text-neutral-950 border-t-2 border-neutral-950 pt-3 mt-2">
              <span>Grand Total (INR):</span>
              <span className="font-mono text-xl text-[#c6a87c]">₹{Number(invoice.grand_total || 0).toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-neutral-400 text-right italic pt-0.5">* Inclusive of all GST taxes</p>
          </div>

        </div>

        {/* Footer & Signature Section */}
        <div className="border-t border-neutral-200 pt-6 mt-8">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div className="text-[10px] text-neutral-400 max-w-sm space-y-1">
              <p className="flex items-center gap-1.5 text-neutral-600 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Authenticated Tax Invoice
              </p>
              <p>Generated electronically by FYXEN Store Engine on behalf of {seller.legalName}.</p>
            </div>

            <div className="text-right space-y-3">
              <p className="text-[11px] font-bold text-neutral-700">For {seller.legalName.toUpperCase()}</p>
              
              {/* Digital Stamp Seal Box */}
              <div className="inline-block p-3 border-2 border-dashed border-[#c6a87c]/60 rounded-xl bg-[#c6a87c]/5 text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#c6a87c]">FYXEN OFFICIAL SEAL</p>
                <p className="text-[10px] font-bold text-neutral-800">Digitally Signed &amp; Approved</p>
              </div>
              
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Authorised Signatory
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Printable Custom CSS */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          nav, footer, aside, .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
