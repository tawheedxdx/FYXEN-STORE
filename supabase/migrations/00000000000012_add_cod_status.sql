-- Update payment_status check constraint to include 'cod'
ALTER TABLE orders DROP CONSTRAINT orders_payment_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'refunded', 'cod'));

-- Update order_status check constraint to ensure it's robust
ALTER TABLE orders DROP CONSTRAINT orders_order_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_order_status_check CHECK (order_status IN ('pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded'));
