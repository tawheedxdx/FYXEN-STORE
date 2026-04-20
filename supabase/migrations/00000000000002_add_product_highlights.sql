-- Add highlights column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb;
