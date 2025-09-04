-- Quick fix to ensure all columns exist
ALTER TABLE prayer_requests 
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Other',
ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE journal_entries 
ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS entry_date DATE DEFAULT CURRENT_DATE;

-- Update existing records
UPDATE prayer_requests SET category = 'Other' WHERE category IS NULL;
