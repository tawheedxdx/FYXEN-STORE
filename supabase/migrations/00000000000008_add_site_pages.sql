-- Create site_pages table for dynamic legal/policy content
CREATE TABLE site_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT, -- HTML content
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Enable RLS
ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read site_pages" ON site_pages FOR SELECT USING (TRUE);

-- Admin full access
CREATE POLICY "Admins manage site_pages" ON site_pages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Seed initial content
INSERT INTO site_pages (slug, title, content) VALUES 
('privacy-policy', 'Privacy Policy', '<p>Last updated: April 2026</p><p>Bytread International Private Limited ("we", "our", "us") respects your privacy. This policy explains how we collect, use, and safeguard your information when you visit the Fyxen website.</p><h2>1. Information We Collect</h2><p>We collect personal information that you provide to us directly, such as your name, email address, shipping address, and payment details when making a purchase.</p>'),
('terms-and-conditions', 'Terms & Conditions', '<p>Welcome to Fyxen. By accessing this website, you agree to comply with these terms and conditions...</p>'),
('shipping-policy', 'Shipping Policy', '<p>We offer express shipping across India. Orders are typically processed within 24-48 hours...</p>'),
('cancellation-refunds', 'Cancellation & Refunds', '<p>You may cancel your order before it has been shipped. Refunds are processed within 5-7 business days...</p>'),
('faq', 'Frequently Asked Questions', '<h2>How can I track my order?</h2><p>You can track your order using the Tracking page on our website.</p>');
