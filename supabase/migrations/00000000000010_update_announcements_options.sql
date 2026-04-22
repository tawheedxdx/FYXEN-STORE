-- Update announcements table with stickiness and page visibility
ALTER TABLE announcements 
ADD COLUMN is_sticky BOOLEAN DEFAULT TRUE,
ADD COLUMN display_pages TEXT[] DEFAULT ARRAY['all'];

-- Update existing records if any
UPDATE announcements SET is_sticky = TRUE, display_pages = ARRAY['all'] WHERE is_sticky IS NULL;
