'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Search, Download, Copy, Trash2, Check, UserPlus, Sparkles, Loader2, Tag, Calendar, CheckCircle2, X } from 'lucide-react';
import { adminDeleteSubscriber, adminAddSubscriber } from './actions';

export default function SubscribersClient({ initialSubscribers = [] }) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSingle, setCopiedSingle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Filter subscribers
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((s) =>
      !searchQuery || s.email.toLowerCase().includes(searchQuery.toLowerCase()) || (s.source && s.source.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [subscribers, searchQuery]);

  const totalCount = subscribers.length;

  const handleCopyAll = () => {
    const emailList = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emailList);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleCopySingle = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedSingle(email);
    setTimeout(() => setCopiedSingle(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['Email', 'Source', 'Discount Code', 'Status', 'Date Subscribed'];
    const rows = subscribers.map((s) => [
      s.email,
      s.source || 'homepage_vip_club',
      s.discount_code || 'WELCOME10',
      s.status || 'active',
      new Date(s.created_at).toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `fyxen_vip_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append('email', newEmail);
    formData.append('source', 'admin_portal');

    const res = await adminAddSubscriber(formData);
    if (res?.error) {
      setFeedback({ type: 'error', text: res.error });
    } else {
      setFeedback({ type: 'success', text: 'VIP subscriber added successfully!' });
      setSubscribers([
        {
          id: 'temp-' + Date.now(),
          email: newEmail.toLowerCase().trim(),
          source: 'admin_portal',
          discount_code: 'WELCOME10',
          status: 'active',
          created_at: new Date().toISOString(),
        },
        ...subscribers,
      ]);
      setNewEmail('');
      setTimeout(() => {
        setIsModalOpen(false);
        setFeedback(null);
      }, 1000);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id, email) => {
    if (!confirm(`Are you sure you want to remove ${email} from VIP subscribers?`)) return;

    setDeletingId(id || email);
    const res = await adminDeleteSubscriber(id, email);
    if (res?.error) {
      alert(res.error);
    } else {
      setSubscribers(subscribers.filter((s) => s.id !== id && s.email !== email));
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[#c6a87c]" />
            <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
              VIP Club Subscribers
            </h1>
          </div>
          <p className="text-sm text-neutral-500">
            Emails collected from the &apos;FYXEN VIP Club - 10% Off First Order&apos; section.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyAll}
            disabled={totalCount === 0}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-bold text-neutral-800 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            title="Copy all email addresses"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied {totalCount} Emails!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-500" /> Copy All Emails
              </>
            )}
          </button>

          <button
            onClick={handleExportCSV}
            disabled={totalCount === 0}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-bold text-neutral-800 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            title="Export CSV list"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" /> Export CSV
          </button>

          <button
            onClick={() => {
              setFeedback(null);
              setIsModalOpen(true);
            }}
            className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Add Subscriber
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-neutral-900/60 p-6 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total VIP Subscribers</p>
          <p className="text-3xl font-black text-neutral-950 dark:text-white mt-2">{totalCount}</p>
          <p className="text-xs text-neutral-500 mt-1">Direct opt-ins via website</p>
        </div>

        <div className="bg-white dark:bg-neutral-900/60 p-6 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Active Discount Code</p>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-2xl font-black font-mono text-[#c6a87c]">WELCOME10</p>
            <span className="text-[10px] font-bold bg-[#c6a87c]/10 text-[#c6a87c] px-2 py-0.5 rounded-md">
              10% OFF
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Given upon email submission</p>
        </div>

        <div className="bg-white dark:bg-neutral-900/60 p-6 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Audience Status</p>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">100%</p>
          <p className="text-xs text-neutral-500 mt-1">Active verified email subscribers</p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white dark:bg-neutral-900/60 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search email or source..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
        </div>
        <p className="text-xs text-neutral-400 self-end md:self-auto">
          Showing {filteredSubscribers.length} of {totalCount} subscriber{totalCount !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white dark:bg-neutral-900/60 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-xs">
        {filteredSubscribers.length === 0 ? (
          <div className="p-16 text-center">
            <Mail className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">No subscribers found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
              {searchQuery
                ? 'Try a different search term.'
                : 'When users submit their email on the homepage VIP section, they will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-950/60 border-b border-neutral-200/80 dark:border-neutral-800 text-neutral-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Subscriber Email</th>
                  <th className="py-3.5 px-5">Source</th>
                  <th className="py-3.5 px-5">Promo Code</th>
                  <th className="py-3.5 px-5">Joined Date</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-neutral-700 dark:text-neutral-300">
                {filteredSubscribers.map((sub, idx) => (
                  <tr key={sub.id || idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/30 transition-colors">
                    {/* Email */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-950 dark:text-white">{sub.email}</span>
                        <button
                          onClick={() => handleCopySingle(sub.email)}
                          className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-md transition-colors"
                          title="Copy email"
                        >
                          {copiedSingle === sub.email ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Source */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#c6a87c] bg-[#c6a87c]/10 px-2.5 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        {sub.source === 'homepage_vip_club' ? 'Homepage VIP Club' : sub.source || 'VIP Opt-in'}
                      </span>
                    </td>

                    {/* Promo Code */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="font-mono font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md text-[11px]">
                        {sub.discount_code || 'WELCOME10'}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-5 whitespace-nowrap text-neutral-500 text-[11px]">
                      {new Date(sub.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    </td>

                    {/* Delete */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(sub.id, sub.email)}
                        disabled={deletingId === (sub.id || sub.email)}
                        className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                        title="Remove subscriber"
                      >
                        {deletingId === (sub.id || sub.email) ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Subscriber Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0c0c0e] rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 z-10"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#c6a87c]" />
                  <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                    Add VIP Subscriber
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-950 dark:hover:text-white rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                </div>

                {feedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold ${
                      feedback.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    {feedback.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Save VIP Subscriber
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
