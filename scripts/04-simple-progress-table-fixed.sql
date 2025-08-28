-- Simple Progress Table - FIXED VERSION
-- This creates just ONE table with compatible syntax

-- Drop the table if it exists (clean start)
DROP TABLE IF EXISTS user_verse_progress;

-- Create the user_verse_progress table
CREATE TABLE user_verse_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    verse_id TEXT NOT NULL,
    verse_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a simple index for performance
CREATE INDEX idx_user_verse_progress_user_date 
ON user_verse_progress(user_id, verse_date);

-- Enable RLS
ALTER TABLE user_verse_progress ENABLE ROW LEVEL SECURITY;

-- Drop policy if exists (compatible syntax)
DROP POLICY IF EXISTS "Users can manage their own progress" ON user_verse_progress;

-- Create policy (compatible syntax)
CREATE POLICY "Users can manage their own progress" 
ON user_verse_progress 
FOR ALL 
USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON user_verse_progress TO authenticated;
GRANT USAGE ON SEQUENCE user_verse_progress_id_seq TO authenticated;

-- Success message
SELECT '✅ user_verse_progress table created successfully!' as status;
