-- Enable RLS
ALTER TABLE promo_banners ENABLE ROW LEVEL SECURITY;

-- Public read access for active banners
CREATE POLICY "Public can view active promo banners" ON promo_banners
  FOR SELECT USING (is_active = true);

-- Admin full access
CREATE POLICY "Admins have full access to promo banners" ON promo_banners
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
