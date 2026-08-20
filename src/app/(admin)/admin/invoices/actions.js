'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { numberToWordsIndian, isWestBengalState, calculateTaxInclusiveItem } from '@/lib/invoiceUtils';

async function checkAdmin(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return null;
  return user;
}

/**
 * 1-Click Generate Tax Invoice for a Confirmed Order
 */
export async function generateInvoiceForOrder(orderId) {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized: Admin access required.' };

  if (!orderId) return { error: 'Order ID is required.' };

  // 1. Fetch Order and Order Items
  const { data: order, error: orderError } = await adminSupabase
    .from('orders')
    .select('*, order_items(*, products(hsn_code, tax_rate, title, sku))')
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    return { error: 'Order not found.' };
  }

  // Check eligible order status (must be confirmed or beyond)
  const allowedStatuses = ['confirmed', 'packed', 'shipped', 'delivered', 'completed', 'return_approved'];
  if (!allowedStatuses.includes(order.order_status)) {
    return { 
      error: `Invoices can only be generated for orders in "Confirmed" status or beyond. Current status is "${order.order_status}".` 
    };
  }

  // Check if invoice already exists
  const { data: existingInvoice } = await adminSupabase
    .from('invoices')
    .select('id, invoice_number')
    .eq('order_id', orderId)
    .maybeSingle();

  if (existingInvoice) {
    return { 
      success: true, 
      alreadyExists: true, 
      invoiceNumber: existingInvoice.invoice_number 
    };
  }

  // 2. Fetch Store Settings
  const { data: settings } = await adminSupabase
    .from('settings')
    .select('*')
    .maybeSingle();

  const sellerLegalName = settings?.seller_legal_name || settings?.parent_company_name || 'Bytread International Private Limited';
  const sellerTradeName = settings?.seller_trade_name || settings?.company_name || 'FYXEN';
  const sellerAddress = settings?.seller_address || settings?.address || 'Jangipur, Murshidabad, West Bengal - 742213, India';
  const sellerGstin = settings?.seller_gstin || settings?.gst_number || '19ABCDE1234F1Z5';
  const sellerPan = settings?.seller_pan || 'ABCDE1234F';
  const sellerState = settings?.seller_state || 'West Bengal';
  const sellerStateCode = settings?.seller_state_code || '19';
  const defaultGstRate = Number(settings?.default_gst_rate) || 18;
  const invoicePrefix = settings?.invoice_prefix || 'FYX-INV-';
  const nextSeq = Number(settings?.next_invoice_number) || 1001;

  // 3. Determine Place of Supply & Tax Type
  const customerState = order.shipping_state || '';
  const customerPostalCode = order.shipping_postal_code || '';
  const customerCity = order.shipping_city || '';

  const isIntraState = isWestBengalState(customerState, customerPostalCode, customerCity);
  const placeOfSupply = `${customerState || 'West Bengal'} (${isIntraState ? '19' : 'Other'})`;

  // 4. Process Items with Tax-Inclusive Breakdown
  let totalTaxable = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;

  const invoiceItems = (order.order_items || []).map((item, index) => {
    const product = item.products || {};
    const hsn = product.hsn_code || '9617';
    const rate = Number(product.tax_rate) > 0 ? Number(product.tax_rate) : defaultGstRate;
    const unitPrice = Number(item.unit_price) || 0;
    const quantity = Number(item.quantity) || 1;

    const calc = calculateTaxInclusiveItem({
      quantity,
      unitPriceInclusive: unitPrice,
      taxRate: rate,
      isIntraState
    });

    totalTaxable += calc.taxableAmount;
    totalCgst += calc.cgst;
    totalSgst += calc.sgst;
    totalIgst += calc.igst;

    return {
      sr_no: index + 1,
      title: item.product_title_snapshot || product.title || 'Product Item',
      sku: item.sku_snapshot || product.sku || '',
      hsn,
      quantity,
      unit_price: unitPrice,
      tax_rate: rate,
      taxable_amount: calc.taxableAmount,
      cgst: calc.cgst,
      sgst: calc.sgst,
      igst: calc.igst,
      total: calc.totalPriceInclusive
    };
  });

  // Handle Delivery / Shipping fee (Tax Inclusive)
  const shippingAmount = Number(order.shipping_amount) || 0;
  if (shippingAmount > 0) {
    const shipCalc = calculateTaxInclusiveItem({
      quantity: 1,
      unitPriceInclusive: shippingAmount,
      taxRate: 18,
      isIntraState
    });
    totalTaxable += shipCalc.taxableAmount;
    totalCgst += shipCalc.cgst;
    totalSgst += shipCalc.sgst;
    totalIgst += shipCalc.igst;

    invoiceItems.push({
      sr_no: invoiceItems.length + 1,
      title: order.delivery_type === 'founder' 
        ? 'Hand Delivered By Founder Service' 
        : order.delivery_type === 'express' 
          ? 'Express Priority Shipping' 
          : 'Standard Delivery & Logistics',
      sku: 'SHIP-SVC',
      hsn: '9968',
      quantity: 1,
      unit_price: shippingAmount,
      tax_rate: 18,
      taxable_amount: shipCalc.taxableAmount,
      cgst: shipCalc.cgst,
      sgst: shipCalc.sgst,
      igst: shipCalc.igst,
      total: shippingAmount
    });
  }

  // Handle COD compliance fee (if any)
  const codFee = Number(order.cod_fee) || 0;
  if (codFee > 0) {
    const codCalc = calculateTaxInclusiveItem({
      quantity: 1,
      unitPriceInclusive: codFee,
      taxRate: 18,
      isIntraState
    });
    totalTaxable += codCalc.taxableAmount;
    totalCgst += codCalc.cgst;
    totalSgst += codCalc.sgst;
    totalIgst += codCalc.igst;

    invoiceItems.push({
      sr_no: invoiceItems.length + 1,
      title: 'COD Verification & Compliance Fee',
      sku: 'COD-SVC',
      hsn: '9968',
      quantity: 1,
      unit_price: codFee,
      tax_rate: 18,
      taxable_amount: codCalc.taxableAmount,
      cgst: codCalc.cgst,
      sgst: codCalc.sgst,
      igst: codCalc.igst,
      total: codFee
    });
  }

  // 5. Financial Totals
  const grandTotal = Number(order.grand_total) || 0;
  const discountAmount = Number(order.discount_amount) || 0;
  const totalTaxAmount = Number((totalCgst + totalSgst + totalIgst).toFixed(2));
  const amountInWords = numberToWordsIndian(grandTotal);

  // Generate Invoice Number
  const currentYear = new Date().getFullYear();
  const invoiceNumber = `${invoicePrefix}${currentYear}-${nextSeq}`;

  const customerBilling = {
    fullName: order.shipping_full_name,
    phone: order.shipping_phone,
    line1: order.shipping_line1,
    line2: order.shipping_line2,
    city: order.shipping_city,
    state: order.shipping_state,
    postalCode: order.shipping_postal_code,
    country: order.shipping_country || 'India'
  };

  // 6. Insert into Invoices Table
  const { data: invoice, error: insertError } = await adminSupabase
    .from('invoices')
    .insert({
      invoice_number: invoiceNumber,
      order_id: order.id,
      order_number: order.order_number,
      invoice_type: 'order',
      invoice_date: new Date().toISOString(),
      customer_name: order.shipping_full_name,
      customer_email: order.profiles?.email || null,
      customer_phone: order.shipping_phone,
      customer_gstin: null,
      billing_address: customerBilling,
      shipping_address: customerBilling,
      place_of_supply: placeOfSupply,
      seller_name: sellerLegalName,
      seller_brand: sellerTradeName,
      seller_address: sellerAddress,
      seller_gstin: sellerGstin,
      seller_pan: sellerPan,
      seller_state: sellerState,
      seller_state_code: sellerStateCode,
      items: invoiceItems,
      subtotal_taxable: Number(totalTaxable.toFixed(2)),
      tax_amount: totalTaxAmount,
      cgst_amount: Number(totalCgst.toFixed(2)),
      sgst_amount: Number(totalSgst.toFixed(2)),
      igst_amount: Number(totalIgst.toFixed(2)),
      shipping_amount: shippingAmount,
      cod_fee: codFee,
      discount_amount: discountAmount,
      grand_total: grandTotal,
      amount_in_words: amountInWords,
      payment_method: order.payment_method || 'ONLINE',
      payment_status: order.payment_status,
      razorpay_order_id: order.razorpay_order_id,
      razorpay_payment_id: order.razorpay_payment_id,
      notes: settings?.invoice_terms
    })
    .select('*')
    .single();

  if (insertError) {
    console.error('Invoice insert error:', insertError);
    return { error: insertError.message };
  }

  // 7. Increment Next Invoice Sequence Number
  if (settings?.id) {
    await adminSupabase
      .from('settings')
      .update({ next_invoice_number: nextSeq + 1 })
      .eq('id', settings.id);
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath(`/admin/invoices`);
  revalidatePath(`/account/orders/${orderId}`);

  return { success: true, invoiceNumber: invoice.invoice_number };
}

