'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Receipt, 
  Search, 
  Plus, 
  Printer, 
  TrendingUp, 
  Building2, 
  ShoppingBag, 
  Filter, 
  ExternalLink,
  Calendar,
  CheckCircle2,
  Phone,
  FileText
} from 'lucide-react';

export default function InvoicesClient({ initialInvoices = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'order' | 'manual'

  // Summary Metrics
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let totalTax = 0;
    let orderCount = 0;
    let manualCount = 0;

    initialInvoices.forEach(inv => {
      totalRevenue += Number(inv.grand_total) || 0;
      totalTax += Number(inv.tax_amount) || 0;
      if (inv.invoice_type === 'manual') manualCount++;
      else orderCount++;
    });

    return {
      totalInvoices: initialInvoices.length,
      totalRevenue,
      totalTax,
      orderCount,
      manualCount
    };
  }, [initialInvoices]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return initialInvoices.filter(inv => {
      if (filterType !== 'ALL' && inv.invoice_type !== filterType) {
        return false;
      }
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        inv.invoice_number?.toLowerCase().includes(q) ||
        inv.order_number?.toLowerCase().includes(q) ||
        inv.customer_name?.toLowerCase().includes(q) ||
        inv.customer_phone?.toLowerCase().includes(q) ||
        inv.customer_email?.toLowerCase().includes(q)
      );
    });
  }, [initialInvoices, searchQuery, filterType]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 dark:text-white flex items-center gap-3">
            <Receipt className="w-8 h-8 text-[#c6a87c]" />
            Invoice Manager
          </h1>
          <p className="text-primary-500 text-sm mt-1">
            Generate, manage, and print official GST Tax Invoices for website orders and external offline sales.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/invoices/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c6a87c] text-white text-xs font-bold hover:bg-[#b5966a] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Create Manual Invoice
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-primary-100 dark:border-neutral-800 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Total Invoices</span>
          <p className="text-2xl font-black text-neutral-900 dark:text-white">{metrics.totalInvoices}</p>
          <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1">
            <span>{metrics.orderCount} Orders</span>
            <span>•</span>
            <span>{metrics.manualCount} Manual</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-primary-100 dark:border-neutral-800 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Total Invoiced Billed</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ₹{metrics.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-neutral-500 pt-1">Gross sales inclusive of GST</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-primary-100 dark:border-neutral-800 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">GST Collected</span>
          <p className="text-2xl font-black text-[#c6a87c]">
            ₹{metrics.totalTax.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-neutral-500 pt-1">CGST + SGST + IGST liability</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-primary-100 dark:border-neutral-800 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Parent Legal Entity</span>
          <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">Bytread International Pvt Ltd</p>
          <p className="text-[10px] font-mono text-neutral-500 pt-1">Brand: FYXEN | Jangipur, WB</p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-primary-100 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Invoice #, Order ID, Customer Name, Phone..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#c6a87c]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 self-start md:self-auto overflow-x-auto">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'ALL'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            All Invoices ({initialInvoices.length})
          </button>
          <button
            onClick={() => setFilterType('order')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'order'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Website Orders ({metrics.orderCount})
          </button>
          <button
            onClick={() => setFilterType('manual')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'manual'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> Manual / Offline ({metrics.manualCount})
          </button>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-primary-100 dark:border-neutral-800 shadow-xs overflow-hidden">
        {filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-primary-100 dark:border-neutral-800 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                <tr>
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Source / Order #</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 text-right">Taxable (₹)</th>
                  <th className="p-4 text-right">Total (₹)</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-50 dark:divide-neutral-800/50">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-neutral-950 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <Receipt className="w-3.5 h-3.5 text-[#c6a87c]" />
                        <span>{inv.invoice_number}</span>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-500 whitespace-nowrap">
                      {new Date(inv.invoice_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      {inv.invoice_type === 'manual' ? (
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold uppercase text-[9px] tracking-wider">
                          Offline / Manual
                        </span>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold uppercase text-[9px] tracking-wider">
                            Store Order
                          </span>
                          <p className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400">#{inv.order_number}</p>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-neutral-900 dark:text-white">{inv.customer_name}</p>
                      <p className="text-[11px] text-neutral-500">{inv.customer_phone}</p>
                      {inv.place_of_supply && (
                        <p className="text-[10px] text-neutral-400">{inv.place_of_supply}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-neutral-800 dark:text-neutral-200 uppercase text-[11px]">
                          {inv.payment_method || 'Online'}
                        </span>
                        <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                          {inv.payment_status || 'PAID'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono text-neutral-600 dark:text-neutral-400">
                      ₹{Number(inv.subtotal_taxable || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-neutral-950 dark:text-white text-sm">
                      ₹{Number(inv.grand_total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-center">
                      <Link
                        href={`/invoice/${encodeURIComponent(inv.invoice_number)}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 font-bold text-neutral-900 dark:text-white text-xs transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                        <ExternalLink className="w-3 h-3 opacity-50" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center space-y-3">
            <Receipt className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">No invoices found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Invoices will automatically appear here once generated for confirmed orders, or when you create a manual invoice.
            </p>
            <Link
              href="/admin/invoices/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold"
            >
              <Plus className="w-4 h-4" /> Create Manual Invoice
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
