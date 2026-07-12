-- Storage policies for Fyxen Store

-- 1. Public Access: Allow anyone to view images in public buckets
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (
  bucket_id IN ('product-images', 'category-images', 'banners', 'brand-assets')
);

-- 2. Admin Access: Allow admins to upload/manage images
-- We check if the user is an admin by looking up their role in the profiles table
CREATE POLICY "Admin Manage Storage" ON storage.objects FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
