-- Create offers table for promotions and giveaways
CREATE TABLE offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  terms TEXT,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  image_url TEXT,
  active BOOLEAN DEFAULT TRUE NOT NULL,
  eligible_product_ids UUID[] DEFAULT '{}'::UUID[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policy: Allow anyone to view active offers within their validity date range
CREATE POLICY "Public read active offers" ON offers FOR SELECT USING (
  active = TRUE AND
  starts_at <= now() AND
  ends_at >= now()
);

-- 2. Admin Manage Policy: Allow administrators to perform any operation (ALL) on offers
CREATE POLICY "Admins manage offers" ON offers FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
