-- Add parent_id to categories for hierarchical parent-child relationships
ALTER TABLE categories ADD COLUMN parent_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Create index for faster parent lookup
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
