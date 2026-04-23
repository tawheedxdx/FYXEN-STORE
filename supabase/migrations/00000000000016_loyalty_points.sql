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

-- Function to award points on delivery
CREATE OR REPLACE FUNCTION award_points_on_delivery()
RETURNS trigger AS $$
BEGIN
  -- Check if order status changed to 'delivered'
  IF (NEW.order_status = 'delivered' AND (OLD.order_status IS NULL OR OLD.order_status != 'delivered')) THEN
    -- Only award if there are points to be earned
    IF (NEW.loyalty_points_earned > 0) THEN
      UPDATE profiles
      SET loyalty_points = COALESCE(loyalty_points, 0) + NEW.loyalty_points_earned
      WHERE id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for awarding points
CREATE OR REPLACE TRIGGER on_order_delivered
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE PROCEDURE award_points_on_delivery();
