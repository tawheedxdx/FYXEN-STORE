-- Add loyalty points columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0;

-- Add loyalty columns to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS loyalty_discount DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS loyalty_points_earned INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS loyalty_points_redeemed INTEGER DEFAULT 0;

-- Update RLS for profiles to allow users to see their points
-- (Profiles RLS already allows users to see their own records, so no change needed there)
-- Function to safely increment loyalty points
CREATE OR REPLACE FUNCTION increment_loyalty_points(user_uuid UUID, points_to_add INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET loyalty_points = COALESCE(loyalty_points, 0) + points_to_add
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
