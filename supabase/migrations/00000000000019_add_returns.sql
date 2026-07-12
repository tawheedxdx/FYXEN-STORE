-- Alter orders and settings tables
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS return_validity_days INTEGER DEFAULT 7;

-- Create return_questions table
CREATE TABLE IF NOT EXISTS return_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'mcq', 'image')),
  options JSONB DEFAULT '[]'::jsonb,
  required BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Create return_requests table
CREATE TABLE IF NOT EXISTS return_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  items JSONB NOT NULL, -- list of returned items: [{order_item_id, product_title, quantity}]
  answers JSONB NOT NULL, -- [{question_id, question_text, type, answer, image_url}]
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Enable RLS on new tables
ALTER TABLE return_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist to support re-run
DROP POLICY IF EXISTS "Public read active questions" ON return_questions;
DROP POLICY IF EXISTS "Admin manage questions" ON return_questions;
DROP POLICY IF EXISTS "Users view own return requests" ON return_requests;
DROP POLICY IF EXISTS "Users insert own return requests" ON return_requests;
DROP POLICY IF EXISTS "Admins update return requests" ON return_requests;
DROP POLICY IF EXISTS "Public Access Return Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users upload return images" ON storage.objects;

-- RLS policies for return_questions
CREATE POLICY "Public read active questions" ON return_questions
  FOR SELECT USING (is_active = true OR is_admin());

CREATE POLICY "Admin manage questions" ON return_questions
  FOR ALL USING (is_admin());

-- RLS policies for return_requests
CREATE POLICY "Users view own return requests" ON return_requests
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users insert own return requests" ON return_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins update return requests" ON return_requests
  FOR UPDATE USING (is_admin());

-- Storage policies for return-images bucket
-- Insert bucket record if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('return-images', 'return-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage objects (return-images bucket)
CREATE POLICY "Public Access Return Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'return-images');

CREATE POLICY "Authenticated users upload return images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'return-images');
