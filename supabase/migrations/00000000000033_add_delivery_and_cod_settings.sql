-- Migration: Add delivery types, founder delivery, and COD compliance settings

-- 1. Add delivery settings to settings table
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS founder_delivery_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS founder_delivery_fee NUMERIC DEFAULT 10000,
ADD COLUMN IF NOT EXISTS standard_delivery_fee NUMERIC DEFAULT 30,
ADD COLUMN IF NOT EXISTS standard_delivery_free_threshold NUMERIC DEFAULT 499,
ADD COLUMN IF NOT EXISTS express_delivery_fee NUMERIC DEFAULT 50,
ADD COLUMN IF NOT EXISTS cod_compliance_fee NUMERIC DEFAULT 15;

-- 2. Add delivery type and fee tracking to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_type TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS cod_fee NUMERIC DEFAULT 0;

-- Index for delivery_type if needed
CREATE INDEX IF NOT EXISTS idx_orders_delivery_type ON orders(delivery_type);
