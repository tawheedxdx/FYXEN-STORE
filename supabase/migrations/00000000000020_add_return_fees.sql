-- Alter settings and return_requests tables to support return fees
ALTER TABLE settings ADD COLUMN IF NOT EXISTS return_fee_under_1000 INTEGER DEFAULT 0;
ALTER TABLE return_requests ADD COLUMN IF NOT EXISTS return_fee INTEGER DEFAULT 0;
