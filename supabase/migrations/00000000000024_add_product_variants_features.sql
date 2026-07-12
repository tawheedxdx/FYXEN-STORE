-- Add compare_at_price and images columns to product_variants
ALTER TABLE product_variants 
ADD COLUMN IF NOT EXISTS compare_at_price DECIMAL(10, 2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb NOT NULL;

-- Drop and recreate decrement_stock to support variant_id
DROP FUNCTION IF EXISTS public.decrement_stock(uuid, integer);
CREATE OR REPLACE FUNCTION public.decrement_stock(
    p_product_id uuid,
    p_quantity integer,
    p_variant_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
    current_stock INT;
BEGIN
    IF p_variant_id IS NOT NULL THEN
        -- Select for update locks the row to prevent concurrent race conditions
        SELECT stock_quantity INTO current_stock FROM product_variants WHERE id = p_variant_id FOR UPDATE;
        
        IF current_stock >= p_quantity THEN
            UPDATE product_variants SET stock_quantity = stock_quantity - p_quantity WHERE id = p_variant_id;
            RETURN TRUE;
        ELSE
            RETURN FALSE;
        END IF;
    ELSE
        -- Select for update locks the row to prevent concurrent race conditions
        SELECT stock_quantity INTO current_stock FROM products WHERE id = p_product_id FOR UPDATE;
        
        IF current_stock >= p_quantity THEN
            UPDATE products SET stock_quantity = stock_quantity - p_quantity WHERE id = p_product_id;
            RETURN TRUE;
        ELSE
            RETURN FALSE;
        END IF;
    END IF;
END;
$$;

-- Update process_order_status_change trigger function to restore variant stock on cancellation
CREATE OR REPLACE FUNCTION public.process_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    item RECORD;
BEGIN
    -- A. CREDIT CASHBACK: When status becomes 'delivered'
    IF NEW.order_status = 'delivered' AND (OLD.order_status IS NULL OR OLD.order_status != 'delivered') THEN
        IF NEW.wallet_cashback_amount > 0 AND NEW.cashback_credited = false THEN
            UPDATE profiles SET wallet_balance = wallet_balance + NEW.wallet_cashback_amount WHERE id = NEW.user_id;
            INSERT INTO wallet_transactions (user_id, amount, type, status, description)
            VALUES (NEW.user_id, NEW.wallet_cashback_amount, 'bonus', 'completed', 'Order Cashback (Order: ' || NEW.order_number || ')');
            NEW.cashback_credited = true;
        END IF;
    END IF;

    -- B. REVERSE CASHBACK: If status moves AWAY from 'delivered'
    IF OLD.order_status = 'delivered' AND NEW.order_status != 'delivered' THEN
        IF NEW.cashback_credited = true THEN
            UPDATE profiles SET wallet_balance = wallet_balance - NEW.wallet_cashback_amount WHERE id = NEW.user_id;
            INSERT INTO wallet_transactions (user_id, amount, type, status, description)
            VALUES (NEW.user_id, -NEW.wallet_cashback_amount, 'bonus', 'completed', 'Cashback Reversal (Order: ' || NEW.order_number || ')');
            NEW.cashback_credited = false;
        END IF;
    END IF;

    -- C. RESTORE STOCK: If status becomes 'cancelled'
    IF NEW.order_status = 'cancelled' AND (OLD.order_status IS NULL OR OLD.order_status != 'cancelled') AND (OLD.order_status IS NOT NULL AND OLD.order_status != 'pending') THEN
        FOR item IN SELECT product_id, variant_id, quantity FROM order_items WHERE order_id = NEW.id LOOP
            IF item.variant_id IS NOT NULL THEN
                UPDATE product_variants SET stock_quantity = stock_quantity + item.quantity WHERE id = item.variant_id;
            ELSE
                UPDATE products SET stock_quantity = stock_quantity + item.quantity WHERE id = item.product_id;
            END IF;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$;
