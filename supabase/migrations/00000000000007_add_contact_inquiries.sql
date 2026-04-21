-- Create contact_inquiries table
CREATE TABLE contact_inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Enable RLS
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Policies
-- Anyone can insert (to allow non-logged in users to contact)
CREATE POLICY "Anyone can insert inquiries" ON contact_inquiries FOR INSERT WITH CHECK (TRUE);

-- Only admins can view and manage
CREATE POLICY "Admins manage inquiries" ON contact_inquiries FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);
