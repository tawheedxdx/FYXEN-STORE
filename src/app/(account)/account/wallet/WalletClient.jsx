'use client';

import { useState } from 'react';
import { Wallet, Plus, Clock, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { createWalletRechargeOrder, verifyWalletRecharge } from './actions';

export default function WalletClient({ profile, transactions }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const quickAmounts = [100, 500, 1000, 2000];

  const handleRecharge = async (rechargeAmount) => {
    setError(null);
    setLoading(true);
    const res = await createWalletRechargeOrder(rechargeAmount);

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    // Razorpay Integration
    const options = {
      key: res.key,
      amount: res.amount,
      currency: 'INR',
      name: 'Fyxen Store',
      description: 'Wallet Recharge',
      order_id: res.rzpOrderId,
      prefill: { email: res.userEmail },
      theme: { color: '#000000' },
      handler: async (response) => {
        const verifyRes = await verifyWalletRecharge({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (verifyRes.success) {
          window.location.reload();
        } else {
          setError(verifyRes.error);
          setLoading(false);
        }
      },
      modal: {
        ondismiss: () => setLoading(false)
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="space-y-8">
      {/* Balance Card */}
      <div className="bg-primary-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <p className="text-primary-400 text-sm font-medium mb-1 uppercase tracking-wider">Available Balance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">₹{profile.wallet_balance.toFixed(2)}</span>
          </div>
        </div>
        <Wallet className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white/5 rotate-12" />
      </div>

      {/* Recharge Section */}
      <div className="bg-white dark:bg-primary-900/40 border border-primary-100 dark:border-white/5 p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-accent" />
          Recharge Wallet
        </h2>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium mb-6 border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => handleRecharge(amt)}
              disabled={loading}
              className="py-3 px-4 rounded-xl border border-primary-100 dark:border-white/10 hover:border-accent hover:bg-accent/5 transition-all font-bold text-primary-900 dark:text-white"
            >
              ₹{amt}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 font-bold">₹</span>
            <input
              type="number"
              placeholder="Enter custom amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-primary-100 dark:border-white/10 bg-transparent focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
            />
          </div>
          <button
            onClick={() => handleRecharge(Number(amount))}
            disabled={loading || !amount || amount <= 0}
            className="btn-primary px-8 flex items-center gap-2 whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Top Up'}
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-400" />
          Transaction History
        </h2>

        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-primary-400 bg-primary-50 dark:bg-white/5 rounded-2xl border border-dashed border-primary-200 dark:border-white/10">
              No transactions yet.
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-primary-900/20 border border-primary-50 dark:border-white/5 hover:border-primary-200 dark:hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-full ${
                    tx.amount > 0 
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-600' 
                      : 'bg-primary-50 dark:bg-white/5 text-primary-600 dark:text-primary-400'
                  }`}>
                    {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-primary-900 dark:text-white">{tx.description}</p>
                    <p className="text-xs text-primary-400">{new Date(tx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className={`font-bold text-lg ${tx.amount > 0 ? 'text-green-600' : 'text-primary-900 dark:text-white'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Script for Razorpay */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
    </div>
  );
}
