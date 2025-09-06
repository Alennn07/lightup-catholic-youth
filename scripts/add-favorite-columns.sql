-- Add favorite columns to user_progress table
-- Run this SQL in your Supabase Dashboard SQL Editor

-- Add is_favorited column to user_progress table
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS is_favorited BOOLEAN DEFAULT FALSE;

-- Add favorited_at column to user_progress table
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS favorited_at TIMESTAMP WITH TIME ZONE;

-- Create index for better query performance on favorite status
CREATE INDEX IF NOT EXISTS idx_user_progress_is_favorited 
ON user_progress (user_id, is_favorited);

-- Create index for favorited_at for sorting
CREATE INDEX IF NOT EXISTS idx_user_progress_favorited_at 
ON user_progress (favorited_at);

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_progress' 
AND column_name IN ('is_favorited', 'favorited_at')
ORDER BY column_name;
