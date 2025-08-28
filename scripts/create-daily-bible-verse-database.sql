-- Daily Bible Verse Database Setup
-- This script creates tables for tracking user progress and favorites

-- 1. User Verse Progress Table - Track daily readings
CREATE TABLE IF NOT EXISTS user_verse_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    verse_id TEXT NOT NULL, -- Bible verse reference (e.g., "John 3:16")
    verse_date DATE NOT NULL, -- Date the verse was assigned
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one progress record per user per verse per date
    UNIQUE(user_id, verse_id, verse_date)
);

-- 2. Favorite Verses Table - User's favorite verses
CREATE TABLE IF NOT EXISTS favorite_verses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    verse_id TEXT NOT NULL, -- Bible verse reference
    verse_text TEXT NOT NULL, -- The actual verse text
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one favorite per user per verse
    UNIQUE(user_id, verse_id)
);

-- 3. Bible Verses Table - Store verse content and metadata
CREATE TABLE IF NOT EXISTS bible_verses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    verse_id TEXT UNIQUE NOT NULL, -- Bible reference (e.g., "John 3:16")
    verse_text TEXT NOT NULL, -- The actual verse text
    book TEXT NOT NULL, -- Book name
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    translation TEXT DEFAULT 'NIV', -- Bible translation
    theme TEXT, -- Theme category (e.g., "Love", "Hope", "Faith")
    reflection TEXT, -- Youth-focused reflection
    action_prompt TEXT, -- Action item for the day
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Daily Verse Assignments Table - Track which verses are assigned each day
CREATE TABLE IF NOT EXISTS daily_verse_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    verse_id TEXT REFERENCES bible_verses(verse_id),
    assigned_date DATE UNIQUE NOT NULL,
    theme TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_verse_progress_user_id ON user_verse_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_verse_progress_verse_date ON user_verse_progress(verse_date);
CREATE INDEX IF NOT EXISTS idx_favorite_verses_user_id ON favorite_verses(user_id);
CREATE INDEX IF NOT EXISTS idx_bible_verses_theme ON bible_verses(theme);
CREATE INDEX IF NOT EXISTS idx_daily_verse_assignments_date ON daily_verse_assignments(assigned_date);

-- Enable Row Level Security (RLS)
ALTER TABLE user_verse_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_verse_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own progress
CREATE POLICY "Users can view own verse progress" ON user_verse_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verse progress" ON user_verse_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own verse progress" ON user_verse_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see their own favorites
CREATE POLICY "Users can view own favorite verses" ON favorite_verses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorite verses" ON favorite_verses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorite verses" ON favorite_verses
    FOR DELETE USING (auth.uid() = user_id);

-- Bible verses are public (readable by all)
CREATE POLICY "Bible verses are public" ON bible_verses
    FOR SELECT USING (true);

-- Daily assignments are public
CREATE POLICY "Daily verse assignments are public" ON daily_verse_assignments
    FOR SELECT USING (true);

-- Insert some sample data for testing
INSERT INTO bible_verses (verse_id, verse_text, book, chapter, verse, theme, reflection, action_prompt) VALUES
('John 3:16', 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', 'John', 3, 16, 'Love', 'God''s love is unconditional and eternal. He gave everything for us. How can you show this kind of love to others today?', 'Tell someone you love them today'),
('Proverbs 17:17', 'A friend loves at all times, and a brother is born for a time of adversity.', 'Proverbs', 17, 17, 'Friendship', 'True friends stick with you through the good times and the bad. They''re the ones who celebrate your victories and pick you up when you fall.', 'Reach out to a friend who might be going through a hard time'),
('Philippians 4:13', 'I can do all this through him who gives me strength.', 'Philippians', 4, 13, 'Strength', 'With God''s help, you can overcome any challenge. His strength is available to you every day.', 'Face a difficult situation with confidence today'),
('Psalm 119:105', 'Your word is a lamp for my feet, a light on my path.', 'Psalms', 119, 105, 'Guidance', 'God''s Word guides us like a flashlight in the dark. It shows us the right way to go.', 'Read a Bible verse and think about how it guides you'),
('Matthew 28:19', 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.', 'Matthew', 28, 19, 'Mission', 'Jesus calls us to share His love with others. You don''t need to travel far to make a difference.', 'Share your faith with one person today');

-- Insert today's verse assignment
INSERT INTO daily_verse_assignments (verse_id, assigned_date, theme) VALUES
('Proverbs 17:17', CURRENT_DATE, 'Friendship')
ON CONFLICT (assigned_date) DO NOTHING;

-- Create a function to get user's reading streak
CREATE OR REPLACE FUNCTION get_user_reading_streak(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    streak_count INTEGER := 0;
    current_date DATE := CURRENT_DATE;
    check_date DATE;
BEGIN
    -- Check consecutive days backwards from today
    LOOP
        -- Check if user has read a verse on this date
        SELECT 1 INTO check_date
        FROM user_verse_progress
        WHERE user_id = user_uuid 
        AND verse_date = current_date
        AND is_completed = true
        LIMIT 1;
        
        -- If no verse read on this date, break the streak
        IF check_date IS NULL THEN
            EXIT;
        END IF;
        
        streak_count := streak_count + 1;
        current_date := current_date - INTERVAL '1 day';
    END LOOP;
    
    RETURN streak_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
