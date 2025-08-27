-- Add missing columns to youth group tables
-- This script adds the is_public column that the API expects

-- Add is_public column to group_events table
ALTER TABLE group_events 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Add is_public column to group_posts table  
ALTER TABLE group_posts 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Update existing records to have is_public = false
UPDATE group_events 
SET is_public = false 
WHERE is_public IS NULL;

UPDATE group_posts 
SET is_public = false 
WHERE is_public IS NULL;

-- Make the columns NOT NULL after setting defaults
ALTER TABLE group_events 
ALTER COLUMN is_public SET NOT NULL;

ALTER TABLE group_posts 
ALTER COLUMN is_public SET NOT NULL;

-- Verify the changes
SELECT 'group_events' as table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'group_events' AND column_name = 'is_public'
UNION ALL
SELECT 'group_posts' as table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'group_posts' AND column_name = 'is_public';
