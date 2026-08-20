-- Migration: Add featured_on_home column to reviews table for admin-curated homepage reviews wall

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS featured_on_home BOOLEAN DEFAULT FALSE;

-- Index for fast homepage lookup
CREATE INDEX IF NOT EXISTS idx_reviews_featured_on_home ON reviews(featured_on_home) WHERE featured_on_home = TRUE;
