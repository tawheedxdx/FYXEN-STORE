'use client';

import { Printer, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InvoicePrintView({ invoice, backUrl = '/admin/orders' }) {
  const router = useRouter();

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(backUrl);
    }
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

  const billing = invoice.billing_address || {};
  const shipping = invoice.shipping_address || billing;
  const isIntraState = Number(invoice.cgst_amount || 0) > 0 || Number(invoice.sgst_amount || 0) > 0;

  // Format terms into clean lines
  const rawTerms = invoice.notes || '1. Goods once sold are covered under FYXEN return and replacement policy.\n2. Subject to Jangipur, West Bengal jurisdiction.\n3. This is a computer-generated Tax Invoice and requires no physical signature.';
  const termsLines = rawTerms.replace(/\\n/g, '\n').split('\n').filter(Boolean);

  return (
    <div className="min-h-screen bg-neutral-100 text-black py-6 print:py-0 print:bg-white font-sans antialiased">
      
      {/* Floating Control Toolbar (Hidden on Print) */}
      <div className="max-w-[210mm] mx-auto px-4 mb-4 print:hidden">
        <div className="bg-white p-3 rounded-lg border border-neutral-300 shadow-sm flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-neutral-700 hover:text-black bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          
          <div className="text-center">
            <span className="text-xs font-bold text-neutral-800">Tax Invoice: </span>
            <span className="font-mono text-xs font-bold">{invoice.invoice_number}</span>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-neutral-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Standard A4 Tax Invoice Sheet */}
      <div className="max-w-[210mm] mx-auto bg-white p-6 sm:p-8 print:p-0 shadow-md print:shadow-none border border-neutral-300 print:border-none text-[11px] leading-tight print:max-w-none">
        
        {/* Top Header / Company & Title */}
        <div className="border-b-2 border-black pb-3 mb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <h1 className="text-lg font-black tracking-tight uppercase">{seller.legalName}</h1>
              <p className="text-xs font-bold text-neutral-700">Brand: {seller.brand}</p>
              <p className="text-[10px] text-neutral-600 max-w-md">{seller.address}</p>
              <p className="text-[10px] font-mono text-neutral-800 pt-0.5">
                <strong>GSTIN:</strong> {seller.gstin} | <strong>PAN:</strong> {seller.pan} | <strong>State:</strong> {seller.state} (Code: {seller.stateCode})
              </p>
              <p className="text-[10px] text-neutral-600">Email: {seller.email} | Phone: {seller.phone}</p>
            </div>

            <div className="text-right space-y-1">
              <div className="inline-block border border-black px-3 py-1 text-xs font-black uppercase tracking-wider bg-neutral-50">
                TAX INVOICE
              </div>
              <p className="text-[9px] text-neutral-500 italic block">(Original for Recipient)</p>
            </div>
          </div>
        </div>

        {/* Invoice & Order Metadata Strip */}
        <div className="grid grid-cols-4 border border-black bg-neutral-50 text-[10px] divide-x divide-black mb-3">
          <div className="p-2">
            <span className="text-neutral-500 uppercase block font-semibold">Invoice Number</span>
            <span className="font-mono font-bold text-xs">{invoice.invoice_number}</span>
          </div>
          <div className="p-2">
            <span className="text-neutral-500 uppercase block font-semibold">Invoice Date</span>
            <span className="font-bold">
              {new Date(invoice.invoice_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="p-2">
            <span className="text-neutral-500 uppercase block font-semibold">Order ID</span>
            <span className="font-mono font-bold">#{invoice.order_number}</span>
          </div>
          <div className="p-2">
            <span className="text-neutral-500 uppercase block font-semibold">Place of Supply</span>
            <span className="font-bold">{invoice.place_of_supply || 'West Bengal (19)'}</span>
          </div>
        </div>

        {/* Bill To & Ship To Boxes */}
        <div className="grid grid-cols-2 border border-black divide-x divide-black mb-3 text-[10px]">
          {/* Bill To */}
          <div className="p-2.5 space-y-1">
            <p className="font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-200 pb-1">
              Details of Receiver | Billed To:
            </p>
            <p className="font-bold text-xs text-neutral-900">{invoice.customer_name}</p>
            <p className="text-neutral-700">
              {[billing.line1, billing.line2, billing.city, billing.state, billing.postalCode].filter(Boolean).join(', ')}
            </p>
            <p><strong>Phone:</strong> {invoice.customer_phone}</p>
            {invoice.customer_email && <p><strong>Email:</strong> {invoice.customer_email}</p>}
            {invoice.customer_gstin && <p className="font-mono"><strong>GSTIN/UIN:</strong> {invoice.customer_gstin}</p>}
            <p><strong>State:</strong> {billing.state || 'West Bengal'}</p>
          </div>

          {/* Ship To */}
          <div className="p-2.5 space-y-1">
            <p className="font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-200 pb-1">
              Details of Consignee | Shipped To:
            </p>
            <p className="font-bold text-xs text-neutral-900">{shipping.fullName || invoice.customer_name}</p>
            <p className="text-neutral-700">
              {[shipping.line1, shipping.line2, shipping.city, shipping.state, shipping.postalCode].filter(Boolean).join(', ')}
            </p>
            <p><strong>Phone:</strong> {shipping.phone || invoice.customer_phone}</p>
            <p><strong>State:</strong> {shipping.state || billing.state || 'West Bengal'}</p>
          </div>
        </div>

        {/* Payment & Transaction Strip */}
        <div className="border border-black bg-neutral-50 px-3 py-1.5 text-[10px] flex items-center justify-between flex-wrap gap-2 mb-3">
          <div>
            <span className="text-neutral-600">Payment Mode: </span>
            <strong className="uppercase">{invoice.payment_method || 'Online'}</strong>
          </div>
          {invoice.razorpay_payment_id && (
            <div>
              <span className="text-neutral-600">RZP Payment ID: </span>
              <strong className="font-mono">{invoice.razorpay_payment_id}</strong>
            </div>
          )}
          {invoice.razorpay_order_id && (
            <div>
              <span className="text-neutral-600">RZP Order ID: </span>
              <strong className="font-mono">{invoice.razorpay_order_id}</strong>
            </div>
          )}
          {invoice.transaction_ref && (
            <div>
              <span className="text-neutral-600">Txn Ref: </span>
              <strong className="font-mono">{invoice.transaction_ref}</strong>
            </div>
          )}
          <div>
            <span className="text-neutral-600">Payment Status: </span>
            <strong className="uppercase text-emerald-800">{invoice.payment_status || 'PAID'}</strong>
          </div>
        </div>

        {/* Itemized Table */}
        <table className="w-full border-collapse border border-black text-[10px] mb-3">
          <thead>
            <tr className="bg-neutral-100 border-b border-black font-bold uppercase text-[9px]">
              <th className="border border-black p-1.5 text-center w-6">#</th>
              <th className="border border-black p-1.5 text-left">Description of Goods</th>
              <th className="border border-black p-1.5 text-center w-14">HSN/SAC</th>
              <th className="border border-black p-1.5 text-center w-8">Qty</th>
              <th className="border border-black p-1.5 text-right w-16">Unit Rate (₹)</th>
              <th className="border border-black p-1.5 text-right w-16">Taxable Val (₹)</th>
              <th className="border border-black p-1.5 text-center w-10">GST %</th>
              {isIntraState ? (
                <>
                  <th className="border border-black p-1.5 text-right w-14">CGST (₹)</th>
                  <th className="border border-black p-1.5 text-right w-14">SGST (₹)</th>
                </>
              ) : (
                <th className="border border-black p-1.5 text-right w-16">IGST (₹)</th>
              )}
              <th className="border border-black p-1.5 text-right w-16 font-black">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items || []).map((item, index) => (
              <tr key={index} className="border-b border-neutral-300">
                <td className="border border-black p-1.5 text-center font-mono text-neutral-600">{item.sr_no || index + 1}</td>
                <td className="border border-black p-1.5">
                  <p className="font-semibold text-neutral-900">{item.title}</p>
                  {item.sku && <p className="text-[9px] font-mono text-neutral-500">SKU: {item.sku}</p>}
                </td>
                <td className="border border-black p-1.5 text-center font-mono">{item.hsn || '9617'}</td>
                <td className="border border-black p-1.5 text-center font-bold">{item.quantity}</td>
                <td className="border border-black p-1.5 text-right font-mono">₹{Number(item.unit_price).toFixed(2)}</td>
                <td className="border border-black p-1.5 text-right font-mono">₹{Number(item.taxable_amount).toFixed(2)}</td>
                <td className="border border-black p-1.5 text-center font-mono">{item.tax_rate}%</td>
                {isIntraState ? (
                  <>
                    <td className="border border-black p-1.5 text-right font-mono">₹{Number(item.cgst || 0).toFixed(2)}</td>
                    <td className="border border-black p-1.5 text-right font-mono">₹{Number(item.sgst || 0).toFixed(2)}</td>
                  </>
                ) : (
                  <td className="border border-black p-1.5 text-right font-mono">₹{Number(item.igst || 0).toFixed(2)}</td>
                )}
                <td className="border border-black p-1.5 text-right font-mono font-bold">₹{Number(item.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Financial Summary & Amount in Words */}
        <div className="grid grid-cols-12 border border-black mb-3 text-[10px]">
          
          {/* Left Column: Words & Terms */}
          <div className="col-span-7 p-2.5 border-r border-black space-y-2.5">
            <div>
              <span className="text-neutral-500 font-semibold block uppercase text-[9px]">Invoice Value in Words:</span>
              <p className="font-bold italic text-neutral-900">
                {invoice.amount_in_words || 'Indian Rupees Zero Only'}
              </p>
            </div>

            <div className="border-t border-neutral-200 pt-2 space-y-1">
              <span className="text-neutral-500 font-semibold block uppercase text-[9px]">Terms &amp; Conditions:</span>
              <ul className="list-decimal pl-3.5 space-y-0.5 text-[9px] text-neutral-600">
                {termsLines.map((line, i) => (
                  <li key={i}>{line.replace(/^\d+\.\s*/, '')}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Calculations */}
          <div className="col-span-5 p-2.5 space-y-1.5 divide-y divide-neutral-200">
            <div className="space-y-1">
              <div className="flex justify-between text-neutral-700">
                <span>Total Taxable Value:</span>
                <span className="font-mono">₹{Number(invoice.subtotal_taxable || 0).toFixed(2)}</span>
              </div>

              {isIntraState ? (
                <>
                  <div className="flex justify-between text-neutral-700">
                    <span>CGST:</span>
                    <span className="font-mono">₹{Number(invoice.cgst_amount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-700">
                    <span>SGST:</span>
                    <span className="font-mono">₹{Number(invoice.sgst_amount || 0).toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-neutral-700">
                  <span>IGST:</span>
                  <span className="font-mono">₹{Number(invoice.igst_amount || 0).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-700">
                <span>Total Tax Included:</span>
                <span className="font-mono font-semibold">₹{Number(invoice.tax_amount || 0).toFixed(2)}</span>
              </div>

              {Number(invoice.discount_amount || 0) > 0 && (
                <div className="flex justify-between text-neutral-700">
                  <span>Discount:</span>
                  <span className="font-mono">- ₹{Number(invoice.discount_amount).toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center text-xs font-black text-black">
                <span>GRAND TOTAL (INR):</span>
                <span className="font-mono text-sm">₹{Number(invoice.grand_total || 0).toFixed(2)}</span>
              </div>
              <p className="text-[8px] text-neutral-500 text-right italic pt-0.5">* Inclusive of all GST taxes</p>
            </div>
          </div>

        </div>

        {/* Signatory Footer */}
        <div className="border border-black p-3 text-[10px]">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-0.5 text-[9px] text-neutral-500">
              <p className="font-bold text-neutral-700">Declaration:</p>
              <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
              <p className="italic pt-1">This is a computer-generated Tax Invoice and requires no physical signature.</p>
            </div>

            <div className="text-right space-y-8 min-w-[200px]">
              <p className="font-bold text-[10px] uppercase">For {seller.legalName}</p>
              <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-wider border-t border-black pt-1">
                Authorised Signatory
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Strict Print CSS */}
      <style jsx global>{`
        @media print {
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10pt !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }
          header, nav, footer, aside, .print\\:hidden, [role="banner"], [role="navigation"] {
            display: none !important;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      `}</style>
    </div>
  );
}
