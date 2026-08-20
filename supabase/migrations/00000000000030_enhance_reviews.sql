-- Migration: Enhance reviews table for verified buyer checks and admin portal review creation

-- 1. Allow user_id to be nullable for admin-created reviews
ALTER TABLE reviews ALTER COLUMN user_id DROP NOT NULL;

-- 2. Drop the rigid unique constraint if present, and add a partial unique index for registered users only
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_product_id_user_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_product_user ON reviews(product_id, user_id) WHERE user_id IS NOT NULL;

-- 3. Add author_name, author_city, is_verified columns if they do not exist
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS author_city TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT TRUE;

-- 4. Ensure admin has full permissions on reviews
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Admins can manage all reviews'
  ) THEN
    CREATE POLICY "Admins can manage all reviews" ON reviews FOR ALL USING (is_admin());
  END IF;
END $$;
