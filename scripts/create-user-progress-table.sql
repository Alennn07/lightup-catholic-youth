-- Create user_progress table for Daily Bible Verse tracking
-- Run this SQL in your Supabase Dashboard SQL Editor

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    verse_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_favorited BOOLEAN DEFAULT FALSE,
    favorited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Composite unique constraint to prevent duplicate entries per user per date
    UNIQUE(user_id, verse_date)
);

-- Create indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_date_completed 
ON user_progress (user_id, verse_date, is_completed);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id 
ON user_progress (user_id);

CREATE INDEX IF NOT EXISTS idx_user_progress_verse_date 
ON user_progress (verse_date);

CREATE INDEX IF NOT EXISTS idx_user_progress_completed_at 
ON user_progress (completed_at);

CREATE INDEX IF NOT EXISTS idx_user_progress_is_favorited 
ON user_progress (user_id, is_favorited);

CREATE INDEX IF NOT EXISTS idx_user_progress_favorited_at 
ON user_progress (favorited_at);

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_user_progress_updated_at();

-- Verify the table was created
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'user_progress' 
ORDER BY ordinal_position;
