-- Add box_contents column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS box_contents JSONB DEFAULT '[]'::jsonb;
