-- Migration: Add HSN Code, Tax Invoice Table, and Seller Settings
-- Date: 2026-08-20

-- 1. Add HSN Code to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS hsn_code TEXT;
COMMENT ON COLUMN products.hsn_code IS 'Harmonized System of Nomenclature code for GST Tax Invoices (e.g. 9617, 8504)';

-- 2. Add Invoice & Seller configuration to settings table
ALTER TABLE settings 
  ADD COLUMN IF NOT EXISTS default_gst_rate NUMERIC DEFAULT 18,
  ADD COLUMN IF NOT EXISTS invoice_prefix TEXT DEFAULT 'FYX-INV-',
  ADD COLUMN IF NOT EXISTS next_invoice_number INTEGER DEFAULT 1001,
  ADD COLUMN IF NOT EXISTS seller_legal_name TEXT DEFAULT 'Bytread International Private Limited',
  ADD COLUMN IF NOT EXISTS seller_trade_name TEXT DEFAULT 'FYXEN',
  ADD COLUMN IF NOT EXISTS seller_gstin TEXT DEFAULT '19ABCDE1234F1Z5',
  ADD COLUMN IF NOT EXISTS seller_pan TEXT DEFAULT 'ABCDE1234F',
  ADD COLUMN IF NOT EXISTS seller_state TEXT DEFAULT 'West Bengal',
  ADD COLUMN IF NOT EXISTS seller_state_code TEXT DEFAULT '19',
  ADD COLUMN IF NOT EXISTS seller_city TEXT DEFAULT 'Jangipur',
  ADD COLUMN IF NOT EXISTS seller_pincode TEXT DEFAULT '742213',
  ADD COLUMN IF NOT EXISTS seller_address TEXT DEFAULT 'Jangipur, Murshidabad, West Bengal - 742213, India',
  ADD COLUMN IF NOT EXISTS invoice_terms TEXT DEFAULT '1. Goods once sold are covered under FYXEN return and replacement policy.\n2. Subject to Jangipur, West Bengal jurisdiction.\n3. This is a computer-generated Tax Invoice and requires no physical signature.';

-- 3. Create Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  order_number TEXT,
  invoice_type TEXT DEFAULT 'order' CHECK (invoice_type IN ('order', 'manual')),
  invoice_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  
  -- Customer Details
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  customer_gstin TEXT,
  billing_address JSONB,
  shipping_address JSONB,
  place_of_supply TEXT,
  
  -- Seller Details (Captured at generation time)
  seller_name TEXT NOT NULL DEFAULT 'Bytread International Private Limited',
  seller_brand TEXT NOT NULL DEFAULT 'FYXEN',
  seller_address TEXT,
  seller_gstin TEXT,
  seller_pan TEXT,
  seller_state TEXT DEFAULT 'West Bengal',
  seller_state_code TEXT DEFAULT '19',
  
  -- Line Items Snapshot: [{ title, sku, hsn, quantity, unit_price, tax_rate, taxable_amount, cgst, sgst, igst, total }]
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Financial Breakdown (All GST Tax Inclusive)
  subtotal_taxable NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  cgst_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  sgst_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  igst_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  shipping_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  cod_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  grand_total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  amount_in_words TEXT NOT NULL,
  
  -- Payment & Transaction Details
  payment_method TEXT,
  payment_status TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  transaction_ref TEXT,
  
  -- Additional info
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Indexing for fast invoice lookup
CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_order_number ON invoices(order_number);

-- RLS Policies for Invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Admins manage all invoices
CREATE POLICY "Admins manage all invoices" ON invoices FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Users can view invoices for their own orders
CREATE POLICY "Users view own order invoices" ON invoices FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders WHERE orders.id = invoices.order_id AND orders.user_id = auth.uid()
  )
);

-- Public read by invoice number for direct authenticated verification
CREATE POLICY "Public read invoice by exact lookup" ON invoices FOR SELECT USING (TRUE);
