-- Add site_mode column to settings table
ALTER TABLE settings ADD COLUMN IF NOT EXISTS site_mode TEXT DEFAULT 'online' CHECK (site_mode IN ('online', 'offline', 'maintenance'));

-- Ensure there is at least one row in settings
INSERT INTO settings (company_name, site_mode)
SELECT 'Fyxen', 'online'
WHERE NOT EXISTS (SELECT 1 FROM settings);
