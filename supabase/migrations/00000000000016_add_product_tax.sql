-- Add tax_rate to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS tax_rate NUMERIC DEFAULT 0;

-- Comment for clarity
COMMENT ON COLUMN products.tax_rate IS 'Tax or GST percentage for this product (e.g. 18 for 18%)';
