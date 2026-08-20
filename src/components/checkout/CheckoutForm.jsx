'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createCheckoutSession, verifyPayment, validateCoupon, deleteOrder } from '@/app/(store)/checkout/actions';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Ticket, CheckCircle2, X, Star, CreditCard, Wallet, Gift, 
  Truck, Zap, UserCheck, ShieldCheck, ArrowRight, AlertTriangle, Check, Lock, MapPin
} from 'lucide-react';
import WalletRedemption from './WalletRedemption';
import OfferCountdown from '@/components/common/OfferCountdown';

export default function CheckoutForm({ 
  subtotal, 
  tax = 0, 
  profile, 
  user, 
  settings, 
  offers = [], 
  items = [] 
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rzpReady, setRzpReady] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const paymentStatusRef = useRef('none'); // 'none', 'success', 'failed'

  // Delivery Type Selection ('standard' | 'express' | 'founder')
  const [deliveryType, setDeliveryType] = useState('standard');

  // Payment Mode Selection ('ONLINE' | 'COD')
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');

  // COD Slider Ref & Width
  const trackRef = useRef(null);
  const [maxDrag, setMaxDrag] = useState(0);

  // Settings Configuration Values
  const founderDeliveryEnabled = settings?.founder_delivery_enabled ?? true;
  const founderDeliveryFee = Number(settings?.founder_delivery_fee ?? 10000);
  const standardDeliveryFee = Number(settings?.standard_delivery_fee ?? 30);
  const freeShippingThreshold = Number(settings?.standard_delivery_free_threshold ?? 499);
  const expressDeliveryFee = Number(settings?.express_delivery_fee ?? 50);
  const codComplianceFee = Number(settings?.cod_compliance_fee ?? 15);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const [currentDiscount, setCurrentDiscount] = useState(0);
  
  // Wallet State
  const [walletDiscount, setWalletDiscount] = useState(0);

  // Address & Pincode Auto-fill
  const [pinCode, setPinCode] = useState('');
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  // Form input refs/state for address
  const formRef = useRef(null);

  // Offers
  const applicableOffers = useMemo(() => {
    return (offers || []).filter(offer => {
      const isSiteWide = !offer.eligible_product_ids || offer.eligible_product_ids.length === 0;
      if (isSiteWide) return true;
      return (items || []).some(item => offer.eligible_product_ids.includes(item.product_id));
    });
  }, [offers, items]);

  // Determine if location is in Kolkata
  const isKolkataLocation = useMemo(() => {
    const c = (city || '').toLowerCase().trim();
    const s = (state || '').toLowerCase().trim();
    const p = (pinCode || '').trim();
    if (!c && !p) return false;
    return (
      c.includes('kolkata') ||
      c.includes('calcutta') ||
      (s.includes('west bengal') && (c.includes('howrah') || c.includes('salt lake') || c.includes('new town') || c.includes('bidhannagar'))) ||
      p.startsWith('700') ||
      p.startsWith('711')
    );
  }, [city, state, pinCode]);

  // Delivery Fee Calculation
  const deliveryFee = useMemo(() => {
    if (deliveryType === 'founder') {
      return founderDeliveryFee;
    }
    if (deliveryType === 'express') {
      return expressDeliveryFee;
    }
    // Standard Delivery
    return subtotal >= freeShippingThreshold ? 0 : standardDeliveryFee;
  }, [deliveryType, subtotal, founderDeliveryFee, expressDeliveryFee, freeShippingThreshold, standardDeliveryFee]);

  // COD Fee
  const currentCodFee = useMemo(() => {
    return paymentMethod === 'COD' ? codComplianceFee : 0;
  }, [paymentMethod, codComplianceFee]);

  // Total Calculation
  const finalGrandTotal = useMemo(() => {
    return Math.max(0, subtotal - currentDiscount - walletDiscount + deliveryFee + tax + currentCodFee);
  }, [subtotal, currentDiscount, walletDiscount, deliveryFee, tax, currentCodFee]);

  // Measure Slider Track Width
  useEffect(() => {
    if (paymentMethod === 'COD' && trackRef.current) {
      const updateSliderWidth = () => {
        if (trackRef.current) {
          const trackWidth = trackRef.current.offsetWidth;
          setMaxDrag(Math.max(0, trackWidth - 60 - 8));
        }
      };
      updateSliderWidth();
      window.addEventListener('resize', updateSliderWidth);
      return () => window.removeEventListener('resize', updateSliderWidth);
    }
  }, [paymentMethod]);

  // Handle Delivery Type Change
  const handleDeliveryTypeChange = (type) => {
    setDeliveryType(type);
    if (type === 'founder') {
      // Founder delivery must be Prepaid
      setPaymentMethod('ONLINE');
    }
  };

  // Handle PIN Code Auto-Lookup
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
          const fetchedCity = firstOffice.District || firstOffice.Block || firstOffice.Name || '';
          const fetchedState = firstOffice.State || '';
          setCity(fetchedCity);
          setState(fetchedState);
          
          // Estimate delivery based on type
          const today = new Date();
          const minDelDate = new Date(today);
          const maxDelDate = new Date(today);

          if (deliveryType === 'express') {
            minDelDate.setDate(today.getDate() + 2);
            maxDelDate.setDate(today.getDate() + 5);
          } else {
            minDelDate.setDate(today.getDate() + 3);
            maxDelDate.setDate(today.getDate() + 7);
          }

          const minDateStr = minDelDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
          const maxDateStr = maxDelDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

          setDeliveryInfo({
            available: true,
            estimate: `${minDateStr} – ${maxDateStr}`
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

  // Coupon Handlers
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

  // Validate Form Data Helper
  const validateFormAndGetFormData = () => {
    if (!formRef.current) return null;
    const formElement = formRef.current;
    
    if (!formElement.checkValidity()) {
      formElement.reportValidity();
      return null;
    }

    if (!acceptedPolicies) {
      setError('Please accept the Terms & Conditions and Policies before placing your order.');
      return null;
    }

    if (deliveryType === 'founder') {
      if (!isKolkataLocation) {
        setError('Hand Delivered By Founder is strictly available for Kolkata delivery addresses only. Please choose Standard / Express Delivery or enter a Kolkata address.');
        return null;
      }
      if (paymentMethod === 'COD') {
        setError('COD is not available for Hand Delivered By Founder. Please select Prepaid (Online).');
        return null;
      }
    }

    const formData = new FormData(formElement);
    formData.set('deliveryType', deliveryType);
    formData.set('paymentMethod', paymentMethod);
    formData.set('acceptPolicies', 'true');
    formData.set('city', city);
    formData.set('state', state);
    formData.set('postalCode', pinCode);

    if (appliedCoupon) {
      formData.set('couponCode', appliedCoupon.code);
    }

    return formData;
  };

  // Online Payment via Razorpay
  async function handleOnlinePaymentSubmit(e) {
    if (e) e.preventDefault();
    setError(null);

    const formData = validateFormAndGetFormData();
    if (!formData) return;

    if (!window.Razorpay) {
      setError('Payment gateway is still initializing. Please wait a moment and try again.');
      return;
    }

    setIsLoading(true);
    paymentStatusRef.current = 'none';

    // 1. Create order on backend
    const res = await createCheckoutSession(formData);

    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
      return;
    }

    if (!res?.key || !res?.rzpOrderId) {
      setError('Failed to initialize Razorpay payment. Please refresh and try again.');
      setIsLoading(false);
      return;
    }

    // 2. Open Razorpay Gateway
    const options = {
      key: res.key,
      amount: res.amount,
      currency: 'INR',
      name: 'FYXEN',
      description: deliveryType === 'founder' ? 'VIP Founder Hand Delivery Order' : 'Premium Lifestyle Order',
      image: '/logo.png', 
      order_id: res.rzpOrderId,
      handler: async function (response) {
        paymentStatusRef.current = 'success';
        setIsLoading(true);
        // 3. Verify Payment
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
        color: '#c6a87c',
      },
      modal: {
        ondismiss: async function () {
          setIsLoading(false);
          if (paymentStatusRef.current === 'none') {
            console.log('Payment modal dismissed. Deleting unconfirmed order:', res.orderId);
            await deleteOrder(res.orderId);
          }
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        console.error('Razorpay payment failed:', response.error);
        paymentStatusRef.current = 'failed';
        setError(`Payment failed: ${response.error?.description || 'Transaction unsuccessful'}.`);
        setIsLoading(false);
        router.push(`/order/failed?id=${res.orderId}`);
      });

      rzp.open();
    } catch (err) {
      console.error('Razorpay invocation error:', err);
      setError('Could not open payment window. Please try again.');
      setIsLoading(false);
    }
  }

  // COD Slide to Confirm Handler
  async function handleCodSlideConfirm(event, info) {
    if (isLoading) return;
    
    // Check if dragged at least 80%
    if (info.offset.x >= maxDrag * 0.8) {
      setError(null);
      const formData = validateFormAndGetFormData();
      if (!formData) return;

      setIsLoading(true);
      const res = await createCheckoutSession(formData);

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
        return;
      }

      if (res?.success) {
        router.push(`/order/success?id=${res.orderId}`);
      }
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setRzpReady(true)}
        onError={() => setError('Failed to load payment gateway. Please refresh the page.')}
      />

      <form 
        ref={formRef} 
        onSubmit={(e) => {
          e.preventDefault();
          if (paymentMethod === 'ONLINE') {
            handleOnlinePaymentSubmit(e);
          }
        }} 
        className="bg-white dark:bg-[#0c0c0e] p-6 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-8"
      >
        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 rounded-2xl text-xs font-semibold flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. SHIPPING ADDRESS */}
        <div>
          <div className="flex items-center gap-2 mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <MapPin className="w-5 h-5 text-[#c6a87c]" />
            <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight">
              1. Delivery Address
            </h2>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Full Name *
                </label>
                <input 
                  id="fullName" 
                  name="fullName" 
                  type="text" 
                  required 
                  defaultValue={profile?.full_name || ''}
                  className="input-field text-xs" 
                  placeholder="John Doe" 
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Phone Number *
                </label>
                <input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  required 
                  defaultValue={profile?.phone || user?.phone || ''}
                  className="input-field text-xs" 
                  placeholder="9876543210" 
                />
              </div>
            </div>

            {/* PIN Code, City & State Auto-fill */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div>
                <label htmlFor="postalCode" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                  PIN Code *
                </label>
                <div className="relative">
                  <input 
                    id="postalCode" 
                    name="postalCode" 
                    type="text" 
                    required 
                    value={pinCode}
                    onChange={handlePinCodeChange}
                    className={`input-field text-xs pr-10 ${pinError ? 'border-rose-500 focus:ring-rose-500' : ''}`}
                    placeholder="700001 or 400001" 
                    maxLength={6}
                  />
                  {isPinLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#c6a87c]" />
                    </div>
                  )}
                </div>
                {pinError && (
                  <p className="text-[11px] text-rose-500 font-bold mt-1">Invalid PIN code</p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                  City *
                </label>
                <input 
                  id="city" 
                  name="city" 
                  type="text" 
                  required 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="input-field text-xs bg-neutral-50 dark:bg-neutral-900" 
                  placeholder="Enter city (or auto-fill)" 
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                  State *
                </label>
                <input 
                  id="state" 
                  name="state" 
                  type="text" 
                  required 
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="input-field text-xs bg-neutral-50 dark:bg-neutral-900" 
                  placeholder="Enter state (or auto-fill)" 
                />
              </div>
            </div>

            {/* Detailed Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="houseNo" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                  House / Flat / Building No. *
                </label>
                <input 
                  id="houseNo" 
                  name="houseNo" 
                  type="text" 
                  required 
                  className="input-field text-xs" 
                  placeholder="Apt 4B, Silver Oak" 
                />
              </div>
              <div>
                <label htmlFor="street" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Street / Area / Locality *
                </label>
                <input 
                  id="street" 
                  name="street" 
                  type="text" 
                  required 
                  className="input-field text-xs" 
                  placeholder="Park Street, Elgin" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="landmark" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Landmark (Optional)
              </label>
              <input 
                id="landmark" 
                name="landmark" 
                type="text" 
                className="input-field text-xs" 
                placeholder="Opposite City Mall" 
              />
            </div>
          </div>
        </div>

        {/* 2. DELIVERY TYPE SELECTION */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#c6a87c]" />
              <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight">
                2. Choose Delivery Type
              </h2>
            </div>
            <span className="text-[11px] text-neutral-400 font-medium">Select speed & service</span>
          </div>

          <div className="space-y-3">
            {/* Standard Delivery */}
            <label 
              onClick={() => handleDeliveryTypeChange('standard')}
              className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                deliveryType === 'standard'
                  ? 'border-neutral-950 dark:border-white bg-neutral-50/70 dark:bg-neutral-900/80 shadow-xs'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <input 
                type="radio" 
                name="deliveryTypeRadio" 
                value="standard"
                checked={deliveryType === 'standard'}
                onChange={() => handleDeliveryTypeChange('standard')}
                className="mt-1 w-4 h-4 text-neutral-950 dark:text-white focus:ring-neutral-950 accent-neutral-950 dark:accent-white" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-950 dark:text-white">Standard Delivery</span>
                    <span className="text-[10px] font-bold text-neutral-500 bg-neutral-200/60 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
                      3–7 Days
                    </span>
                  </div>
                  <span className="text-sm font-black text-neutral-950 dark:text-white">
                    {subtotal >= freeShippingThreshold ? (
                      <span className="text-emerald-600 font-bold uppercase">FREE</span>
                    ) : (
                      `₹${standardDeliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  {subtotal >= freeShippingThreshold
                    ? 'Eligible for Free Standard Shipping (orders above ₹' + freeShippingThreshold + ')'
                    : `Flat ₹${standardDeliveryFee} shipping fee for orders below ₹${freeShippingThreshold}.`}
                </p>
              </div>
            </label>

            {/* Express Delivery */}
            <label 
              onClick={() => handleDeliveryTypeChange('express')}
              className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                deliveryType === 'express'
                  ? 'border-neutral-950 dark:border-white bg-neutral-50/70 dark:bg-neutral-900/80 shadow-xs'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <input 
                type="radio" 
                name="deliveryTypeRadio" 
                value="express"
                checked={deliveryType === 'express'}
                onChange={() => handleDeliveryTypeChange('express')}
                className="mt-1 w-4 h-4 text-neutral-950 dark:text-white focus:ring-neutral-950 accent-neutral-950 dark:accent-white" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-950 dark:text-white flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Express Delivery
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      2–5 Days
                    </span>
                  </div>
                  <span className="text-sm font-black text-neutral-950 dark:text-white">
                    ₹{expressDeliveryFee.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Priority packing and expedited air courier transit for faster doorstep delivery.
                </p>
              </div>
            </label>

            {/* Hand Delivered By Founder */}
            {founderDeliveryEnabled && (
              <div className="relative">
                <label 
                  onClick={() => handleDeliveryTypeChange('founder')}
                  className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                    deliveryType === 'founder'
                      ? 'border-[#c6a87c] bg-[#c6a87c]/5 dark:bg-[#c6a87c]/10 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-[#c6a87c]/50'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="deliveryTypeRadio" 
                    value="founder"
                    checked={deliveryType === 'founder'}
                    onChange={() => handleDeliveryTypeChange('founder')}
                    className="mt-1 w-4 h-4 text-[#c6a87c] focus:ring-[#c6a87c] accent-[#c6a87c]" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-neutral-950 dark:text-white flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-[#c6a87c]" /> Hand Delivered By Founder
                        </span>
                        <span className="text-[10px] font-bold text-[#c6a87c] bg-[#c6a87c]/15 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Applicable in Kolkata Only
                        </span>
                      </div>
                      <span className="text-sm font-black text-[#c6a87c]">
                        ₹{founderDeliveryFee.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1.5 leading-relaxed">
                      Exclusive in-hand VIP delivery and product consultation directly by the FYXEN Founder in Kolkata. (Requires Prepaid Online Payment).
                    </p>
                  </div>
                </label>

                {/* Location Guard for Founder Delivery */}
                {deliveryType === 'founder' && (
                  <div className="mt-2.5">
                    {city || pinCode ? (
                      isKolkataLocation ? (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Kolkata location verified for Founder In-Hand Delivery.</span>
                        </div>
                      ) : (
                        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                          <span>
                            <strong>Outside Kolkata:</strong> Hand Delivered By Founder is strictly available for Kolkata only. Please switch to Standard or Express Delivery.
                          </span>
                        </div>
                      )
                    ) : (
                      <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-700 dark:text-amber-400">
                        Please enter your Kolkata PIN code or address above to verify eligibility.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 3. PAYMENT MODE SELECTION */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#c6a87c]" />
              <h2 className="text-xl font-black text-neutral-950 dark:text-white tracking-tight">
                3. Choose Payment Mode
              </h2>
            </div>
            <span className="text-[11px] text-neutral-400 font-medium">Prepaid vs Postpaid</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Prepaid (Online) */}
            <label
              onClick={() => setPaymentMethod('ONLINE')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                paymentMethod === 'ONLINE'
                  ? 'border-neutral-950 dark:border-white bg-neutral-50/70 dark:bg-neutral-900/80 shadow-xs'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="paymentMethodRadio" 
                      value="ONLINE"
                      checked={paymentMethod === 'ONLINE'}
                      onChange={() => setPaymentMethod('ONLINE')}
                      className="w-4 h-4 text-neutral-950 dark:text-white focus:ring-neutral-950 accent-neutral-950 dark:accent-white" 
                    />
                    <span className="font-bold text-sm text-neutral-950 dark:text-white">Prepaid (Online)</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                    Zero Extra Fee
                  </span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed pl-6">
                  Fast, 100% encrypted checkout via UPI, Cards, Net Banking & Wallets.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center gap-2 pl-6">
                <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">UPI</span>
                <span className="text-[9px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">Cards</span>
                <span className="text-[9px] font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">Net Banking</span>
              </div>
            </label>

            {/* COD (Cash on Delivery) */}
            <label
              onClick={() => {
                if (deliveryType === 'founder') return;
                setPaymentMethod('COD');
              }}
              className={`p-4 rounded-2xl border-2 transition-all select-none flex flex-col justify-between ${
                deliveryType === 'founder'
                  ? 'opacity-40 cursor-not-allowed border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900'
                  : paymentMethod === 'COD'
                    ? 'border-neutral-950 dark:border-white bg-neutral-50/70 dark:bg-neutral-900/80 shadow-xs cursor-pointer'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="paymentMethodRadio" 
                      value="COD"
                      disabled={deliveryType === 'founder'}
                      checked={paymentMethod === 'COD'}
                      onChange={() => {
                        if (deliveryType !== 'founder') setPaymentMethod('COD');
                      }}
                      className="w-4 h-4 text-neutral-950 dark:text-white focus:ring-neutral-950 accent-neutral-950 dark:accent-white" 
                    />
                    <span className="font-bold text-sm text-neutral-950 dark:text-white">COD (Postpaid)</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    +₹{codComplianceFee} Fee
                  </span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed pl-6">
                  {deliveryType === 'founder'
                    ? 'COD is disabled for Founder Hand Delivery. Please use Prepaid.'
                    : `Pay in cash or UPI at delivery. Extra ₹${codComplianceFee} COD compliance & verification fee is added.`}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between pl-6">
                <span className="text-[10px] font-bold text-neutral-400 flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Doorstep Payment
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                  +₹{codComplianceFee}.00
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* 4. COUPON & WALLET REDEMPTION */}
        <div className="space-y-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          {/* Coupon */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Discount Coupon
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider font-mono">
                      {appliedCoupon.code} Applied
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Saved ₹{currentDiscount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={removeCoupon}
                  className="p-1.5 hover:bg-emerald-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4 text-emerald-700" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="input-field text-xs pl-10 uppercase font-mono font-bold" 
                      placeholder="e.g. WELCOME10" 
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isValidating || !couponCode}
                    className="btn-outline px-6 text-xs font-bold disabled:opacity-50 cursor-pointer"
                  >
                    {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-rose-500 font-bold">{couponError}</p>
                )}
              </div>
            )}
          </div>

          {/* Wallet */}
          <WalletRedemption 
            profile={profile}
            subtotal={subtotal}
            shipping={deliveryFee}
            tax={tax}
            currentDiscount={currentDiscount}
            loyaltyDiscount={0}
            onRedeem={(amt) => setWalletDiscount(amt)}
          />
        </div>

        {/* 5. PROMOTIONS & GIVEAWAYS OPT-IN */}
        {applicableOffers.length > 0 && (
          <div className="space-y-3 p-5 bg-neutral-50 dark:bg-neutral-900/60 rounded-3xl border border-neutral-200/80 dark:border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#c6a87c]" /> Available Promotions & Giveaways
            </h3>
            <div className="space-y-3">
              {applicableOffers.map(offer => {
                const minAmount = Number(offer.min_purchase_amount || 0);
                const isEligible = subtotal >= minAmount;
                const missingAmount = minAmount - subtotal;

                return (
                  <div 
                    key={offer.id} 
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isEligible 
                        ? 'bg-white dark:bg-black/60 border-neutral-200/80 dark:border-neutral-800' 
                        : 'bg-neutral-100/50 dark:bg-neutral-950/40 border-dashed border-neutral-200 dark:border-neutral-800 opacity-70'
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
                            className="w-4 h-4 rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950 accent-neutral-950 cursor-pointer"
                          />
                        </div>
                      ) : (
                        <div className="mt-0.5 w-4 h-4 rounded border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[10px] text-neutral-400 shrink-0">
                          🔒
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <label 
                          htmlFor={isEligible ? `opted-offer-${offer.id}` : undefined} 
                          className={`block text-xs font-bold ${isEligible ? 'text-neutral-950 dark:text-white cursor-pointer' : 'text-neutral-500'}`}
                        >
                          {offer.title}
                        </label>
                        {offer.description && (
                          <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                            {offer.description}
                          </p>
                        )}
                        <OfferCountdown endsAt={offer.ends_at} />
                        
                        {isEligible ? (
                          <span className="inline-block mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                            Eligible to Claim
                          </span>
                        ) : (
                          <div className="mt-1.5 text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                            <span>Add ₹{missingAmount.toFixed(2)} to unlock</span>
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

        {/* 6. POLICY AGREEMENT CHECKBOX */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 space-y-2">
          <div className="flex items-start gap-3">
            <input
              id="acceptPolicies"
              name="acceptPolicies"
              type="checkbox"
              checked={acceptedPolicies}
              onChange={(e) => setAcceptedPolicies(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950 accent-neutral-950 cursor-pointer"
              required
            />
            <label htmlFor="acceptPolicies" className="text-xs text-neutral-600 dark:text-neutral-400 select-none leading-relaxed cursor-pointer">
              I agree to the{' '}
              <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="font-bold text-neutral-950 dark:text-white hover:underline">
                Terms & Conditions
              </a>
              ,{' '}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-bold text-neutral-950 dark:text-white hover:underline">
                Privacy Policy
              </a>
              , and{' '}
              <a href="/shipping-policy" target="_blank" rel="noopener noreferrer" className="font-bold text-neutral-950 dark:text-white hover:underline">
                Shipping Policy
              </a>
              .
            </label>
          </div>
        </div>

        {/* 7. DETAILED PRICE BREAKDOWN & FINAL TOTAL */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-neutral-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
          </div>

          {currentDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Coupon Discount</span>
              <span>-₹{currentDiscount.toFixed(2)}</span>
            </div>
          )}

          {walletDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Wallet Redemption</span>
              <span>-₹{walletDiscount.toFixed(2)}</span>
            </div>
          )}

          {tax > 0 && (
            <div className="flex justify-between">
              <span>Tax / GST</span>
              <span className="font-bold text-neutral-900 dark:text-white">₹{tax.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>
              Delivery Fee ({deliveryType === 'standard' ? 'Standard' : deliveryType === 'express' ? 'Express' : 'Founder In-Hand'})
            </span>
            <span className="font-bold text-neutral-900 dark:text-white">
              {deliveryFee === 0 ? (
                <span className="text-emerald-600 font-bold uppercase">FREE</span>
              ) : (
                `₹${deliveryFee.toFixed(2)}`
              )}
            </span>
          </div>

          {paymentMethod === 'COD' && (
            <div className="flex justify-between text-amber-700 dark:text-amber-400 font-bold">
              <span>COD Compliance & Handling Fee</span>
              <span>+₹{codComplianceFee.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-lg font-black text-neutral-950 dark:text-white pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <span>Total Amount</span>
            <span className="text-2xl font-black text-[#c6a87c]">₹{finalGrandTotal.toFixed(2)}</span>
          </div>

          {/* Cashback Earned */}
          <div className="p-3 bg-neutral-50 dark:bg-neutral-900/40 rounded-xl border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-[11px] mt-2">
            <span className="text-neutral-500 font-medium">Wallet Cashback on Delivery</span>
            <span className="font-bold text-neutral-950 dark:text-white">+₹{Math.floor(finalGrandTotal / 100) * 2}.00 (2%)</span>
          </div>
        </div>

        {/* 8. ORDER PLACEMENT BUTTON / COD SLIDER */}
        <div className="pt-2">
          {paymentMethod === 'ONLINE' ? (
            /* PREPAID ONLINE BUTTON */
            <button
              type="submit"
              disabled={isLoading || !acceptedPolicies || (deliveryType === 'founder' && !isKolkataLocation)}
              className="btn-primary w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Initializing Payment...
                </span>
              ) : (
                <>
                  <span>Pay ₹{finalGrandTotal.toFixed(2)} with Razorpay</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            /* PREMIUM COD SLIDE TO CONFIRM */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="font-bold uppercase tracking-wider text-[10px]">Cash On Delivery</span>
                <span>Slide knob all the way right to confirm</span>
              </div>

              <div 
                ref={trackRef}
                className="h-16 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-2xl relative p-1 overflow-hidden shadow-xl select-none"
              >
                {/* Track Background Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
                  <p className="text-xs sm:text-sm font-black tracking-widest uppercase flex items-center gap-2 text-neutral-300 dark:text-neutral-700">
                    {isLoading ? (
                      <span className="flex items-center gap-2 text-white dark:text-black">
                        <Loader2 className="w-4 h-4 animate-spin" /> Placing COD Order...
                      </span>
                    ) : (
                      <>
                        <span>SLIDE TO PLACE COD ORDER</span>
                        <motion.span
                          animate={{ x: [0, 6, 0] }}
                          transition={{ repeat: Infinity, duration: 1.4 }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      </>
                    )}
                  </p>
                </div>

                {/* Draggable Knob */}
                {!isLoading && (
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: maxDrag }}
                    dragElastic={{ left: 0, right: 0.1 }}
                    dragSnapToOrigin={true}
                    onDragEnd={handleCodSlideConfirm}
                    className="absolute top-1 bottom-1 bg-[#c6a87c] rounded-xl flex items-center justify-center text-neutral-950 cursor-grab active:cursor-grabbing shadow-lg z-10"
                    style={{ 
                      width: 58,
                      height: 56
                    }}
                  >
                    <ArrowRight className="w-6 h-6 text-white stroke-[2.5]" />
                  </motion.div>
                )}
              </div>

              <p className="text-[11px] text-neutral-400 text-center">
                Total ₹{finalGrandTotal.toFixed(2)} to be paid in cash or UPI upon delivery.
              </p>
            </div>
          )}
        </div>
      </form>
    </>
  );
}
