-- Emergency fix for missing columns
-- This will definitely work

-- First, check if columns exist and add them
DO $$ 
BEGIN
    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prayer_requests' AND column_name = 'category') THEN
        ALTER TABLE prayer_requests ADD COLUMN category VARCHAR(50) DEFAULT 'Other';
    END IF;
    
    -- Add image_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prayer_requests' AND column_name = 'image_url') THEN
        ALTER TABLE prayer_requests ADD COLUMN image_url TEXT;
    END IF;
    
    -- Add id column to journal_entries if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'journal_entries' AND column_name = 'id') THEN
        ALTER TABLE journal_entries ADD COLUMN id UUID PRIMARY KEY DEFAULT uuid_generate_v4();
    END IF;
    
    -- Add image_urls column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'journal_entries' AND column_name = 'image_urls') THEN
        ALTER TABLE journal_entries ADD COLUMN image_urls TEXT[] DEFAULT '{}';
    END IF;
    
    -- Add entry_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'journal_entries' AND column_name = 'entry_date') THEN
        ALTER TABLE journal_entries ADD COLUMN entry_date DATE DEFAULT CURRENT_DATE;
    END IF;
END $$;

-- Update existing records
UPDATE prayer_requests SET category = 'Other' WHERE category IS NULL;

-- Show the results
SELECT 'prayer_requests columns:' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'prayer_requests' 
ORDER BY column_name;

SELECT 'journal_entries columns:' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'journal_entries' 
ORDER BY column_name;