/**
 * Create Manual Invoice for Offline / External Sales
 */
export async function createManualInvoice(payload) {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const user = await checkAdmin(supabase);
  if (!user) return { error: 'Unauthorized: Admin access required.' };

  const {
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
    rawItems = [],
    notes
  } = payload;

  if (!customerName || !customerPhone) {
    return { error: 'Customer Name and Phone are required.' };
  }

  if (!rawItems || rawItems.length === 0) {
    return { error: 'At least one line item is required.' };
  }

  // Fetch Settings
  const { data: settings } = await adminSupabase
    .from('settings')
    .select('*')
    .maybeSingle();

  const sellerLegalName = settings?.seller_legal_name || settings?.parent_company_name || 'Bytread International Private Limited';
  const sellerTradeName = settings?.seller_trade_name || settings?.company_name || 'FYXEN';
  const sellerAddress = settings?.seller_address || settings?.address || 'Jangipur, Murshidabad, West Bengal - 742213, India';
  const sellerGstin = settings?.seller_gstin || settings?.gst_number || '19ABCDE1234F1Z5';
  const sellerPan = settings?.seller_pan || 'ABCDE1234F';
  const sellerState = settings?.seller_state || 'West Bengal';
  const sellerStateCode = settings?.seller_state_code || '19';
  const defaultGstRate = Number(settings?.default_gst_rate) || 18;
  const invoicePrefix = settings?.invoice_prefix || 'FYX-INV-';
  const nextSeq = Number(settings?.next_invoice_number) || 1001;

  const isIntraState = isWestBengalState(state, postalCode, city);
  const placeOfSupply = `${state || 'West Bengal'} (${isIntraState ? '19' : 'Other'})`;

  let totalTaxable = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;
  let grandTotal = 0;

  const invoiceItems = rawItems.map((item, index) => {
    const qty = Math.max(1, Number(item.quantity) || 1);
    const unitPrice = Number(item.unitPriceInclusive) || 0;
    const rate = Number(item.taxRate) > 0 ? Number(item.taxRate) : defaultGstRate;
    const hsn = item.hsn || '9617';

    const calc = calculateTaxInclusiveItem({
      quantity: qty,
      unitPriceInclusive: unitPrice,
      taxRate: rate,
      isIntraState
    });

    totalTaxable += calc.taxableAmount;
    totalCgst += calc.cgst;
    totalSgst += calc.sgst;
    totalIgst += calc.igst;
    grandTotal += calc.totalPriceInclusive;

    return {
      sr_no: index + 1,
      title: item.title || 'Product Item',
      sku: item.sku || '',
      hsn,
      quantity: qty,
      unit_price: unitPrice,
      tax_rate: rate,
      taxable_amount: calc.taxableAmount,
      cgst: calc.cgst,
      sgst: calc.sgst,
      igst: calc.igst,
      total: calc.totalPriceInclusive
    };
  });

  const totalTaxAmount = Number((totalCgst + totalSgst + totalIgst).toFixed(2));
  const amountInWords = numberToWordsIndian(grandTotal);

  const currentYear = new Date().getFullYear();
  const invoiceNumber = `${invoicePrefix}${currentYear}-${nextSeq}`;

  const customerAddressObj = {
    fullName: customerName,
    phone: customerPhone,
    line1: addressLine1 || '',
    city: city || '',
    state: state || 'West Bengal',
    postalCode: postalCode || '',
    country: 'India'
  };

  const { data: invoice, error: insertError } = await adminSupabase
    .from('invoices')
    .insert({
      invoice_number: invoiceNumber,
      order_id: null,
      order_number: `OFFLINE-${Date.now().toString().slice(-6)}`,
      invoice_type: 'manual',
      invoice_date: new Date().toISOString(),
      customer_name: customerName,
      customer_email: customerEmail || null,
      customer_phone: customerPhone,
      customer_gstin: customerGstin || null,
      billing_address: customerAddressObj,
      shipping_address: customerAddressObj,
      place_of_supply: placeOfSupply,
      seller_name: sellerLegalName,
      seller_brand: sellerTradeName,
      seller_address: sellerAddress,
      seller_gstin: sellerGstin,
      seller_pan: sellerPan,
      seller_state: sellerState,
      seller_state_code: sellerStateCode,
      items: invoiceItems,
      subtotal_taxable: Number(totalTaxable.toFixed(2)),
      tax_amount: totalTaxAmount,
      cgst_amount: Number(totalCgst.toFixed(2)),
      sgst_amount: Number(totalSgst.toFixed(2)),
      igst_amount: Number(totalIgst.toFixed(2)),
      shipping_amount: 0,
      cod_fee: 0,
      discount_amount: 0,
      grand_total: Number(grandTotal.toFixed(2)),
      amount_in_words: amountInWords,
      payment_method: paymentMethod || 'CASH',
      payment_status: 'paid',
      transaction_ref: transactionRef || null,
      notes: notes || settings?.invoice_terms
    })
    .select('*')
    .single();

  if (insertError) {
    console.error('Manual invoice insert error:', insertError);
    return { error: insertError.message };
  }

  // Increment sequence
  if (settings?.id) {
    await adminSupabase
      .from('settings')
      .update({ next_invoice_number: nextSeq + 1 })
      .eq('id', settings.id);
  }

  revalidatePath('/admin/invoices');
  return { success: true, invoiceNumber: invoice.invoice_number };
}
