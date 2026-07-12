-- Add coupon_id column to orders table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='coupon_id') THEN
        ALTER TABLE orders ADD COLUMN coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create function to increment coupon usage
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE coupons
    SET used_count = COALESCE(used_count, 0) + 1,
        updated_at = timezone('utc', now())
    WHERE id = coupon_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
