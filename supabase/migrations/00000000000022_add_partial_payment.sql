-- Add columns to settings
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS partial_payment_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS partial_payment_percentage INTEGER DEFAULT 10;

-- Add columns to orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS partial_payment_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS cod_balance_amount DECIMAL(10, 2) DEFAULT 0;

-- Update payment_status check constraint in orders
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check 
CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'refunded', 'cod', 'partial_paid'));
