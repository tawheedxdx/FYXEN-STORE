'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createCheckoutSession, verifyPayment, validateCoupon, deleteOrder } from '@/app/(store)/checkout/actions';
import Script from 'next/script';
import { Loader2, Ticket, CheckCircle2, X, Star, CreditCard, Wallet, Gift } from 'lucide-react';
import PaymentSelectionModal from './PaymentSelectionModal';
import WalletRedemption from './WalletRedemption';
import OfferCountdown from '@/components/common/OfferCountdown';

export default function CheckoutForm({ subtotal, shipping, tax = 0, grandTotal: initialGrandTotal, profile, user, settings, offers = [], items = [] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rzpReady, setRzpReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDataObj, setFormDataObj] = useState(null);
  const paymentStatusRef = useRef('none'); // 'none', 'success', 'failed'
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  const applicableOffers = (offers || []).filter(offer => {
    const isSiteWide = !offer.eligible_product_ids || offer.eligible_product_ids.length === 0;
    if (isSiteWide) return true;
    return (items || []).some(item => offer.eligible_product_ids.includes(item.product_id));
  });

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [couponError, setCouponError] = useState(null);

  const [currentDiscount, setCurrentDiscount] = useState(0);
  
  // Wallet State
  const [walletDiscount, setWalletDiscount] = useState(0);

  const [finalGrandTotal, setFinalGrandTotal] = useState(initialGrandTotal);

  // PIN Code / Address Auto-fill State
  const [pinCode, setPinCode] = useState('');
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  const handlePinCodeChange = async (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPinCode(value);
    
    if (value.length < 6) {
      setCity('');
      setState('');
      setDeliveryInfo(null);
      setPinError(false);
      return;
    }

    if (value.length === 6) {
      setIsPinLoading(true);
      setPinError(false);
      setDeliveryInfo(null);

      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await response.json();

        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
          const firstOffice = data[0].PostOffice[0];
          setCity(firstOffice.District || firstOffice.Block || '');
          setState(firstOffice.State || '');
          
          // Calculate delivery dates (5 to 9 days after)
          const today = new Date();
          const minDelDate = new Date(today);
          minDelDate.setDate(today.getDate() + 5);
          const maxDelDate = new Date(today);
          maxDelDate.setDate(today.getDate() + 9);

          const minDateStr = minDelDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
          const maxDateStr = maxDelDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });

          setDeliveryInfo({
            available: true,
            estimate: `${minDateStr} - ${maxDateStr}`
          });
        } else {
          setPinError(true);
          setCity('');
          setState('');
        }
      } catch (err) {
        console.error('PIN code lookup failed:', err);
        setPinError(true);
        setCity('');
        setState('');
      } finally {
        setIsPinLoading(false);
      }
    }
  };

  useEffect(() => {
    setFinalGrandTotal(Math.max(0, subtotal - currentDiscount - walletDiscount + shipping + tax));
  }, [subtotal, currentDiscount, walletDiscount, shipping, tax]);

  async function handleApplyCoupon() {
    if (!couponCode) return;
    setIsValidating(true);
    setCouponError(null);
    
    const res = await validateCoupon(couponCode.toUpperCase(), subtotal);
    if (res.error) {
      setCouponError(res.error);
      setAppliedCoupon(null);
      setCurrentDiscount(0);
    } else {
      setAppliedCoupon(res.coupon);
      setCurrentDiscount(res.coupon.discountAmount);
      setCouponError(null);
    }
    setIsValidating(false);
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode('');
    setCurrentDiscount(0);
  }

  async function handlePayment(e) {
    e.preventDefault();
    if (!acceptedPolicies) {
      setError('Please accept the Terms & Conditions before placing your order.');
      return;
    }
    const formData = new FormData(e.target);
    
    // Add applied coupon code if any
    if (appliedCoupon) {
      formData.append('couponCode', appliedCoupon.code);
    }

    formData.append('acceptPolicies', 'true');
    setFormDataObj(formData);
    setIsModalOpen(true);
  }

  async function onConfirmPayment(method) {
    setIsModalOpen(false);
    setIsLoading(true);
    setError(null);
    paymentStatusRef.current = 'none';

    if (method === 'ONLINE' && !window.Razorpay) {
      setError('Payment gateway is still loading. Please wait a moment and try again.');
      setIsLoading(false);
      return;
    }

    const formData = formDataObj;
    formData.set('paymentMethod', method);

    // 1. Create order on backend
    const res = await createCheckoutSession(formData);

    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
      return;
    }

    if (method === 'COD') {
      paymentStatusRef.current = 'success';
      router.push(`/order/success?id=${res.orderId}`);
      return;
    }

    // ONLINE Flow
    if (!res?.key || !res?.rzpOrderId) {
      setError('Failed to initialize payment. Please refresh and try again.');
      setIsLoading(false);
      return;
    }

    // 2. Open Razorpay Checkout
    const options = {
      key: res.key,
      amount: res.amount,
      currency: 'INR',
      name: 'Fyxen',
      description: 'Premium Lifestyle Products',
      image: '/logo.png', 
      order_id: res.rzpOrderId,
      handler: async function (response) {
        paymentStatusRef.current = 'success';
        setIsLoading(true);
        // 3. Verify Payment on Backend
        const verifyRes = await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderId: res.orderId,
        });

        if (verifyRes.success) {
          router.push(`/order/success?id=${res.orderId}`);
        } else {
          router.push(`/order/failed?id=${res.orderId}`);
        }
      },
      prefill: {
        name: res.shippingInfo.full_name,
        email: res.userEmail,
        contact: res.shippingInfo.phone,
      },
      theme: {
        color: '#09090b',
      },
      modal: {
        ondismiss: async function () {
          setIsLoading(false);
          // If the user exited without success or failure, delete the order
          if (paymentStatusRef.current === 'none') {
            console.log('User exited payment. Deleting order:', res.orderId);
            await deleteOrder(res.orderId);
          }
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        console.error('Razorpay payment.failed:', response.error);
        paymentStatusRef.current = 'failed';
        setError(`Payment failed: ${response.error?.description || 'Unknown error'}. Order saved as pending.`);
        setIsLoading(false);
        router.push(`/order/failed?id=${res.orderId}`);
      });

      rzp.open();
    } catch (err) {
      console.error('Razorpay init error:', err);
      setError('Could not open payment window. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Load Razorpay script eagerly so it's ready before the user clicks Pay */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setRzpReady(true)}
        onError={() => setError('Failed to load payment gateway. Please refresh the page.')}
      />

      <form onSubmit={handlePayment} className="bg-white dark:bg-black p-6 md:p-8 rounded-xl border border-primary-200 dark:border-white/10 shadow-sm">
        <h2 className="text-xl font-bold mb-6 border-b border-primary-100 dark:border-white/10 pb-4">Shipping Information</h2>

        {error && (
          <div className="mb-6 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-2">Full Name *</label>
              <input 
                id="fullName" 
                name="fullName" 
                type="text" 
                required 
                defaultValue={profile?.full_name || ''}
                className="input-field" 
                placeholder="John Doe" 
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-2">Phone Number *</label>
              <input 
                id="phone" 
                name="phone" 
                type="tel" 
                required 
                defaultValue={profile?.phone || user?.phone || ''}
                className="input-field" 
                placeholder="9876543210" 
              />
            </div>
          </div>

          {/* PIN Code, City & State Auto-fill */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-2">PIN Code *</label>
              <div className="relative">
                <input 
                  id="postalCode" 
                  name="postalCode" 
                  type="text" 
                  required 
                  value={pinCode}
                  onChange={handlePinCodeChange}
                  className={`input-field pr-10 ${pinError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="400001" 
                  maxLength={6}
                />
                {isPinLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  </div>
                )}
              </div>
              {pinError && (
                <p className="text-xs text-red-500 font-bold mt-1.5 flex items-center gap-1">❌ Invalid PIN Code</p>
              )}
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-2">City *</label>
              <div className="relative">
                <input 
                  id="city" 
                  name="city" 
                  type="text" 
                  required 
                  readOnly
                  value={city}
                  className="input-field bg-primary-50 dark:bg-white/5 cursor-not-allowed select-none pr-10" 
                  placeholder="Auto-filled" 
                />
                {city && !pinError && !isPinLoading && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 font-bold text-sm">✓</span>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-2">State *</label>
              <div className="relative">
                <input 
                  id="state" 
                  name="state" 
                  type="text" 
                  required 
                  readOnly
                  value={state}
                  className="input-field bg-primary-50 dark:bg-white/5 cursor-not-allowed select-none pr-10" 
                  placeholder="Auto-filled" 
                />
                {state && !pinError && !isPinLoading && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 font-bold text-sm">✓</span>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Availability Info */}
          {deliveryInfo && (
            <div className="p-3.5 bg-green-500/5 dark:bg-green-500/10 border border-green-500/20 rounded-xl space-y-1 mt-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-green-700 dark:text-green-400">
                <span>✓ Delivery Available</span>
              </div>
              <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold">
                Estimated Delivery: <span className="font-bold text-primary-900 dark:text-white">{deliveryInfo.estimate}</span>
              </p>
            </div>
          )}

          {/* Detailed Address Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="houseNo" className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-2">House No. / Flat No. *</label>
              <input 
                id="houseNo" 
                name="houseNo" 
                type="text" 
                required 
                className="input-field" 
                placeholder="102, 1st Floor" 
              />
            </div>
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-2">Street / Area / Locality *</label>
              <input 
                id="street" 
                name="street" 
                type="text" 
                required 
                className="input-field" 
                placeholder="MG Road, Fort" 
              />
            </div>
          </div>

          <div>
            <label htmlFor="landmark" className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-2">Landmark (Optional)</label>
            <input 
              id="landmark" 
              name="landmark" 
              type="text" 
              className="input-field" 
              placeholder="Near SBI Bank" 
            />
          </div>
        </div>

        {/* Coupon Section */}
        <div className="mt-8 pt-6 border-t border-primary-100 dark:border-white/10">
          <label className="block text-sm font-medium text-primary-900 dark:text-primary-200 mb-2">Discount Coupon</label>
          
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-bold text-green-700 uppercase">{appliedCoupon.code} Applied</p>
                  <p className="text-xs text-green-600">Saved ₹{currentDiscount.toFixed(2)}</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={removeCoupon}
                className="p-1 hover:bg-green-100 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-green-700" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="input-field pl-10 uppercase" 
                    placeholder="Enter code (e.g. SAVE20)" 
                  />
                </div>
                <button 
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isValidating || !couponCode}
                  className="btn-outline px-6 disabled:opacity-50"
                >
                  {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                </button>
              </div>
              {couponError && (
                <p className="text-xs text-red-500 font-medium">{couponError}</p>
              )}
            </div>
          )}
        </div>

        <WalletRedemption 
          profile={profile}
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          currentDiscount={currentDiscount}
          loyaltyDiscount={0}
          onRedeem={(amt) => setWalletDiscount(amt)}
        />

        <div className="mt-10 pt-6 border-t border-primary-100 dark:border-white/10">
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm text-primary-500">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {currentDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Coupon Discount</span>
                <span>-₹{currentDiscount.toFixed(2)}</span>
              </div>
            )}
            {walletDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Wallet Payment</span>
                <span>-₹{walletDiscount.toFixed(2)}</span>
              </div>
            )}
            {tax > 0 && (
              <div className="flex justify-between text-sm text-primary-500">
                <span>Tax / GST</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-primary-500">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-primary-900 dark:text-white pt-2 border-t border-primary-50 dark:border-white/5">
              <span>Total Payable</span>
              <span>₹{finalGrandTotal.toFixed(2)}</span>
            </div>
            
            {/* Earnings Info */}
            <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10 mt-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary-900 dark:text-white mb-0.5">
                  Earn ₹{Math.floor(finalGrandTotal / 100) * 2} Wallet Cashback
                </p>
                <p className="text-xs text-primary-500 font-medium leading-relaxed">
                  Get 2% back on this order! Cashback is credited directly to your wallet upon successful delivery.
                </p>
              </div>
            </div>

            {/* Available Promotions & Giveaways */}
            {applicableOffers.length > 0 && (
              <div className="space-y-3 mb-6 p-5 bg-accent/5 rounded-2xl border border-accent/15 mt-6">
                <h3 className="text-sm font-bold text-primary-900 dark:text-primary-200 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-accent" /> Available Promotions & Giveaways
                </h3>
                <div className="space-y-3">
                  {applicableOffers.map(offer => {
                    const minAmount = Number(offer.min_purchase_amount || 0);
                    const isEligible = subtotal >= minAmount;
                    const missingAmount = minAmount - subtotal;

                    return (
                      <div 
                        key={offer.id} 
                        className={`p-3.5 rounded-xl border transition-all ${
                          isEligible 
                            ? 'bg-green-500/5 border-green-500/20 dark:border-green-500/10' 
                            : 'bg-primary-50/50 dark:bg-white/5 border-primary-100 dark:border-white/5 opacity-80'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {isEligible ? (
                            <div className="mt-0.5">
                              <input
                                id={`opted-offer-${offer.id}`}
                                name="opted_offers"
                                type="checkbox"
                                value={offer.id}
                                className="w-4.5 h-4.5 rounded border-primary-300 text-accent focus:ring-accent accent-accent cursor-pointer"
                              />
                            </div>
                          ) : (
                            <div className="mt-0.5 w-4.5 h-4.5 rounded border border-dashed border-primary-300 dark:border-white/20 flex items-center justify-center text-[10px] text-primary-400 shrink-0 select-none">
                              🔒
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <label 
                              htmlFor={isEligible ? `opted-offer-${offer.id}` : undefined} 
                              className={`block text-sm font-bold ${isEligible ? 'text-primary-900 dark:text-white cursor-pointer' : 'text-primary-500'}`}
                            >
                              {offer.title}
                            </label>
                            {offer.description && (
                              <p className="text-xs text-primary-500 mt-1 leading-relaxed">
                                {offer.description}
                              </p>
                            )}
                            <OfferCountdown endsAt={offer.ends_at} />
                            
                            {isEligible ? (
                              <span className="inline-block mt-2 text-[10px] font-bold text-green-700 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                                Eligible to Opt In!
                              </span>
                            ) : (
                              <div className="mt-2 text-xs font-semibold text-accent flex items-center gap-1.5">
                                <span>⚠️ Add ₹{missingAmount.toFixed(2)} to unlock this offer</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Policy Acceptance Checkbox */}
            <div className="space-y-3 mb-6 p-4 bg-primary-50/50 dark:bg-white/5 rounded-xl border border-primary-100 dark:border-white/5 mt-6">
              <div className="flex items-start gap-3">
                <input
                  id="acceptPolicies"
                  name="acceptPolicies"
                  type="checkbox"
                  checked={acceptedPolicies}
                  onChange={(e) => setAcceptedPolicies(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-primary-300 text-accent focus:ring-accent accent-accent cursor-pointer"
                  required
                />
                <label htmlFor="acceptPolicies" className="text-xs text-primary-600 dark:text-primary-400 select-none leading-relaxed cursor-pointer">
                  I have read and agree to the{' '}
                  <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-900 dark:text-white hover:underline transition-all">
                    Terms & Conditions
                  </a>
                  ,{' '}
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-900 dark:text-white hover:underline transition-all">
                    Privacy Policy
                  </a>
                  ,{' '}
                  <a href="/shipping-policy" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-900 dark:text-white hover:underline transition-all">
                    Shipping Policy
                  </a>
                  , and{' '}
                  <a href="/cancellation-refunds" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-900 dark:text-white hover:underline transition-all">
                    Cancellation & Refund Policy
                  </a>
                  .
                </label>
              </div>
              
              <p className="text-[11px] text-primary-500 leading-normal pl-7 border-t border-primary-100 dark:border-white/5 pt-2 mt-2">
                <span className="font-semibold text-primary-700 dark:text-primary-350">Note:</span> Returns for orders below ₹1,000 are subject to a ₹150 return processing fee, except where the product is damaged, defective, or incorrectly delivered by FYXEN.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !acceptedPolicies}
            className="btn-primary w-full text-lg py-4 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
              </span>
            ) : (
              `Confirm & Proceed`
            )}
          </button>
          <div className="flex flex-col items-center justify-center mt-6 pt-4 border-t border-primary-100 dark:border-white/5 space-y-3">
            <p className="text-[10px] font-bold text-primary-400 dark:text-primary-500 uppercase tracking-widest">Accepted Payment Methods</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* UPI */}
              <div className="flex items-center gap-1.5 bg-primary-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-primary-100 dark:border-white/10" title="UPI Payments">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 tracking-wider">UPI</span>
              </div>
              
              {/* Cards */}
              <div className="flex items-center gap-1.5 bg-primary-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-primary-100 dark:border-white/10" title="Credit / Debit Cards">
                <CreditCard className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[10px] font-bold text-primary-700 dark:text-primary-300">Cards</span>
              </div>

              {/* Net Banking */}
              <div className="flex items-center gap-1.5 bg-primary-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-primary-100 dark:border-white/10" title="Net Banking">
                <svg className="w-3.5 h-3.5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="10" width="20" height="12" rx="2" ry="2" />
                  <path d="M12 2L2 7h20L12 2z" />
                  <path d="M6 10v12" />
                  <path d="M10 10v12" />
                  <path d="M14 10v12" />
                  <path d="M18 10v12" />
                </svg>
                <span className="text-[10px] font-bold text-primary-700 dark:text-primary-300">Net Banking</span>
              </div>

              {/* Wallets */}
              <div className="flex items-center gap-1.5 bg-primary-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-primary-100 dark:border-white/10" title="Mobile Wallets">
                <Wallet className="w-3.5 h-3.5 text-teal-500" />
                <span className="text-[10px] font-bold text-primary-700 dark:text-primary-300">Wallets</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] text-primary-400 dark:text-primary-500 font-semibold mt-1">
              <span>🔒 100% Secure Checkout</span>
              <span>•</span>
              <span>⚡ Powered by Razorpay</span>
            </div>
          </div>
        </div>
      </form>

      <PaymentSelectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={onConfirmPayment}
        amount={finalGrandTotal}
        partialPaymentEnabled={settings?.partial_payment_enabled || false}
        partialPaymentPercentage={settings?.partial_payment_percentage || 10}
      />
    </>
  );
}

