-- Add is_guest flag to profiles
ALTER TABLE profiles ADD COLUMN is_guest BOOLEAN DEFAULT FALSE;
