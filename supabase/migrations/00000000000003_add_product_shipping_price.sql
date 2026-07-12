-- Add shipping_price column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS shipping_price DECIMAL(10, 2) DEFAULT 0.00;
