-- Add missing columns for image upload functionality
-- This script adds the missing columns to support image uploads

-- Add missing columns to prayer_requests table
ALTER TABLE prayer_requests 
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Other',
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add missing columns to journal_entries table  
ALTER TABLE journal_entries 
ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS entry_date DATE DEFAULT CURRENT_DATE;

-- Update existing prayer requests to have a default category if null
UPDATE prayer_requests 
SET category = 'Other' 
WHERE category IS NULL;

-- Add constraints for prayer_requests category
ALTER TABLE prayer_requests 
ADD CONSTRAINT valid_prayer_category 
CHECK (category IN ('Health', 'Family', 'Education', 'Work', 'Spiritual', 'Other'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prayer_requests_category ON prayer_requests(category);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_image_url ON prayer_requests(image_url) WHERE image_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_journal_entries_image_urls ON journal_entries USING GIN(image_urls) WHERE image_urls IS NOT NULL;

-- Show the updated table structures
SELECT 
  'prayer_requests' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'prayer_requests' 
  AND column_name IN ('category', 'image_url')
ORDER BY column_name;

SELECT 
  'journal_entries' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'journal_entries' 
  AND column_name = 'image_urls'
ORDER BY column_name;
