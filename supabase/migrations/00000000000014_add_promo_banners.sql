-- Create promo_banners table
CREATE TABLE IF NOT EXISTS promo_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  badge_text TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  button_text TEXT DEFAULT 'Shop Now',
  button_link TEXT DEFAULT '/shop',
  bg_color TEXT DEFAULT '#E0FF00',
  text_color TEXT DEFAULT '#0F172A',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default banner
INSERT INTO promo_banners (badge_text, title, subtitle, button_text, button_link, bg_color, is_active)
VALUES (
  'Limited Time Offer', 
  'Summer Collection Now Live.', 
  'Get up to 20% off on your first order. Use code FYXEN20 at checkout.', 
  'Shop the Drop', 
  '/shop', 
  '#E0FF00', 
  true
) ON CONFLICT DO NOTHING;
