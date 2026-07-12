-- Create announcements table for storefront banner
CREATE TABLE announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  bg_color TEXT DEFAULT '#09090b',
  text_color TEXT DEFAULT '#ffffff',
  link_url TEXT,
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  ends_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Public read access for active announcements
CREATE POLICY "Public read active announcements" ON announcements FOR SELECT USING (
  is_active = TRUE AND 
  (starts_at IS NULL OR starts_at <= now()) AND 
  (ends_at IS NULL OR ends_at >= now())
);

-- Admin full access
CREATE POLICY "Admins manage announcements" ON announcements FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);
